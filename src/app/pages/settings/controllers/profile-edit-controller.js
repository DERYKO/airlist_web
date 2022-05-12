import userModelReducer from '../../users/helpers/profile-model-reducer';

class ProfileEditController {

    constructor($rootScope, $http, Error, SweetAlert, $state, ResourceCommon) {
        this.rootScope = $rootScope;
        this.api = $http;
        this.errorHandler = Error;
        this.sweetAlert = SweetAlert;
        this.state = $state;
        this.resourceCommon = ResourceCommon;

        this.submitting = false;

        this.roles = this.rootScope.company.modules;
        this._loadProfile();
    }

    save() {
        if (this.submitting) {
            return;
        }
        this.submitting = true;

        this.api.put(`auth/profile`, this.model).then((updateResponse) => {
            this.submitting = false;
            this.model = updateResponse;

            this.sweetAlert.success('Success', 'Changes have been saved successful');
            this.state.go('app.settings.profile-details').then(() => {
                setTimeout(() => {
                    location.reload();
                }, 800);
            });

        }, (e) => {
            this.submitting = false;
            this.errorHandler.default(e);
        });
    }

    cancel() {
        this.state.go('app.settings.profile-details');
    }

    _loadProfile() {
        this.loading = true;

        this.api.get(`auth/profile?include=company`).then((response) => {
            this.loading = false;
            this.model = userModelReducer(response.data.data);
        }, (e) => {
            this.loading = false;
            this.errorHandler.default(e);
        });
    }
}

angular
    .module('airlst.settings')
    .controller('ProfileEditCtrl', [
        '$rootScope',
        '$http',
        'Error',
        'SweetAlert',
        '$state',
        'ResourceCommon',
        ProfileEditController
    ]);
