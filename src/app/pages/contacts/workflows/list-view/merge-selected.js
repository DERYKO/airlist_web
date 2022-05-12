import templateUrl from '../../views/duplicates/merge-options-modal.tpl.html';


class mergeOptionsCtrl {

    constructor(Alert, $http, store, $uibModalInstance) {
        this.alert = Alert;
        this.api = $http;
        this.store = store;
        this.modal = $uibModalInstance;
        this.model = {
            fields: ['first_name'],
            strategy: 'manual',
            contacts: this.store.getters.selectedFilters
        };
    }

    close() {
        this.modal.dismiss('cancel');
    }

    save() {
        this.api.post('contacts/merge', this.model)
            .then(() => {
                this.alert.success('Merge Scheduled', 'Merge of selected contacts has been successfully scheduled.');
                this.modal.close(this.model.strategy);
            }, err => this.alert.handle(err));
    }
}

function mergeSelected($uibModal) {
    return {
        key: 'merge-selected',
        title: 'Merge Selected',
        level: 'selected',
        action: function ({}, store) {
            return $uibModal.open({
                animation: true,
                templateUrl,
                controller: ['Alert', '$http', 'store', '$uibModalInstance', mergeOptionsCtrl],
                controllerAs: 'vm',
                resolve: {
                    store
                }
            }).result.then(null, () => ({}));
        }
    }
}



angular
    .module('airlst.contacts')
    .factory('mergeSelected', [
        '$uibModal',
        mergeSelected
    ]);