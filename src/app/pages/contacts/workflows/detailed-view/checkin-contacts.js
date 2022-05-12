import template from '../../views/workflows/checkin-contact.tpl.html';


class checkinCtrl {
    constructor($uibModalInstance) {
        this.modal = $uibModalInstance;
    }

    checkIn(form, pax) {
        if (form.$valid) {
            this.modal.close(pax);
        }
    };

    cancel() {
        this.modal.dismiss();
    }
}


angular
    .module('airlst.contacts')
    .factory('checkinContact', [
        '$http',
        '$uibModal',
        'Alert',
        checkinContact
    ]);

function checkinContact($http, $uibModal, Alert) {
    return {
        key: 'checkin-contact',
        title: 'Checkin',
        level: 'highlight',
        icon: 'sign-in',
        order: 20,
        action(contact, vm) {
            $uibModal
                .open({
                    templateUrl: template,
                    controllerAs: 'vm',
                    size: 'sm',
                    controller: [
                        '$uibModalInstance',
                        checkinCtrl
                    ]
                })
                .result
                .then(pax_actual => {
                    $http.post(`contacts/${ contact.id }/checkin`, {pax_actual})
                        .then(() => {
                            Alert.success('Checkin Successful');
                            if (vm.store) {
                                vm.store.dispatch('getData');
                            }
                        }, response => Alert.handle(response));
                }, response => Alert.handle(response));
        }
    }
}
