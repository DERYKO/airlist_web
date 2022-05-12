/**
 * @ngdoc object
 * @name templates.types.controller:TemplateTypesEditCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.templates.types')
    .controller('TemplateTypesEditCtrl', [
        '$state',
        'model',
        'TemplateType',
        'NavService',
        'SweetAlert',
        TemplateTypesEditCtrl
    ]);

function TemplateTypesEditCtrl($state, model, TemplateType, NavService, SweetAlert) {
    let vm = this;

    vm.save = save;
    vm.close = close;
    vm.model = model;

    _init();

    function _init() {
        _updateCustomActions();
    }

    function _updateCustomActions() {
        NavService.setBreadcrumbParameters({
            type_name: vm.model.name
        });
    }

    function save(type) {
        type.save()
            .then(function () {
                SweetAlert.success('success', 'changes have been saved successfully');
                vm.close();
            })
    }

    function close() {
        $state.go('app.templates.types.index');
    }

}