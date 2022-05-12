import detailModalTemplate from '../views/details-modal.tpl.html';
import createModalTemplate from '../views/create-modal.tpl.html';

/**
 * @ngdoc object
 * @name billing.subscriptions
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .controller('ContactSubscriptionsComponentController', [
        'Contact',
        '$scope',
        '$uibModal',
        ContactSubscriptionsComponentController
    ]);

function ContactSubscriptionsComponentController(Contact, $scope, $uibModal) {
    let vm = this;
    vm.subscriptions = [];
    vm.loading = true;
    vm.error = false;

    vm.showSubscriptionDetails = showSubscriptionDetails;
    vm.createNewSubscription = createNewSubscription;

    init();

    function init() {
        initWatchers();
    }

    function initWatchers() {
        $scope.$watch('vm.contactId', function(newVal) {
            if(newVal) {
                updateSubscriptions();
            }
        });
    }

    function updateSubscriptions() {
        vm.subscriptions = [];
        vm.loading = true;
        Contact.one(vm.contactId).getList('subscriptions', {include: 'subscription'}).then(function(subscriptions){
            _.forEach(subscriptions, function(v) {
               vm.subscriptions.push(v.plain());
            });
            vm.loading = false;
        }, function(){
            vm.loading = false;
            vm.error = true;
        });
    }

    function showSubscriptionDetails(subscription) {
        $uibModal.open({
            templateUrl: detailModalTemplate,
            controller: 'ContactSubscriptionsComponentDetailModalController',
            controllerAs: 'vm',
            resolve: {
                subscription: function() {
                    return subscription;
                }
            }
        }).result.then(function(){
            updateSubscriptions();
        }, function() {
            updateSubscriptions();
        });
    }

    function createNewSubscription() {

    }
}