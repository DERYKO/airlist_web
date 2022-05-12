/**
 * @ngdoc object
 * @name tickets.controller:TicketsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.tickets')
    .controller('TicketDetailsCtrl', [
        'Blob',
        'FileSaver',
        '$http',
        '$stateParams',
        'NavService',
        'ResourceSelect',
        '$state',
        'Error',
        'Alert',
        'Acl',
        'Workflows',
        TicketDetailsCtrl
    ]);

function TicketDetailsCtrl(Blob, FileSaver, $http, $stateParams, NavService, ResourceSelect, $state, Error, Alert, Acl, Workflows) {
    const vm = this;

    vm.hideTicket = hideTicket;

    _init();

    function _init() {
        if ($stateParams.store) {
            vm.store = $stateParams.store;
        }

        if ($stateParams.ticket) {
            vm.model = $stateParams.ticket;
            return _updateCustomActions();
        }
        $http.get(`tickets/${$stateParams.id}`)
             .then(response => {
                 vm.model = response.data.data;
                 return _updateCustomActions();
             }, () => {
                 $state.go('app.tickets.index');
             });

    }

    function _updateCustomActions() {
        NavService.setBreadcrumbParameters({
            ticket_name: vm.model.name
        });

        const actions = _(Workflows.getWorkflows('tickets::details'))
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
                workflow.order = workflow.order || 30;
                return workflow;
            })
            .sortBy('order', 'asc')
            .value();

        NavService.overrideMainSideNavActions(actions);



    }

    function hideTicket() {
        $state.go('app.tickets.index');
    }
}
