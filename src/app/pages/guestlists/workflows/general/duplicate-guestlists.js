import templateUrl from '../../views/confirm-guestlist-duplication.tpl.html';

function duplicateGuestlists(Alert, $uibModal, $http) {

    return {
        key: 'duplicate-guestlists',
        title: 'Duplicate',
        icon: 'copy',
        level: 'selected',
        action(payload, store) {
            $uibModal.open({
                templateUrl,
                controller: ['$uibModalInstance', function ($uibModalInstance) {
                    const vm = this;
                    vm.save = $uibModalInstance.close;
                    vm.cancel = $uibModalInstance.dismiss;
                }],
                controllerAs: 'vm'
            }).result.then(result => {
                return $http.post('guestlists/duplicate', {
                    ...result,
                    guestlists: store.getters.selectedFilters
                }, () => {

                }).then(() => {
                    Alert.info('Duplication Process.', 'Duplication process has been initiated.');
                });
            });
        }
    }
}


angular
    .module('airlst.guestlists')
    .factory('duplicateGuestlists', [
        'Alert',
        '$uibModal',
        '$http',
        duplicateGuestlists
    ]);


