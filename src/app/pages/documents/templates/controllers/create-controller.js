/**
 * @ngdoc object
 * @name contacts.documents.templates:DocumentsTemplatesDetailsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.documents.templates')
    .controller('DocumentsTemplatesCreateCtrl', [
        '$state',
        'DocumentTemplate',
        'SweetAlert',
        'Error',
        DocumentsTemplatesCreateCtrl
    ]);

function DocumentsTemplatesCreateCtrl($state, DocumentTemplate, SweetAlert, Error) {
    var vm = this;
    vm.model = {
        title: '',
        template: ''
    };
    vm.headline = 'Create new Document Template';
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

    }

    function submit(form) {
        if (form.$valid) {
            DocumentTemplate.post(vm.model).then(function () {
                SweetAlert.success('Created', 'New document template was created');
                $state.go('app.documents.templates.index');
            }, function (e) {
                Error.default(e);
            });
        }
    }

    function back() {
        $state.go('app.documents.templates.index');
    }
}