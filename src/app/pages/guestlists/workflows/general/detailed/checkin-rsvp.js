import template from '../../../views/workflows/checkin-rsvp.tpl.html';


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
    .module('airlst.guestlists')
    .factory('checkinRsvp', [
        '$http',
        '$uibModal',
        'Alert',
        checkinRsvp
    ]);

function checkinRsvp($http, $uibModal, Alert) {
    return {
        key: 'checkin-rsvp',
        title: 'Check-In',
        level: 'highlight',
        icon: 'sign-in',
        order: 20,
        action(rsvp, vm) {
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
                    $http.post(`rsvps/${ rsvp.id }/checkin`, {pax_actual})
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
