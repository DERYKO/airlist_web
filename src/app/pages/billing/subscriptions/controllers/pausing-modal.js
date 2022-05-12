/**
 * @ngdoc object
 * @name billing.subscriptions
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .controller('ContactSubscriptionsComponentPausingModalController', [
        '$uibModalInstance',
        ContactSubscriptionsComponentPausingModalController
    ]);

function ContactSubscriptionsComponentPausingModalController($uibModalInstance) {
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