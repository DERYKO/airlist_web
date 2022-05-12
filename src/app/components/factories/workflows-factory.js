class Workflows {
    constructor(Users, $injector) {
        this.store = Users;
        this.injector = $injector;
    }

    shouldShow(row, action) {
        let show = true;

        if (action && action.accessor && _.isFunction(action.accessor)) {
            show = action.accessor(row);
        }

        return show;
    }

    getWorkflows(module) {
        const explodedWorkflowKey = module.split('::');
        if (explodedWorkflowKey.length !== 2) {
            console.error('Invalid syntax in workflow key name', {
                name: module
            });
            return [];
        }

        return _(_.get(this.store.state.loggedin.profile.workflows, explodedWorkflowKey[0] + '.' + explodedWorkflowKey[1], []))
            .uniq()
            .map(workflow => {
                workflow = _.camelCase(workflow);
                if (this.injector.has(workflow)) {
                    return this.injector.get(workflow);
                }
            })
            .filter()
            .sort((a, b) => {
                const aOrder = _.get(a, 'order', 1000);
                const bOrder = _.get(b, 'order', 1000);

                if (aOrder < bOrder) {
                    return -1;
                } else if (aOrder > bOrder) {
                    return 1;
                } else {
                    return 0;
                }
            })
            .value();
    };
}


angular
    .module('airlst.components')
    .factory('Workflows', ['Users', '$injector', (Users, $injector) => new Workflows(Users, $injector)]);
