import templateUrl from '../../views/confirm-guestlist-duplication.tpl.html';

function duplicateGuestlist(Alert, $uibModal, $http) {

    return {
        key: 'duplicate-guestlist',
        title: 'Duplicate',
        icon: 'copy',
        level: 'highlight',
        order: 50,
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
                    guestlists: {
                        filters: [
                            {
                                "field": "id",
                                "operator": "=",
                                "value": store.state.vm.guestlist.id
                            }
                        ],
                        count: 1
                    }
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
    .factory('duplicateGuestlist', [
        'Alert',
        '$uibModal',
        '$http',
        duplicateGuestlist
    ]);


