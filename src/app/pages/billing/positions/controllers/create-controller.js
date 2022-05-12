/**
 * @ngdoc object
 * @name billing.positions.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.positions')
    .controller('PositionCreateCtrl', [
        'Error',
        'Position',
        'PositionCategory',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        CreateCtrl
    ]);

function CreateCtrl(Error, Position, PositionCategory, $stateParams, $state, locale, SweetAlert) {

    var vm = this;
    vm.model = {
        tax_rate: 19.0,
        category_id: null
    };

    vm.categories = [];

    vm.save = save;
    vm.cancel = cancel;

    init();

    function init() {
        setupEditor();
    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
            vm.headline = locale.getString('billing.positions.create.title');
            Position.getSchema().then(function (schema) {
                vm.schema = schema;
            });

            PositionCategory.getList().then(function (categories) {
                vm.categories = [{
                    id: null,
                    title: 'no one'
                }];
                _.forEach(categories, function (v, k) {
                    vm.categories.push({
                        id: v.id,
                        title: v.title
                    });
                });
            });
        });
    }

    function save(model) {
        Position.post(model).then(function (createdPosition) {
            vm.model = createdPosition;
            SweetAlert.swal(locale.getString('billing.positions.create.success'), locale.getString('billing.positions.create.success_message'), 'success');
            cancel();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancel() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.billing.positions.index');
    }
}