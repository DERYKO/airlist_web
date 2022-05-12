/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.number-circles')
    .controller('NumberCircleEditCtrl', [
        'Error',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        'model',
        'NumberCircle',
        EditCtrl
    ]);

function EditCtrl(Error, $stateParams, $state, locale, SweetAlert, model, NumberCircle) {
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
            NumberCircle.getSchema().then(function (schema) {
                vm.schema = schema;
            });
        });
    }

    function save(model) {
        model.save().then(function (savedNumberCircle) {
            vm.model = savedNumberCircle;
            SweetAlert.swal(locale.getString('billing.number-circles.edit.success'), locale.getString('billing.number-circles.edit.success_message'), 'success');
            cancel();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancel() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.billing.number-circles.index');
    }
}