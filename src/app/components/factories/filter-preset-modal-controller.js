/**
 * @ngdoc object
 * @description
 *
 */
angular
    .module('airlst.components')
    .controller('PresetsCtrl', [
        'FilterPresets',
        '$uibModalInstance',
        'model',
        'title',
        PresetsCtrl
    ]);

function PresetsCtrl(FilterPresets, $uibModalInstance, model, title) {
    var vm = this;

    FilterPresets.getSchema().then(function (schema) {
        vm.schema = schema;
    });

    vm.form = FilterPresets.getForm();
    vm.model = model;
    vm.title = title;

    vm.close = close;
    vm.save = save;

    function close() {
        $uibModalInstance.dismiss();
    }

    function save(model) {
        $uibModalInstance.close(model);
    }
}