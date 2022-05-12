/**
 * @ngdoc object
 * @name billing.invoices.position_links:PositionLinksCreateModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.position_links')
    .controller('PositionLinksCreateModalCtrl', [
        'billableType',
        'billableId',
        'Position',
        'closeFunction',
        '$scope',
        'PositionLink',
        'SweetAlert',
        'pax',
        PositionLinksCreateCtrl
    ]);

function PositionLinksCreateCtrl(billableType, billableId, Position, closeFunction, $scope, PositionLink, SweetAlert, pax) {
    var vm = this;

    vm.position = {};
    vm.positions = [];
    vm.model = {};
    vm.positionSelectDisabled = false;

    vm.close = close;
    vm.save = save;

    init();

    function init() {
        initPositions();
        initWatchers();
    }

    function initPositions() {
        var customPosition = {
            id: null,
            title: 'Custom'
        };
        vm.positions = [customPosition];
        vm.position = customPosition;
        Position.getList().then(function (result) {
            _.forEach(result, function (v, k) {
                vm.positions.push(v.plain());
            });
        });
    }

    function initWatchers() {
        $scope.$watch('vm.position', function (newValue) {
            vm.model.position_id = newValue.id;
            var fieldsToCopyFromPosition = [
                'label',
                'description',
                'price_per_unit',
                'block_for_voucher',
                'unit'
            ];

            for (var i = 0; i < fieldsToCopyFromPosition.length; i++) {
                var fieldName = fieldsToCopyFromPosition[i];

                vm.model[fieldName] = newValue[fieldName];
            }

            if (pax && newValue.pax_based) {
                vm.model.amount = pax;
            } else if (!vm.model.amount) {
                vm.model.amount = 1;
            }
        });
    }


    function save() {
        var dataForApi = _.cloneDeep(vm.model);

        dataForApi.billable_type = billableType;
        dataForApi.billable_id = billableId;

        PositionLink.post(dataForApi).then(function () {
            SweetAlert.success('success', 'position link created');
            vm.close();
        });
    }

    function close() {
        closeFunction();
    }

}