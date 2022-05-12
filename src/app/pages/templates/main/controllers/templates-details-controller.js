

/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.templates.main')
    .controller('TemplatesDetailsCtrl', [
        'Error',
        '$http',
        'locale',
        'Restangular',
        'ResourceCommon',
        'ResourceSelect',
        '$rootScope',
        '$sce',
        '$scope',
        '$state',
        '$stateParams',
        'Alert',
        'Template',
        'NavService',
        'Workflows',
        TemplatesDetailsCtrl
    ]);

function TemplatesDetailsCtrl(Error, $http, locale, Restangular, ResourceCommon, ResourceSelect, $rootScope, $sce, $scope, $state, $stateParams, Alert, Template, NavService, Workflows) {
    const vm = this;
    vm.name = locale.getString('templates.title_details');
    vm.currentView = 'general';

    vm.editing = false;

    vm.save = save;
    vm.hide = hide;
    vm.edit = edit;
    vm.restore = restore;
    vm.delete = forceDelete;
    vm.archive = archive;
    vm.fixJson = fixJson;
    vm.downloadFile = downloadFile;
    vm.copyTemplate = copyTemplate;
    vm.cancelCopy = cancelCopy;
    vm.cancelEditing = cancelEditing;
    vm.selectTicket = selectTicketsModal;
    vm.trustTemplateHtml = trustTemplateHtml;
    vm.reloadTemplate = loadTemplate;

    init();

    function init() {
        if ($stateParams.store) {
            vm.manager = $stateParams.store;
        }
        loadTemplate();
    }

    function loadTemplate() {
        Template.one($stateParams.id).get({include: 'ticket,type,passbook'}).then(function (template) {
            vm.model = template;
            vm.model.loadingBeeFree = true;
            _updateCustomActions();
            return template;
        });
    }

    function _updateCustomActions() {
        const actions = Workflows.getWorkflows('templates::details')
            .filter(workflow => {
                return vm.model.archived ? workflow.level === 'archived-highlight' : workflow.level === 'highlight';
            })
            .map(workflow => {
                if (!workflow.onClick) {
                    workflow.onClick = workflow.action;
                }

                workflow.action = () => {
                    workflow.onClick(vm.model, vm);
                };

                return workflow;
            });

        NavService.overrideMainSideNavActions(actions);

        NavService.setStateParameters({
            id: vm.model.id,
            template: vm.model
        });
        NavService.setBreadcrumbParameters({
            template_name: vm.model.name
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
            }
        ];


        NavService.setSideNavCustoms(_.sortBy(customs, 'order'));
    }

    function _changeView(view) {
        vm.currentView = view;
        _updateCustomActions();
    }

    function trustTemplateHtml(string) {
        return $sce.trustAsHtml(string);
    }

    function selectTicketsModal() {
        return ResourceSelect.ticket().then(function (ticket) {
            vm.model.ticket_id = ticket.id;
            save(vm.model);
            Alert.success(locale.getString('tickets.tickets_added'), locale.getString('tickets.tickets_added_message'));
        }, err => Alert.handle(err));
    }

    function copyTemplate() {
        vm.copying = true;
        vm.original = _.cloneDeep(vm.model);
        vm.model.name = vm.model.name + ' - copy';
        $state.go('app.templates.main.create', {template: vm.model});
    }

    function edit() {
        $state.go('app.templates.main.edit', {id: vm.model.id, template: vm.model});
    }

    function fixJson() {
        Restangular.one('/templates/' + vm.model.id + '/fix-beefree').post().then(function () {
            Alert.success(locale.getString('templates.template_fixed'), locale.getString('templates.template_fixed_json'));
            loadTemplate();
        });
    }

    function save(model) {
        if (_.isArray(model.ticket_id)) model.ticket_id = undefined;

        if (model.fromTemplate) {
            model.beePluginInstance.save();
        } else {
            if (!_.isUndefined(vm.copying) && vm.copying) {
                saveCopy(model);
            } else {
                saveUpdate(model);
            }
        }
    }

    function saveUpdate(model) {
        model.save().then(function (model) {
            console.log('new model', model);
            vm.model = model;

            cancelEditing();
        }, err => Alert.handle(err));
    }

    function saveCopy(fields) {
        Template.post(fields).then(() => {

            Alert.success(locale.getString('templates.templates_saved'), locale.getString('templates.templates_creation_successful'));
            $state.go('app.templates.main.index');
        }, err => Alert.handle(err));
    }

    function cancelCopy() {
        vm.model = _.cloneDeep(vm.original);
        vm.copying = false;
    }

    function cancelEditing() {
        if (!_.isUndefined(vm.copying) && vm.copying) {
            cancelCopy();
        }
        vm.editing = false;
    }

    function hide() {
        var data = {};
        if (vm.manager) {
            data = {
                notify: false,
                reload: false,
                location: true
            };
        }
        $state.go('app.templates.main.index', {}, data);
    }

    function restore(model) {
        Alert.swal({
                title: locale.getString('common.confirm_restore'),
                text: locale.getString('templates.confirm_restore'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('common.yes_restore'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.restore().then(function (model) {
                        Alert.success(locale.getString('common.restore_successful'), locale.getString('templates.restore_successful'));
                        vm.model = model;
                    }, response => {
                        Alert.error(locale.getString('common.restore_not_successful'), response.data.message);
                    });
                }
            });
    }

    function forceDelete(model) {
        Alert.swal({
                title: locale.getString('common.confirm_force_delete'),
                text: locale.getString('templates.confirm_force_delete'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('common.yes_force_delete'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.forceDelete().then(function () {
                        $state.go('app.templates.main.index');
                        Alert.success(locale.getString('common.force_delete_successful'), locale.getString('templates.force_delete_successful'));
                    }, response => {
                        Alert.error(locale.getString('common.force_delete_not_successful'), response.data.message);
                    });
                }
            });
    }

    function archive() {
        Alert.swal({
                title: locale.getString('common.confirm_archive'),
                text: locale.getString('templates.confirm_archive'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('common.yes_archive'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    vm.model.doDELETE().then(function (model) {
                        Alert.success(locale.getString('common.archive_successful'), locale.getString('templates.archive_successful'));
                        vm.model = model;
                    }, response => {
                        Alert.error(locale.getString('common.archive_not_successful'), response.data.message);
                    });
                }
            });
    }

    function downloadFile(file) {
        ResourceCommon.download(file.url, file.name);
    };
}
