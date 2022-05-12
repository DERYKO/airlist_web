import CompanyModules from '../factories/modules-service';
import modelReducer from '../helpers/user-model-reducer';

class UsersEditCtrl {
    constructor(Alert, NavService, $rootScope, $state, $stateParams, $http) {
        this.params = $stateParams;
        this.api = $http;
        this.state = $state;
        this.alert = Alert;
        this.api.get(`users/${$stateParams.id}`).then(response => {
            this.originalUser = response.data.data;
            this.user = modelReducer(response.data.data);
            NavService.setBreadcrumbParameters({
                user_name: this.user.full_name
            });
            NavService.setStateParameters('app.users.details', {
                id: this.user.id
            });
        });
        this.roles = $rootScope.company.roles;
        this.modules = CompanyModules.getModules($rootScope.company.modules);
    }

    save(user) {
        this.api.put(`users/${this.params.id}`, user)
            .then(response => {
                if (this.params.store) {
                    this.params.store.dispatch('getData')
                }

                this.state.go('app.users.details', {
                    id: this.params.id,
                    store: this.params.store,
                    user: response.data.data
                });

            }, rejection => {
                this.alert.error(rejection.data.message);
            });
    }

    cancel() {
        this.state.go('app.users.details', this.params);
    }
}


angular
    .module('airlst.users')
    .controller('UsersEditCtrl', [
        'Alert',
        'NavService',
        '$rootScope',
        '$state',
        '$stateParams',
        '$http',
        UsersEditCtrl
    ]);
