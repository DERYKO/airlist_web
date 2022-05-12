/**
 * @ngdoc object
 * @name billing.invoice_templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoice_templates')
    .controller('InvoiceTemplatesCreateCtrl', [
        'Error',
        'NumberCircle',
        'InvoiceTemplate',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        CreateCtrl
    ]);

function CreateCtrl(Error, NumberCircle, InvoiceTemplate, $stateParams, $state, locale, SweetAlert) {
    const vm = this;

    vm.model = {
        tax_rate: 19.0
    };
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

    vm.numberCircles = [];

    vm.save = save;
    vm.cancel = cancel;

    init();

    function init() {
        setupEditor();
    }

    function setupEditor() {
        locale.ready(['billing']).then(function () {
            vm.headline = locale.getString('billing.invoice_templates.create.title');
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

                vm.model.number_circle_id = vm.numberCircles[0].id;
            });
        });
    }

    function save(model) {
        InvoiceTemplate.post(model).then(function (createdInvoiceTemplate) {
            vm.model = createdInvoiceTemplate;
            SweetAlert.swal(locale.getString('billing.invoice_templates.create.success'), locale.getString('billing.invoice_templates.create.success_message'), 'success');
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