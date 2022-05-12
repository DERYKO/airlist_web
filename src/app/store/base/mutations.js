export default {
    setPusher(state, action) {
        state.pusher = action;
    },
    addAction(state, action) {
        state.actions[action.key] = action;
        if (action.initializeForState) {
            action.initializeForState(state);
        }
    },
    removeAction(state, key) {
        delete state.actions[key];
    },
    mergeState(state, update) {
        _.each(update, function (value, key) {
            if (_.isObject(value) && !_.isArray(value)) {
                value = _.defaultsDeep(value, _.get(state, key));
            }
            _.set(state, key, value);
        });
    },
    selectRow(state, id) {
        state.selection.selectedRows[id] = true;
    },
    setActions(state, actions) {
        state.actions = actions;
        state.mainRowAction = _.findIndex(context.state.actions, {level: 'row'});
    },
    setEmptyListActions(state, actions) {
        state.emptyListActions = actions;
    },
    setBusy(state, busy) {
        state.busy = busy;
    },
    setColumns(state, columns) {
        state.columns = columns
    },
    setSlug(state, slug) {
        state.slug = slug
    },
    setPrefix(state, prefix) {
        state.prefix = prefix
    },
    setSuffix(state, suffix) {
        state.suffix = suffix
    },
    setDefinitionsUrl(state, definitionsUrl) {
        state.definitionsUrl = definitionsUrl
    },
    setDataUrl(state, dataUrl) {
        state.dataUrl = dataUrl
    },
    setData(state, data) {
        state.data = data
    },
    setStats(state, stats) {
        state.stats = stats;
    },
    setArchived(state, archived) {
        state.archived = archived;
    },
    setFilter(state, {key, value}) {
        if (state.filters.length === 0) {
            state.filters = {}
        }
        state.filters[key] = value;
    },
    unsetFilter(state, {key}) {
        delete state.filters[key];
    },
    setFilters(state, filters) {
        state.filters = filters
    },
    setKeyword(state, keyword) {
        state.keyword = keyword
    },
    setViewMode(state, mode) {
        state.view.mode = mode;
    },
    setHideGuests(state, mode) {
        state.view.hideGuests = mode;
    },
    setVisible(state, visible) {
        state.visible = visible
    },
    setAddedFields(state, addedFields) {
        state.addedFields = addedFields
    },
    setListview(state, listview) {
        state.listview = listview
    },
    setTitle(state, title) {
        state.title = title
    },
    setAutoFilters(state, filters) {
        state.autoFilters = filters
    },
    setPermanentFilters(state, filters) {
        state.permanentFilters = filters
    },
    setPermanentColumns(state, columns) {
        state.permanentColumns = columns;
    },
    setPagination(state, pagination) {
        state.pagination = pagination
    },
    setSort(state, sort) {
        state.sort = sort
    },
    setSelectAll(state, select) {
        state.selection.selectAll = select;

        _.each(state.data, row => {
            state.selection.selectedRows[row.id] = select;
        });
    },
    setSelectAllWithReselect(state, select) {
        state.selection.selectAll = select;

        const selected = _(state.selection.selectedRows).pickBy(Boolean).keys().value();

        _.each(state.selection.selectedRows, (selected, id) => {
            state.selection.selectedRows[id] = false;
        });

        if (select || selected.length) {
            _.each(state.data, row => {
                state.selection.selectedRows[row.id] = selected.indexOf(row.id.toString()) > -1 ? true : select;
            });
        }
    },
    setVm(state, vm) {
        state.vm = vm;
    },
    setWorkflowKey(state, key) {
        state.workflowKey = key;
    },
    toggleFilters(state) {
        state.showFilters = !state.showFilters
    },
    unSelectRow(state, id) {
        state.selection.selectedRows[id] = false;
        state.selection.selectAll = false;
    },
    updateColumn(state, column) {
        var index = _.findIndex(state.columns, {key: column.key});
        if (index > -1) {
            state.columns[index] = column;
        } else {
            state.columns.push(column)
        }
    },
    disableExtendedListView(state) {
        state.extendedListView = false;
    }
};
