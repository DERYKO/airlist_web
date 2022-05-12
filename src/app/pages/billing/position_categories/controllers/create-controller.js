/**
 * @ngdoc object
 * @name billing.position_categories.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.position_categories')
    .controller('PositionCategoriesCreateCtrl', [
        'Error',
        'PositionCategory',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        CreateCtrl
    ]);

function CreateCtrl(Error, PositionCategory, $stateParams, $state, locale, SweetAlert) {

    var vm = this;
    vm.model = {
        tax_rate: 19.0
    };

    vm.save = save;
    vm.cancel = cancel;

    init();

    function init() {
        setupEditor();
    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
            vm.headline = locale.getString('billing.position_categories.create.title');
            PositionCategory.getSchema().then(function (schema) {
                vm.schema = schema;
            });
        });
    }

    function save(model) {
        PositionCategory.post(model).then(function (createdPositionCategory) {
            vm.model = createdPositionCategory;
            SweetAlert.swal(locale.getString('billing.position_categories.create.success'), locale.getString('billing.position_categories.create.success_message'), 'success');
            cancel();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancel() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.billing.position_categories.index');
    }
}