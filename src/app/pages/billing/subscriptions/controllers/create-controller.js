/**
 * @ngdoc object
 * @name billing.subscriptions.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .controller('SubscriptionCreateCtrl', [
        'Error',
        'Subscription',
        'InvoiceTemplate',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        'Position',
        '$scope',
        '$filter',
        CreateCtrl
    ]);

function CreateCtrl(Error, Subscription, InvoiceTemplate, $stateParams, $state, locale, SweetAlert, Position, $scope, $filter) {

    var vm = this;
    vm.model = {
        invoice_template_id: null,
        invoicing_interval_type: 'year',
        invoicing_interval_value: 1
    };

    vm.invoiceTemplates = [];
    vm.positions = [];
    vm.currentPositions = [];

    vm.save = save;
    vm.cancel = cancel;
    vm.movePositionToCurrent = movePositionToCurrent;
    vm.removeFromCurrentPositions = removeFromCurrentPositions;

    init();

    function init() {
        setupEditor();
        initWatchers();
    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
            vm.headline = locale.getString('billing.subscriptions.create.title');
            Subscription.getSchema().then(function (schema) {
                vm.schema = schema;
            });

            InvoiceTemplate.getList().then(function (invoiceTemplates) {
                vm.invoiceTemplates = [];
                _.forEach(invoiceTemplates, function (v, k) {
                    vm.invoiceTemplates.push({
                        id: v.id,
                        title: v.title
                    });
                });
                vm.model.invoice_template_id = vm.invoiceTemplates[0].id;
            });

            Position.getList().then(function (positions) {
                vm.positions = [];
                _.forEach(positions, function (v, k) {
                    vm.positions.push(v.plain());
                });

                updatePositionStates();
            });
        });
    }

    function initWatchers() {
        $scope.$watch('vm.currentPositions', function(){
            updatePositionStates();
        }, true);
    }

    function updatePositionStates() {
        _.forEach(vm.positions, function(position) {
            position.already_used = ($filter('filter')(vm.currentPositions, {position_id: position.id}).length > 0);
        })
    }

    function movePositionToCurrent(position) {
        vm.currentPositions.push({
            position_id: position.id,
            title: position.title,
            amount: 1,
            one_time_invoiced: false
        });
    }

    function removeFromCurrentPositions(position) {
        var index = vm.currentPositions.indexOf(position);
        if(index !== -1) {
            vm.currentPositions.splice(index, 1);
        }
    }

    function save(model) {
        model.positions = vm.currentPositions;
        Subscription.post(model).then(function (createdSubscription) {
            vm.model = createdSubscription;
            SweetAlert.swal(locale.getString('billing.subscriptions.create.success'), locale.getString('billing.subscriptions.create.success_message'), 'success');
            cancel();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancel() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.billing.subscriptions.index');
    }
}