/**
 * @ngdoc object
 * @name billing.subscriptions
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .controller('ContactSubscriptionsComponentTerminateModalController', [
        '$uibModalInstance',
        ContactSubscriptionsComponentTerminateModalController
    ]);

function ContactSubscriptionsComponentTerminateModalController($uibModalInstance) {
    let vm = this;

    vm.date = new Date();

    vm.close = close;
    vm.finish = finish;

    function finish() {
        $uibModalInstance.close(vm.date);
    }

    function close() {
        $uibModalInstance.dismiss();
    }
}