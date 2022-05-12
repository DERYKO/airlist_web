/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoice_templates')
    .controller('InvoiceTemplatesEditCtrl', [
        'Error',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        'model',
        'InvoiceTemplate',
        'NumberCircle',
        EditCtrl
    ]);

function EditCtrl(Error, $stateParams, $state, locale, SweetAlert, model, InvoiceTemplate, NumberCircle) {
    var vm = this;
    vm.model = model;
    vm.headline = _.cloneDeep(vm.model.title);
    vm.numberCircles = [];
    vm.ace_field = {
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

    vm.save = save;
    vm.cancel = cancel;

    init();

    function init() {
        setupEditor();
    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
            InvoiceTemplate.getSchema().then(function (schema) {
                vm.schema = schema;
            });

            NumberCircle.getList().then(function (circles) {
                vm.numberCircles = [];
                _.forEach(circles, function (v, k) {
                    vm.numberCircles.push({
                        id: v.id,
                        title: v.title
                    });
                });
            });
        });
    }

    function save(model) {
        model.save().then(function (savedInvoiceTemplate) {
            vm.model = savedInvoiceTemplate;
            SweetAlert.swal(locale.getString('billing.invoice_templates.edit.success'), locale.getString('billing.invoice_templates.edit.success_message'), 'success');
            cancel();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancel() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.billing.invoice_templates.index');
    }
}