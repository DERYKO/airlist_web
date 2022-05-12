import templateUrl from '../../views/workflows/merge-selected-modal.tpl.html';

class mergeOptionsCtrl {
    constructor(Alert, $http, store, $uibModalInstance) {
        this.alert = Alert;
        this.api = $http;
        this.store = store;
        this.modal = $uibModalInstance;
        this.model = {
            fields: ['first_name'],
            strategy: 'manual',
            rsvps: this.store.getters.selectedFilters
        };
    }

    close() {
        this.modal.dismiss('cancel');
    }

    save() {
        this.api.post(`guestlists/${ this.store.state.vm.guestlist.id }/rsvps/merge`, this.model)
            .then(() => {
                this.alert.success('Merge Scheduled', 'Merge of selected rsvps has been successfully scheduled.');
                this.modal.close(this.model.strategy);
            }, err => this.alert.handle(err));
    }
}

function mergeSelected($uibModal) {
    return {
        key: 'merge-selected',
        title: 'Merge contacts of selected',
        level: 'selected',
        action: function ({}, store) {
            return $uibModal.open({
                animation: true,
                templateUrl,
                controller: ['Alert', '$http', 'store', '$uibModalInstance', mergeOptionsCtrl],
                controllerAs: 'vm',
                resolve: {
                    store: function() {
                        return store;
                    }
                }
            }).result.then(null, () => ({}));
        }
    }
}



angular
    .module('airlst.guestlists')
    .factory('mergeSelectedRsvps', [
        '$uibModal',
        mergeSelected
    ]);
