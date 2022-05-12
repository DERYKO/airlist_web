/**
 * @ngdoc object
 * @name billing.invoices.position_links:PositionLinksCreateModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.position_links')
    .controller('PositionLinksEditModalCtrl', [
        'position',
        'Position',
        'closeFunction',
        'SweetAlert',
        '$http',
        'Env',
        PositionLinksCreateCtrl
    ]);

function PositionLinksCreateCtrl(position, Position, closeFunction, SweetAlert, $http, Env) {
    var vm = this;

    vm.position = {};
    vm.positions = [];
    vm.model = position;
    vm.positionSelectDisabled = true;

    vm.close = close;
    vm.save = save;

    init();

    function init() {
        initPositions();
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


    function save() {
        var dataForApi = _.cloneDeep(vm.model);

        $http.put(Env.apiUrl + '/billing/positions/links/' + vm.model.id, dataForApi).then(function () {
            SweetAlert.success('success', 'position link changed');
            vm.close();
        });
    }

    function close() {
        closeFunction();
    }

}