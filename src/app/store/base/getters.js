export default {
    pages(state) {
        return _.range(1, _.isUndefined(state.pagination) ? 0 : state.pagination.pages + 1);
    },
    filterableColumns(state) {
        return _.filter(state.columns, function (col) {
            return col.visible && col.filterable;
        });
    },
    visibleColumns(state) {
        return _.filter(state.columns, 'visible');
    },
    columns(state) {
        return state.columns;
    },
    fields(state, context) {
        return _.union(
            state.permanentFields,
            _(context.getters.visibleColumns).map(function (col) {
                if (col.appends) {
                    return col.appends;
                }
                return col.key;
            })
                .flatten()
                .value()
        );
    },
    filters(state, context) {
        const filters = {
            integer: {
                operator: '='
            },
            boolean: {
                filter(values, col) {

                    return {
                        field: col.key,
                        operator: '=',
                        value: (values[0] === true || values[0] === 'true')
                    }
                }
            },
            date: {
                filter(value, col) {
                    const filter = {
                        operator: 'group',
                        filters: []
                    };

                    if (value === null) {
                        return {
                            field: col.key,
                            operator: '=',
                            value: null
                        }
                    }

                    if (value.min) {
                        filter.filters.push({
                            field: col.key,
                            operator: '>=',
                            value: moment(value.min, 'Y-M-D').format()
                        });
                    }

                    if (value.max) {
                        filter.filters.push({
                            field: col.key,
                            operator: '<=',
                            value: moment(value.max, 'Y-M-D').format()
                        });
                    }

                    return filter
                }
            },
            datetime: {
                filter(value, col) {
                    const filter = {
                        operator: 'group',
                        filters: []
                    };

                    if (value === null) {
                        return {
                            field: col.key,
                            operator: '=',
                            value: null
                        }
                    }

                    if (value.min) {
                        filter.filters.push({
                            field: col.key,
                            operator: '>=',
                            value: moment(value.min, 'Y-M-D HH:mm').format()
                        });
                    }

                    if (value.max) {
                        filter.filters.push({
                            field: col.key,
                            operator: '<=',
                            value: moment(value.max, 'Y-M-D HH:mm').format()
                        });
                    }

                    return filter
                }
            },
            string: {
                filter(values, col) {
                    const getFilterForValue = function (value) {
                        if (value === 'EMPTY') {
                            return {
                                operator: 'group',
                                filters: [
                                    {
                                        field: col.key,
                                        operator: '=',
                                        value: ''
                                    },
                                    {
                                        field: col.key,
                                        boolean: 'or',
                                        operator: '=',
                                        value: null
                                    },
                                ]
                            };
                        } else if (value === 'NOT_EMPTY') {
                            return {
                                operator: 'group',
                                filters: [
                                    {
                                        field: col.key,
                                        operator: '!=',
                                        value: ''
                                    },
                                    {
                                        field: col.key,
                                        boolean: 'and',
                                        operator: '!=',
                                        value: null
                                    },
                                ]
                            };
                        } else {
                            return {
                                field: col.key,
                                operator: 'LIKE',
                                value: (col.filter_information && col.filter_information.type === 'enum' && _.isInteger(value)) ? value : '%' + value + '%'
                            };
                        }
                    };
                    if (values.length === 1) {
                        return getFilterForValue(values[0]);
                    }
                    let boolean = undefined;
                    return _.reduce(values, (result, val) => {
                        if (val === ' OR ' || val === ' AND ') {
                            boolean = val.trim().toLowerCase();
                        } else {
                            const filter = getFilterForValue(val);
                            filter.boolean = boolean;
                            result.filters.push(filter);
                            boolean = (col.filter_information && col.filter_information.type === 'enum') ? 'or' : undefined;

                            // result.filters.push({
                            //     field: col.key,
                            //     boolean,
                            //     operator: 'LIKE',
                            //     value: (col.filter_information && col.filter_information.type === 'enum') ? val : '%' + val + '%'
                            // });
                        }
                        return result;
                    }, {operator: 'group', filters: []});
                }
            },
            exact_string_enum: {
                filter(values, col) {
                    const getFilterForValue = function (value) {
                        if (value === 'EMPTY') {
                            return {
                                operator: 'group',
                                filters: [
                                    {
                                        field: col.key,
                                        operator: '=',
                                        value: ''
                                    },
                                    {
                                        field: col.key,
                                        boolean: 'or',
                                        operator: '=',
                                        value: null
                                    },
                                ]
                            };
                        } else if (value === 'NOT_EMPTY') {
                            return {
                                operator: 'group',
                                filters: [
                                    {
                                        field: col.key,
                                        operator: '!=',
                                        value: ''
                                    },
                                    {
                                        field: col.key,
                                        boolean: 'and',
                                        operator: '!=',
                                        value: null
                                    },
                                ]
                            };
                        } else {
                            return {
                                field: col.key,
                                operator: '=',
                                value: value
                            };
                        }
                    };
                    if (values.length === 1) {
                        return getFilterForValue(values[0]);
                    }
                    let boolean = undefined;
                    return _.reduce(values, (result, val) => {
                        if (val === ' OR ' || val === ' AND ') {
                            boolean = val.trim().toLowerCase();
                        } else {
                            const filter = getFilterForValue(val);
                            filter.boolean = boolean;
                            result.filters.push(filter);
                            boolean = (col.filter_information && col.filter_information.type === 'enum') ? 'or' : undefined;

                            // result.filters.push({
                            //     field: col.key,
                            //     boolean,
                            //     operator: 'LIKE',
                            //     value: (col.filter_information && col.filter_information.type === 'enum') ? val : '%' + val + '%'
                            // });
                        }
                        return result;
                    }, {operator: 'group', filters: []});
                }
            }
        };

        filters.json = filters.string;

        return _(_.cloneDeep(state.filters))
            .merge(state.permanentFilters)
            .map(function (value, key) {
                var col = _.find(context.state.columns, {key: key});
                if (col) {
                    if (!col.filter && filters[col.type] && filters[col.type].filter) {
                        col.filter = filters[col.type].filter
                    }
                }
                return {col: col, value: _.cloneDeep(value)};
            })
            .filter(function (filter) {
                return !_.isUndefined(filter.value) && !_.isUndefined(filter.col);
            })
            .map(function (filter) {
                const operators = ['>', '>=', '<', '<=', '!='];
                const regex = /(>=|>|<=|<|!=| OR | AND )/

                let values = (filter.value instanceof Object || filter.value === null) ? filter.value : filter.value.toString()
                    .split(regex)
                    .filter(val => val.length);

                if (filter.col.filter) {
                    return filter.col.filter(values, filter.col)
                }

                let override = _.get(filters, filter.col.type, {});

                if (values.length === 1 && values[0]) {
                    return _.defaultsDeep(
                        _.clone(override),
                        {
                            field: filter.col.key,
                            operator: '=',
                            value: values[0] ? values[0].trim() : values[0]
                        });
                }

                let boolean = undefined;
                let operator = override.operator || '=';
                return _.reduce(values, (result, val) => {
                    if (_.includes([' OR ', ' AND '], val)) {
                        boolean = val.trim().toLowerCase();
                        return result;
                    }
                    if (_.includes(operators, val)) {
                        operator = val;
                        return result;
                    }

                    if (val) {
                        result.filters.push({
                            field: filter.col.key,
                            boolean,
                            operator,
                            value: val ? val.trim() : val
                        });
                    }
                    boolean = undefined;
                    operator = override.operator || '=';

                    return result;
                }, {operator: 'group', filters: []});

            })
            .filter()
            .value();
    },
    isFiltered(state) {
        return _.keys(state.filters).length > 0
    },
    listview(state) {
        return state.listview ? state.listview : state.name + 'ListView';
    },
    selectable(state) {
        return _.filter(state.actions, {level: 'selected'}).length > 0;
    },
    selectedCount(state) {
        return state.selection.selectAll ? state.pagination.total : _.filter(state.selection.selectedRows).length;
    },
    selectedFilters(state, context) {
        if (state.selection.selectAll) {
            return _.merge(state.autoFilters, {
                keyword: state.keyword,
                count: state.pagination.total,
                filters: context.getters.filters
            })
        }
        let selected = _(state.selection.selectedRows).pickBy(Boolean).keys().value();

        return {
            count: selected.length,
            filters: [{
                field: 'id',
                operator: 'IN',
                value: selected
            }]
        }
    },
    selectedRows(state) {
        return _.filter(state.data, row => state.selection.selectedRows[row.id]) || [];
    },
    slug(state) {
        let slug = state.slug;

        if (state.prefix) {
            slug = state.prefix + '/' + slug;
        }

        if (state.suffix) {
            slug = slug + '/' + state.suffix;
        }

        return slug;
    },
    exportSlug(state, store) {
        return state.exportSlugOverride ? state.exportSlugOverride : store.getters.slug;
    },
    backActions(state) {
        return _.filter(state.actions, {level: 'back'}) || [];
    },
    highlightActions(state) {
        return _.filter(state.actions, {level: 'highlight'}) || [];
    },
    globalActions(state) {
        return _.filter(state.actions, {level: 'global'}) || [];
    },
    specialFilters(state) {
        return _.filter(state.actions, {level: 'special-filters'}) || [];
    },
    settingsActions(state) {
        return _.filter(state.actions, {level: 'settings'}) || [];
    },
    emptyListActions(state) {
        const out = [];

        _.each(state.actions, (action) => {
            if (state.emptyListActions.indexOf(action.key) !== -1) {
                out.push(action);
            }
        });

        return out;
    },
    selectedActions(state) {
        return _(state.actions)
            .filter({level: 'selected'})
            .sortBy('title')
            .value() || [];
    },
    archivedActionsSelected(state) {
        return _.filter(state.actions, {level: 'archivedSelected'}) || [];
    },
    mainRowAction(state) {
        return _.find(state.actions, {level: 'row'})
    },
    otherRowActions(state) {
        let actions = _.filter(state.actions, {level: 'row'}) || [];
        actions.shift()
        return actions;
    }
}
