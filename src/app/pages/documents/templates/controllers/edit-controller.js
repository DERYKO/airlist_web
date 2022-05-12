/**
 * @ngdoc object
 * @name contacts.documents.templates:DocumentsTemplatesDetailsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.documents.templates')
    .controller('DocumentsTemplatesEditCtrl', [
        '$state',
        '$http',
        '$stateParams',
        'SweetAlert',
        'Error',
        'NavService',
        DocumentsTemplatesEditCtrl
    ]);

function DocumentsTemplatesEditCtrl($state, $http, $stateParams, SweetAlert, Error, NavService) {
    var vm = this;

    vm.ace_template = {
        type: 'ace',
        aceOptions: {
            useWrapMode: false,
            highlightActiveLine: false,
            showGutter: false,
            theme: 'chrome',
            mode: 'twig',
            require: [
                'ace/ext/language_tools'
            ],
            advanced: {
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            },
            onLoad: function (editor) {

            }
        }
    };
    vm.back = back;
    vm.submit = submit;

    init();

    function init() {
        if ($stateParams.store) {
            vm.store = $stateParams.store;
        }
        loadTemplate().then(() => {
            vm.headline = 'Edit ' + vm.model.title;
            NavService.setBreadcrumbParameters({
                template_name: vm.model.title
            });

            NavService.setStateParameters('app.documents.templates.details', {
                id: vm.model.id
            });
        });
    }

    function loadTemplate() {
        return $http.get(`documents/templates/${$stateParams.id}`).then(response => {
            vm.model = response.data.data;
            return vm.model;

        }, () => {
            Alert.error('Document template not found');
            backToList();
        });


    }

    function submit(form) {
        if (form.$valid) {
            $http.put(`documents/templates/${vm.model.id}`, vm.model).then(function (response) {
                SweetAlert.success('Saved', 'Changes to template has been saved');
                $state.go('app.documents.templates.details', {id: response.data.data.id});
            }, function (e) {
                Error.default(e);
            });
        }
    }

    function back() {
        $state.go('app.documents.templates.details', {id: vm.model.id});
    }
}
