import templateUrl from './listview.tpl.html';
import fieldSelectModal from './duplicates-field-selector.tpl.html';

angular
    .module('airlst.components')
    .component('duplicatesListview', {
        bindings: {
            store: '=',
            parent: '='
        },
        controller: [
            '$uibModal',
            'growl',
            '$scope',
            function ($uibModal, growl, $scope) {
                this.lodash = _;

                this.$onInit = () => {
                    this.resetCounts();

                    if (this.store.state.visible.length === 0) {
                        this.blockLoad = true;
                        this.openFieldSelectionModal();
                        return;
                    }
                    this.store.commit('setBusy', true);
                    this.store.dispatch('getDefinitions').then(() => {
                        this._loadData();
                    });
                    this.store.dispatch('publishHighlightActions');

                    $scope.$watch(() => {
                        return this.store.state.data;
                    }, () => {
                        this.updateCounts();
                    }, true);
                };

                this.search = (keyword) => {
                    this.store.dispatch('searchKeyword', keyword)
                };

                this.removeVisibleColumn = (col) => {
                    let columns = this.store.getters.columns,
                        colToHideIndex = columns.indexOf(col);

                    if (_.filter(columns, 'visible').length === 1) {
                        growl.warning('You must keep at least 1 field in selection');
                        return;
                    }

                    if (colToHideIndex) {
                        columns[colToHideIndex].visible = false;
                    }
                    this.store.commit('setColumns', columns);
                    this.store.commit('setVisible', _.filter(columns, 'visible').map(col => col.key));
                    this.store.dispatch('saveState');
                    this._loadData();
                };

                this._loadData = () => {
                    this.store.dispatch('getData').then(() => {
                        this.updateCounts();
                    });
                };

                this.updateCounts = () => {
                    this.resetCounts();
                    const currentStateData = _.get(this.store, 'state.data', []);

                    _.each(currentStateData, (v, k) => {
                        let rowCount = _.filter(v.duplicate_information.entities, 'is_new').length;

                        this.duplicateCounts.general += rowCount;
                        this.duplicateCounts.rows[v.duplicate_information.identifier] = rowCount;
                    });
                };

                this.resetCounts = () => {
                    this.duplicateCounts = {
                        general: 0,
                        rows: []
                    };
                };

                this.openFieldSelectionModal = () => {
                    $uibModal.open({
                        templateUrl: fieldSelectModal,
                        controller: FieldSelectModalController,
                        controllerAs: 'vm',
                        resolve: {
                            store: () => {
                                return this.store;
                            },
                            alreadySelectedFields: () => {
                                let out = {};

                                _.each(_.filter(this.store.getters.columns, 'visible'), col => {
                                    out[col.key] = true;
                                });

                                return out;
                            }
                        }
                    }).result.then((selectedFields) => {
                        let columns = this.store.getters.columns;

                        _.each(columns, (col) => {
                            if (!_.isUndefined(selectedFields[col.key])) {
                                col.visible = !!selectedFields[col.key];
                            } else {
                                col.visible = false;
                            }
                        });

                        this.store.commit('setColumns', columns);
                        this.store.commit('setVisible', _.filter(columns, 'visible').map(col => col.key));
                        this.store.dispatch('saveState');
                        this._loadData();
                    })
                }
            }
        ],
        controllerAs: 'vm',
        templateUrl: templateUrl
    });

class FieldSelectModalController {
    constructor($uibModalInstance, store, alreadySelectedFields) {
        this.modalInstance = $uibModalInstance;
        this.store = store;

        this.selectedFields = alreadySelectedFields;
    }

    close() {
        if (_.filter(this.selectedFields).length > 0) {
            return this.modalInstance.close(this.selectedFields);
        }
    }

    dismiss() {
        this.modalInstance.dismiss();
    }
}

FieldSelectModalController.$inject = [
    '$uibModalInstance',
    'store',
    'alreadySelectedFields'
];
