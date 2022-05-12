/**
 * @ngdoc object
 * @name billing.number-circles.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.number-circles')
    .controller('NumberCircleCreateCtrl', [
        'Error',
        'NumberCircle',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        CreateCtrl
    ]);

function CreateCtrl(Error, NumberCircle, $stateParams, $state, locale, SweetAlert) {

    var vm = this;
    vm.model = {
        number_template: '##DATE|Y##-##NUMBER|5,0##',
        start_number: 0
    };


    vm.save = save;
    vm.cancel = cancel;

    init();

    function init() {
        setupEditor();
    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
            vm.headline = locale.getString('billing.number-circles.create.title');
            NumberCircle.getSchema().then(function (schema) {
                vm.schema = schema;
            });
        });
    }

    function save(model) {
        NumberCircle.post(model).then(function (createdNumberCircle) {
            vm.model = createdNumberCircle;
            SweetAlert.swal(locale.getString('billing.number-circles.create.success'), locale.getString('billing.number-circles.create.success_message'), 'success');
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