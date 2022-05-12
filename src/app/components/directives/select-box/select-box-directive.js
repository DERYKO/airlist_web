import templateUrl from './select-box-directive.tpl.html';


class SelectizeOptions {

    constructor(config) {

        this.count = 0;
        _(config)
            .defaultsDeep({
                loadThrottle: 500,
                displayField: 'name',
                valueField: 'id',
                labelField: 'label',
                searchField: 'label',
                sortField: {field: 'label', direction: 'asc'},
                includeArchived: false,
                hideSelected: true,
                maxItems: 1,
                preload: true,
            })
            .each((val, key) => {
                this[key] = val;
            });
        this.placeholder = this.placeholder || this.maxItems === 1 ? 'Select one' : 'Select one or more';

        this.load = this.load.bind(this);
        this.onChange = this.setSelected.bind(this);
        this.store.commit('setVisible', [this.valueField, this.displayField]);
        this.store.commit('setPagination', {perPage: 100});
    }

    load(query, callback) {
        if (this.store) {
            const state = this.store.state;

            if (!state.keyword && state.pagination.total && state.pagination.perPage > state.pagination.total) {
                return callback();
            }

            this.store.commit('setKeyword', query);
            this.store.dispatch('getData')
                .then(() => {
                    const items = _(this.store.state.data)
                        .sortBy(this.displayField)
                        .map(item => {
                            return {
                                label: _.get(item, this.displayField),
                                value: _.get(item, this.valueField),
                            }
                        })
                        .value();

                    this.count += items.length;
                    callback(items);
                }, () => callback());
        }
    }

    setSelected(selected) {
        if (selected === '') {
            selected = null;
        }
        if (this.store) {
            this.store.commit('setSelectAll', false);
            if (this.maxItems > 1) {
                return _.each(selected, val => {
                    this.store.commit('selectRow', val)
                });
            }
            this.store.commit('selectRow', selected)
        }
    }
}

class SelectBoxCtrl {
    constructor($element, $scope) {
        this.elements = $element;
        this.scope = $scope;
        this.initialSet = false;
    }

    $onInit() {
        this.getOptions(this);
        if (this.options.maxItems === 1 && this.model) {
            this.model = this.model.toString();
        }

        this.options.store.dispatch('getDefinitions')
            .then(() => {
                this.instance = _.first(this.elements.find('select')
                    .selectize(_.defaults({valueField: 'value'}, this.options)))
                    .selectize;

                this.scope.$watch(() => this.model, val => {
                    if (!_.isEqual(val, this.instance.getValue())) {
                        this.instance.setValue(val);
                    }
                });

                this.scope.$watch(() => this.disabled, disabled => {
                    disabled ? this.instance.disable() : this.instance.enable();
                });
            })


    }

    getOptions() {
        const vm = this;
        this.options = new SelectizeOptions(this.config);
        this.options.onChange = function (items) {
            if (!_.isEqual(vm.model, items)) {
                items = items === '' ? null : items;
                vm.model = items;
                vm.options.setSelected(items);
                vm.scope.$applyAsync();
            }
        };
        this.options.onLoad = function () {
            if (!vm.initialSet) {
                vm.initialSet = true;
                this.setValue(vm.model);
            }
            if (vm.model) {
                vm.loadMissingItems();
            }
        };
    }

    loadMissingItems() {
        let missing = this.options.maxItems > 1 ? this.model : [this.model];
        missing = missing.filter(id => !this.instance.options[id]);

        if (missing.length) {
            const pagination = _.clone(this.options.store.state.pagination);
            this.options.store.commit('setFilter', {key: this.options.valueField, value: missing});
            this.options.store.dispatch('getData').then(() => {
                this.options.store.state.data.forEach(item => {
                    this.instance.addOption({
                        label: _.get(item, this.options.displayField),
                        value: _.get(item, this.options.valueField),
                    });
                });
                this.instance.setValue(this.model);
                this.options.store.commit('setFilters', {});
                this.options.store.commit('setPagination', pagination);
            });
        }
    }
}

angular
    .module('airlst.components')
    .component('selectBox', {
        bindings: {
            model: '=',
            config: '=',
            disabled: '<',
            onSelect: '&'
        },
        templateUrl,
        controllerAs: 'vm',
        controller: ['$element', '$scope', SelectBoxCtrl]
    });
