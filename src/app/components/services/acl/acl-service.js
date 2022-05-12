class AclService {
    constructor(Alert, $rootScope, $state, Users, Workflows) {
        this.user = $rootScope.user;
        this.company = $rootScope.company;
        this.state = $state;
        this.alert = Alert;
        this.usersStore = Users;
        this.workflows = Workflows;
    }

    setUser(user) {
        this.user = user;
    }


    setCompany(company) {
        this.company = company;
    }

    hasRight(right) {
        const explodedRight = right.split('::');
        if (explodedRight.length !== 2) {
            console.error('Right name error on right check', {
                right: right
            });
            return false;
        }

        return this.usersStore.dispatch('hasRight', {
            module: explodedRight[0],
            right: explodedRight[1]
        });
    }

    hasWorkflow(right) {
        const explodedWorkflow = right.split('::'),
            explodedWorkflowPath = explodedWorkflow[1].split('.');

        if (explodedWorkflow.length !== 2 && explodedWorkflowPath.length !== 2) {
            console.error('Workflow name error on workflow check', {
                right: right
            });
            return false;
        }

        const workflows = _.get(this.usersStore.state.loggedin.profile.workflows, explodedWorkflow[0] + '.' + explodedWorkflowPath[0], []);

        if (_.isArray(workflows)) {
            if (workflows.indexOf(explodedWorkflowPath[1]) !== -1) {
                return true;
            }
        }

        return false;
    }

    hasModule(module) {
        return !!(this.company && this.company.modules.indexOf(module) > -1);
    }

    accessDenied(right) {
        this.alert.error('Access Denied', 'You do not have permission to access this page');
        console.log('Access Denied:', right)
    }
}


angular
    .module('airlst.components')
    .service('Acl', ['Alert', '$rootScope', '$state', 'Users', 'Workflows', (Alert, $rootScope, $state, Users, Workflows) => new AclService(Alert, $rootScope, $state, Users, Workflows)]);

