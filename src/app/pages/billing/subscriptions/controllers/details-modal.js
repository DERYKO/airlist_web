import selectTerminationDateModalTemplate from '../views/terminate-modal.tpl.html';
import selectPausedUntilDateModal from '../views/pausing-modal.tpl.html';

/**
 * @ngdoc object
 * @name billing.subscriptions
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .controller('ContactSubscriptionsComponentDetailModalController', [
        'Contact',
        '$uibModal',
        '$uibModalInstance',
        'contactId',
        'subscriptionId',
        '$filter',
        'Error',
        'SweetAlert',
        ContactSubscriptionsComponentDetailModalController
    ]);

function ContactSubscriptionsComponentDetailModalController(Contact, $uibModal, $uibModalInstance, contactId, subscriptionId, $filter, Error, SweetAlert) {
    let vm = this;

    vm.subscription = null;
    vm.days = null;

    vm.close = close;
    vm.terminateSubscription = terminateSubscription;
    vm.pauseSubscription = pauseSubscription;
    vm.reactivateSubscription = reactivateSubscription;

    init();

    function init() {
        reloadSubscription();
    }

    function reloadSubscription() {
        Contact.one(contactId).customGET('subscriptions/' + subscriptionId, {
            include: 'subscription,subscription.positions'
        }).then(function(data){
            vm.subscription = data.plain();
            vm.days = Math.floor(new Date(vm.subscription.termination_date) / (3600*24*1000)) - Math.floor(new Date() / (3600*24*1000));
        });
    }

    function terminateSubscription() {
        $uibModal.open({
            templateUrl: selectTerminationDateModalTemplate,
            controller: 'ContactSubscriptionsComponentTerminateModalController',
            controllerAs: 'vm'
        }).result.then(function (selectedDate) {
            Contact.one(contactId).customPUT({
                termination_date: $filter('date')(selectedDate, 'yyyy-MM-dd')
            }, 'subscriptions/' + vm.subscription.id + '/terminate')
                .then(function (result) {
                    SweetAlert.info('Success', 'Subscription was terminated successful');
                    $uibModalInstance.close();
                }, function (error) {
                    Error.default(error);
                })
        });
    }

    function pauseSubscription() {
        $uibModal.open({
            templateUrl: selectPausedUntilDateModal,
            controller: 'ContactSubscriptionsComponentPausingModalController',
            controllerAs: 'vm'
        }).result.then(function (selectedDate) {
            Contact.one(contactId).customPUT({
                paused_until: $filter('date')(selectedDate, 'yyyy-MM-dd')
            }, 'subscriptions/' + vm.subscription.id + '/pause')
                .then(function (result) {
                    SweetAlert.info('Success', 'Subscription was paused successful');
                    $uibModalInstance.close();
                }, function (error) {
                    Error.default(error);
                })
        });
    }

    function reactivateSubscription() {
        Contact.one(contactId).customPUT({}, 'subscriptions/' + subscriptionId + '/reactivate')
            .then(function(result){
            SweetAlert.info('Success', 'Subscription was re-activated successfully');
            $uibModalInstance.close();
        }, function (error) {
            Error.default(error);
        });
    }

    function close() {
        $uibModalInstance.dismiss();
    }
}