/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.templates.types')
    .controller('TemplateTypesCreateCtrl', [
        '$state',
        'TemplateType',
        'SweetAlert',
        TemplateTypesCreateCtrl
    ]);

function TemplateTypesCreateCtrl($state, TemplateType, SweetAlert) {
    var vm = this;

    vm.model = {};
    vm.save = save;
    vm.close = close;

    function save(type) {
        TemplateType.post(type)
            .then(function () {
                SweetAlert.success('Success', 'Template-type was created');
                vm.close();
            })
    }

    function close() {
        $state.go('app.templates.types.index');
    }

}