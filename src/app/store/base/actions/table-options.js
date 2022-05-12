import templateUrl from '../templates/table-options.tpl.html';

class TableOptionsCtrl {
    constructor(store, $uibModalInstance, $scope, $filter) {
        this.store = store;
        this.modal = $uibModalInstance;
        this.scope = $scope;
        this.filter = $filter;
        this.columns = _.cloneDeep(this.store.state.columns)
            .filter((col) => {
                return !col.hidden;
            });

        this.columnsGrouped = {};
        this.visible = null;
        this.colFilter = '';
        this.searchActive = false;

        this._prepareColumnGroups();
        this._initWatchers();
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.visible;
        }, () => {
            this._prepareColumnGroups();
        });

        this.scope.$watch(() => {
            return this.colFilter;
        }, () => {
            this._prepareColumnGroups();
        });
    }

    _prepareColumnGroups() {
        this.columnsGrouped = {};

        _.each(this.filter('filter')(this.columns, this._getCurrentColFilters()), (col) => {
            if (!this.columnsGrouped[col.group]) {
                this.columnsGrouped[col.group] = {
                    label: col.group,
                    columns: [],
                    shown: false
                }
            }

            this.columnsGrouped[col.group].columns.push(col);
        });

        this.columnsGrouped = _.sortBy(this.columnsGrouped, 'label')
            .map((row) => {
                row.columns = _.sortBy(row.columns, 'label');
                return row;
            });
    }

    _getCurrentColFilters() {
        const out = {
            label: this.colFilter
        };

        if (this.visible !== null) {
            out.visible = this.visible;
        }

        this.searchActive = !!(this.colFilter || (this.visible !== null));

        return out;
    }

    close() {
        this.modal.dismiss();
    }

    reset() {
        this.modal.dismiss();
        const filters = this.store.state.permanentFilters;
        const prefix = this.store.state.prefix;

        this.store.dispatch('resetState');
        this.store.commit('setPermanentFilters', filters);
        this.store.commit('setPrefix', prefix);
    }

    save() {
        this.modal.close({columns: this.columns});
    }

}

TableOptionsCtrl.$inject = [
    'store',
    '$uibModalInstance',
    '$scope',
    '$filter'
];

export default (store) => {
    const $uibModal = store.ng.injector.get('$uibModal');

    const modalInstance = $uibModal.open({
        templateUrl: templateUrl,
        controller: TableOptionsCtrl,
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'md',
        resolve: {
            store() {
                return store;
            }
        }
    });

    return modalInstance.result.then(result => {
        store.commit('setColumns', result.columns);
        store.commit('setVisible', _.filter(result.columns, 'visible').map(col => col.key));
        store.dispatch('saveState');
        store.dispatch('getData');
    }, () => {
    });
}
