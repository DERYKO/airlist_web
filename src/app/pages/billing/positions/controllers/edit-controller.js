/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.positions')
    .controller('PositionEditCtrl', [
        'Error',
        '$stateParams',
        'PositionCategory',
        '$state',
        'locale',
        'SweetAlert',
        'model',
        'Position',
        EditCtrl
    ]);

function EditCtrl(Error, $stateParams, PositionCategory, $state, locale, SweetAlert, model, Position) {
    var vm = this;
    vm.model = model;
    vm.headline = _.cloneDeep(vm.model.title);
    vm.categories = [];

    vm.save = save;
    vm.cancel = cancel;

    init();

    function init() {
        setupEditor();
    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
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
        model.save().then(function (savedPosition) {
            vm.model = savedPosition;
            SweetAlert.swal(locale.getString('billing.positions.edit.success'), locale.getString('billing.positions.edit.success_message'), 'success');
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