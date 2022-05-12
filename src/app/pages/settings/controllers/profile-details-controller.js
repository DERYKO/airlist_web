class ProfileDetailsController {

    constructor($rootScope, $state, NavService, Workflows) {
        this.rootScope = $rootScope;
        this.state = $state;
        this.navService = NavService;
        this.workflows = Workflows;

        this.roles = this.rootScope.company.modules;
        this.model = this.rootScope.user;
        this.setMainNavActions();
    }

    setMainNavActions() {
        const actions = _(this.workflows.getWorkflows('users::profile-details'))
            .filter(workflow => {
                return workflow.level === 'highlight';
            })
            .map(workflow => {
                if (!workflow.onClick) {
                    workflow.onClick = workflow.action;
                }
                workflow.action = () => {
                    workflow.onClick(this.contact, this);
                };
                workflow.order = workflow.order || 5;
                return workflow;
            })
            .sortBy('order', 'asc')
            .value();

        this.navService.overrideMainSideNavActions(actions);
    }
}

/**
 *
 */
angular
    .module('airlst.settings')
    .controller('ProfileDetailsCtrl', [
        '$rootScope',
        '$state',
        'NavService',
        'Workflows',
        ProfileDetailsController
    ]);
