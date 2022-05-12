import Subscriptions from '../../../../store/billing/subscriptions/index';
/**
 * @ngdoc object
 * @name billing.subscriptions.controller:ListCtrl
 *
 * @description
 *
 */

angular
    .module('airlst.billing.subscriptions')
    .controller('SubscriptionListCtrl', [
        'Subscription',
        '$state',
        '$injector',
        ListCtrl
    ]);

function ListCtrl(Subscription, $state, $injector) {
    let vm = this;
    vm.model = Subscription;
    vm.name = 'SubscriptionListView';

    init();

    function init() {
        vm.store = new Subscriptions(Subscription, {
            injector: $injector
        });
        vm.edit = edit;
        vm.addNew = addNew;
        vm.store.commit('setVm', vm);
    }

    function addNew() {
        $state.go('app.billing.subscriptions.create', {manager: vm.manager});
    }

    function edit(event) {
        $state.go('app.billing.subscriptions.edit', {id: event.row.id, manager: vm.manager});
    }
}