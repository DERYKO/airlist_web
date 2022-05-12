/**
 * @ngdoc object
 * @name messages.controller:MessagesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.messages')
    .controller('MessagesDetailsCtrl', [
        'Env',
        'locale',
        'Message',
        'ResourceCommon',
        '$sce',
        '$state',
        '$stateParams',
        'Alert',
        'NavService',
        'Workflows',
        MessagesDetailsCtrl
    ]);

function MessagesDetailsCtrl(Env, locale, Message, ResourceCommon, $sce, $state, $stateParams, Alert, NavService,Workflows) {
    var vm = this;
    vm.currentView = 'general';
    vm.closeMessage = closeMessage;
    vm.trustTemplateHtml = trustTemplateHtml;
    vm.downloadAttachment = downloadAttachment;
    vm.goToMessage = goToMessage;

    init();

    function init() {
        vm.store = $stateParams.store;
        loadMessage().then(message => {
            _updateCustomActions();
            if (vm.store) {
                vm.selectedIndex = _.findIndex(vm.store.state.data, {id: message.id});
            }
        });

    }

    function _updateCustomActions() {

        NavService.setBreadcrumbParameters({
            message_title: vm.message.subject || vm.message.send_to
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
                label: 'Message',
                active: (vm.currentView === 'message'),
                icon: 'envelope',
                order: 10,
                action: function () {
                    _changeView('message');
                }
            }
        ];

        customs.sort(function (a, b) {
            return a.order - b.order;
        });

        NavService.setSideNavCustoms(customs);
        const highlights = _(Workflows.getWorkflows('messages::details'))
            .filter(workflow => {
                return vm.message.archived ? workflow.level === 'archived-highlight' : workflow.level === 'highlight';
            })
            .map(workflow => {
                if (!workflow.onClick) {
                    workflow.onClick = workflow.action;
                }
                workflow.action = () => {
                    workflow.onClick(vm.message, this);
                };
                workflow.order = workflow.order || 30;
                return workflow;
            })
            .sortBy('order', 'asc')
            .value();

        NavService.overrideMainSideNavActions(highlights);
    }

    function _changeView(view) {
        vm.currentView = view;
        _updateCustomActions();
    }

    function loadMessage() {
        return Message.one($stateParams.id).get({include: 'recipient,recipient.contact,template'})
            .then(record => {
            vm.message = record;

                return record;
            }, () => {
            Alert.error(locale.getString('messages.message_not_found'), locale.getString('messages.message_not_found_message'));
            closeMessage();
        });
    }

    function goToMessage(message) {
        $state.go('app.messages.details', {id: message.id, message, store: vm.store}, {reload: true});
    }
    function trustTemplateHtml(string) {
        return $sce.trustAsHtml(string);
    }

    function closeMessage() {
        $state.go('app.messages.index');
    }

    function downloadAttachment(name) {
        ResourceCommon.download(Env.apiUrl + '/messages/' + vm.message.id + '/attachment/' + name, name)
    }
}
