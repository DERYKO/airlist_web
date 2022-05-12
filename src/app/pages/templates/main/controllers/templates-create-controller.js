/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.templates.main')
    .controller('TemplatesCreateCtrl', [
        'Error',
        'locale',
        'Template',
        'Tickets',
        '$rootScope',
        '$stateParams',
        '$state',
        'SweetAlert',
        'Passbooks',
        'TemplateTypes',
        'NavService',
        'AceEditor',
        TemplatesCreateCtrl
    ]);

function TemplatesCreateCtrl(Error, locale, Template, Tickets, $rootScope, $stateParams, $state, SweetAlert, Passbooks, TemplateTypes, NavService, AceEditor) {
    const vm = this;
    vm.template = {
        loadingBeeFree: true
    };
    vm.currentView = 'general';
    vm.headline = 'Create new Template';

    vm.controls = {
        ace_field: {}
    };

    AceEditor.getEditor((editor) => vm.controls.ace_field = editor);

    vm.templateMode = 'beefree';
    vm.enableModeChange = true;

    vm.save = saveTemplate;
    vm.hide = hideTemplate;
    vm.triggerSave = triggerSave;
    vm.changeTemplateMode = changeTemplateMode;

    init();

    function init() {
        if ($stateParams.template) {
            vm.template = $stateParams.template;
        }
        vm.ticket_config = {
            store: Tickets,
            settings: {}
        };
        vm.passbook_config = {
            store: Passbooks,
            settings: {}
        };
        vm.template_type_config = {
            store: TemplateTypes,
            settings: {}
        };
        setupEditor();
        _updateCustomActions();
    }

    function _updateCustomActions() {
        let customs = [
            {
                label: 'General',
                active: (vm.currentView === 'general'),
                icon: 'sitemap',
                order: 5,
                action: function () {
                    _changeView('general');
                }
            },
            {
                label: 'Template',
                active: (vm.currentView === 'template'),
                icon: 'file',
                order: 10,
                action: function () {
                    _changeView('template');
                }
            },
            {
                label: 'Attachments',
                active: (vm.currentView === 'attachments'),
                icon: 'file',
                order: 15,
                action: function () {
                    _changeView('attachments');
                }
            }
        ];

        customs.sort(function (a, b) {
            return a.order - b.order;
        });

        NavService.setSideNavCustoms(customs);
    }

    function _changeView(view) {
        vm.currentView = view;
        _updateCustomActions();
    }

    function setupEditor() {
        Template.getSchema().then(function (schema) {
            vm.schema = schema;
            vm.form = Template.getForm();
        });
    }

    function triggerSave(model) {
        if (vm.templateMode === 'beefree' && model.beePluginInstance) {
            model.beePluginInstance.save();
        } else {
            saveTemplate(model);
        }
    }

    function saveTemplate(fields) {
        if (_.isArray(fields.ticket_id)) fields.ticket_id = undefined;

        if (vm.templateMode === 'beefree' && fields.fromTemplate) {
            fields.beePluginInstance.save();
        } else {
            Template.post(fields).then(function () {
                SweetAlert.swal(locale.getString('templates.templates_saved'), locale.getString('templates.templates_creation_successful'), 'success');
                hideTemplate();
            }, function (response) {
                Error.checkError(response);
            });
        }
    }

    function hideTemplate() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.templates.main.index');
    }

    $rootScope.$on('loadingBeeFree', function (event, data) {
        vm.template.loadingBeeFree = data;
        $rootScope.$apply();
    });

    function changeTemplateMode() {
        if (vm.templateMode === 'beefree') {
            vm.templateMode = 'custom';
            vm.template.beefree_json = null;
            console.log('now we are at custom');
        } else {
            vm.templateMode = 'beefree';
        }
    }

}
