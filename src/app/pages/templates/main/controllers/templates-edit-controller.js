import templateModelReducer from '../helpers/template-model-reducer';

/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.templates.main')
    .controller('TemplatesEditCtrl', [
        'Alert',
        '$http',
        'Template',
        'Tickets',
        '$rootScope',
        '$stateParams',
        '$state',
        'Passbooks',
        'TemplateTypes',
        'NavService',
        'AceEditor',
        'Acl',
        TemplatesEditCtrl
    ]);

function TemplatesEditCtrl(Alert, $http, Template, Tickets, $rootScope, $stateParams, $state, Passbooks, TemplateTypes, NavService, AceEditor, Acl) {
    const vm = this;
    vm.currentView = 'general';
    vm.acl = Acl;
    vm.template = {};

    vm.save = saveTemplate;
    vm.hide = hideTemplate;
    vm.triggerSave = triggerSave;

    init();

    function loadTemplate() {
        return $http.get(`templates/${$stateParams.id}`).then(response => {
            vm.template = templateModelReducer(response.data.data);
            vm.template.loadingBeeFree = true;
            vm.headline = vm.template.name;
            vm.templateMode = !vm.template.beefree_json ? 'custom' : 'beefree';
            vm.enableModeChange = false;
            return vm.template;
        }, () => {
            Alert.error('Template not found');
            hideTemplate();
        });

    }

    function init() {
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

        if ($stateParams.store) {
            vm.store = $stateParams.store;
        }


        vm.controls = {
            ace_field: {}
        };
        AceEditor.getEditor((editor) => vm.controls.ace_field = editor);

        loadTemplate().then(() => {
            setupEditor();
            _updateCustomActions();
        });

    }

    function _updateCustomActions() {
        NavService.setStateParameters('app.templates.main.details', {
            id: vm.template.id,
            template: vm.template
        });
        NavService.setBreadcrumbParameters({
            template_name: vm.template.name
        });
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

    function saveTemplate(model) {
        $http.put(`templates/${$stateParams.id}`, model).then(function (response) {
            vm.model = response.data.data;
            $rootScope.beefreeSaveInProgress = false;
            hideTemplate();
        }, function (response) {
            Alert.handle(response);
            $rootScope.beefreeSaveInProgress = false;
        });
    }

    function hideTemplate() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.templates.main.details', {id: vm.template.id, template: vm.template});
    }

    $rootScope.$on('loadingBeeFree', function (event, data) {
        vm.template.loadingBeeFree = data;
        $rootScope.$apply();
    });

}
