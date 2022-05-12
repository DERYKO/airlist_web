/**
 * @ngdoc object
 * @name contacts.documents.templates:DocumentsTemplatesDetailsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.documents.templates')
    .controller('DocumentsTemplatesDetailsCtrl', [
        '$http',
        'NavService',
        '$state',
        '$stateParams',
        '$sce',
        DocumentsTemplatesDetailsCtrl
    ]);

function DocumentsTemplatesDetailsCtrl($http, NavService, $state, $stateParams, $sce) {

    var vm = this;

    vm.backToList = backToList;
    vm.editModel = editModel;
    vm.trustTemplateHtml = trustTemplateHtml;

    init();

    function init() {
        if ($stateParams.store) {
            vm.store = $stateParams.store;
        }
        loadTemplate();
        _prepareSideNav();
    }

    function _prepareSideNav() {
        NavService.overrideMainSideNavActions([
            {
                label: 'Edit',
                action: vm.editModel,
                icon: 'pencil',
                order: 10
            }
        ]);
    }

    function loadTemplate() {
        return $http.get(`documents/templates/${$stateParams.id}`).then(response => {
            vm.model = response.data.data;


            NavService.setBreadcrumbParameters({
                template_name: vm.model.title
            });

            fillIframe();

            return vm.model;

        }, () => {
            Alert.error('Document template not found');
            backToList();
        });
    }

    function fillIframe() {
        const iFrame = angular.element('#template-preview-iframe');
        var iframeDoc = iFrame[0].contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(vm.model.template);
        iframeDoc.close();
    }

    function backToList() {
        $state.go('app.documents.templates.index');
    }

    function editModel() {
        $state.go('app.documents.templates.edit', {id: vm.model.id});
    }

    function trustTemplateHtml(string) {
        return $sce.trustAsHtml(string);
    }
}
