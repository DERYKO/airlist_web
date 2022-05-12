/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .controller('SubscriptionEditCtrl', [
        'Alert',
        '$stateParams',
        'InvoiceTemplate',
        '$state',
        'locale',
        'SweetAlert',
        '$http',
        'Subscription',
        'Position',
        '$scope',
        '$filter',
        EditCtrl
    ]);

function EditCtrl(Alert, $stateParams, InvoiceTemplate, $state, locale, SweetAlert, $http, Subscription, Position, $scope, $filter) {
    var vm = this;
    vm.invoiceTemplates = [];
    vm.positions = [];
    vm.currentPositions = [];

    vm.save = save;
    vm.cancel = cancel;
    vm.movePositionToCurrent = movePositionToCurrent;
    vm.removeFromCurrentPositions = removeFromCurrentPositions;

    init();

    function init() {

        loadSubscription().then(() => {
            vm.headline = vm.model.title;
            setupEditor();
            initWatchers();
            fillCurrentPositionsFromModel();
        });
    }


    function loadSubscription() {
        return $http.get(`billing/subscriptions/${$stateParams.id}?include=positions`)
            .then(response => {
                vm.model = response.data.data;
                return vm.model;

            }, () => {
                Alert.error('Subscription not found');
                backToList();
            });


    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
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

    function fillCurrentPositionsFromModel() {
        vm.currentPositions = [];
        _.forEach(vm.model.positions.data, function (v) {
            var newPos = {
                position_id: v.id,
                title: v.title,
                amount: v.amount,
                one_time_invoiced: v.one_time_invoiced
            };

            vm.currentPositions.push(newPos);
        })
    }

    function initWatchers() {
        $scope.$watch('vm.currentPositions', function () {
            updatePositionStates();
        }, true);
    }

    function updatePositionStates() {
        _.forEach(vm.positions, function (position) {
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
        if (index !== -1) {
            vm.currentPositions.splice(index, 1);
        }
    }

    function save(model) {
        model.positions = vm.currentPositions;
        model.save().then(function (savedSubscription) {
            vm.model = savedSubscription;
            SweetAlert.swal(locale.getString('billing.subscriptions.edit.success'), locale.getString('billing.subscriptions.edit.success_message'), 'success');
            cancel();
        }, function (response) {
            Alert.handle(response);
        });
    }

    function cancel() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.billing.subscriptions.index');
    }
}