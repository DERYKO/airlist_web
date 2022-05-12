class InviteEmailModalController {
    constructor($uibModalInstance, $http, Alert, $injector) {
        this.modalInstance = $uibModalInstance;
        this.api = $http;
        this.alert = Alert;
        this.injector = $injector;

        this.availableRoles = [];

        this.emailToInvite = '';
        this.rolesToAttach = [];

        this._prepareAvailableRoles();
    }

    inviteEmail() {
        if(!this.emailToInvite) {
            this.alert.error('Invalid email', 'An invalid email was entered');
            return;
        }

        if(_.isEmpty(this.rolesToAttach)) {
            this.alert.error('No roles selected', 'Please select at minimum one role the new user gets attached');
            return;
        }

        this.api.post('users/invite', {
            email: this.emailToInvite,
            roles: this.rolesToAttach
        }).then((response) => {
            this.modalInstance.dismiss();
            this.alert.success('Invited', 'The entered email was invited to the company')
        }, (response) => {
            this.alert.handle(response);
        });
    }

    cancel() {
        this.modalInstance.dismiss();
    }

    _prepareAvailableRoles() {
        const usersStore = this.injector.get('Users');
        usersStore.dispatch('getLoggedIn').then(() => {
            this.availableRoles = _.get(usersStore.state, 'company.roles', null);
        }, () => {

        });
    }
}

InviteEmailModalController.$inject = [
    '$uibModalInstance',
    '$http',
    'Alert',
    '$injector'
];

/**
 * @ngdoc object
 * @name users.controller:UsersCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.users')
    .controller('InviteEmailModalController', InviteEmailModalController);
