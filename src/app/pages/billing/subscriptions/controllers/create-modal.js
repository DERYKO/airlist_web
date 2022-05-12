import selectTerminationDateModalTemplate from '../views/terminate-modal.tpl.html';

/**
 * @ngdoc object
 * @name billing.subscriptions
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .controller('ContactSubscriptionsComponentCreateModalController', [
        'contactId',
        'Contact',
        'Subscription',
        '$uibModalInstance',
        '$scope',
        '$filter',
        'SweetAlert',
        ContactSubscriptionsComponentCreateModalController
    ]);

function ContactSubscriptionsComponentCreateModalController(contactId, Contact, Subscription, $uibModalInstance, $scope, $filter, SweetAlert) {
    let vm = this;

    vm.contactSubscriptions = [];
    vm.subscriptions = [];
    vm.availableSubscriptions = [];
    vm.selectedSubscription = {};
    vm.contactId = contactId;
    vm.start_date = new Date();

    vm.close = close;
    vm.save = save;

    init();

    function init() {
        initWatchers();
        loadSubscriptions();
        loadContactSubscriptions();
    }

    function initWatchers() {
        $scope.$watch('vm.start_date', function () {
            recheckAvailable();
        });
    }

    function recheckAvailable() {
        vm.availableSubscriptions = [];
        const startDate = new Date(vm.start_date);
        _.forEach(vm.subscriptions, function (subscription) {
            let useSubscription = true;
            _.forEach(vm.contactSubscriptions, function (contactSubscription) {
                if (subscription.id === contactSubscription.subscription_id) {
                    if (!contactSubscription.termination_date) {
                        useSubscription = false;
                    } else {
                        let terminationDate = new Date(contactSubscription.termination_date);
                        if ((terminationDate.getYear() > startDate.getYear()
                            ) || (
                                terminationDate.getYear() === startDate.getYear()
                                && terminationDate.getMonth() > startDate.getMonth()
                            ) || (
                                terminationDate.getYear() === startDate.getYear()
                                && terminationDate.getMonth() === startDate.getMonth()
                                && terminationDate.getDay() >= startDate.getDay()
                            )
                        ) {
                            useSubscription = false;
                        }
                    }
                }
            });

            if (useSubscription) {
                vm.availableSubscriptions.push(subscription);
            }
        });

        if (vm.availableSubscriptions.indexOf(vm.selectedSubscription) === -1) {
            vm.selectedSubscription = {};
        }
    }

    function loadSubscriptions() {
        Subscription.getList().then(function (data) {
            vm.subscriptions = data.plain();
            recheckAvailable();
        });
    }

    function loadContactSubscriptions() {
        Contact.one(vm.contactId).customGET('subscriptions').then(function (data) {
            vm.contactSubscriptions = data.plain();
        });
    }

    function close() {
        $uibModalInstance.dismiss();
    }

    function save() {
        Contact.one(vm.contactId).customPOST({
            start_date: vm.start_date,
            subscription_id: vm.selectedSubscription.id
        }, 'subscriptions').then(function () {
            SweetAlert.success('success', 'contact subscription was created successfully');
            $uibModalInstance.close();
        }, function () {
            SweetAlert.error('error', 'error while saving ');
            $uibModalInstance.dismiss();
        });
    }
}