/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.position_categories')
    .controller('PositionCategoriesEditCtrl', [
        'Error',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        'model',
        'PositionCategory',
        EditCtrl
    ]);

function EditCtrl(Error, $stateParams, $state, locale, SweetAlert, model, PositionCategory) {
    var vm = this;
    vm.model = model;
    vm.headline = _.cloneDeep(vm.model.title);

    vm.save = save;
    vm.cancel = cancel;

    init();

    function init() {
        setupEditor();
    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
            PositionCategory.getSchema().then(function (schema) {
                vm.schema = schema;
            });
        });
    }

    function save(model) {
        model.save().then(function (savedPositionCategory) {
            vm.model = savedPositionCategory;
            SweetAlert.swal(locale.getString('billing.position_categories.edit.success'), locale.getString('billing.position_categories.edit.success_message'), 'success');
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