import selectCompanyModalTemplate from '../views/modals/selected-company-modal.tpl.html';

class AuthController {
    constructor($auth, locale, $rootScope, $state, Alert, $uibModal, $scope, $http, Users) {
        this.auth = $auth;
        this.locale = locale;
        this.rootScope = $rootScope;
        this.state = $state;
        this.alert = Alert;
        this.modal = $uibModal;
        this.scope = $scope;
        this.api = $http;
        this.userStore = Users;

        this.companyUid = null;
    }

    login(credentials) {
        credentials = _.clone(credentials);
        this.api.post('auth/login', {
            ...credentials,
            company_uid: this.companyUid
        }).then((response) => {
            this.rootScope.user = _.get(response, 'data.data.user');
            this.auth.setToken(_.get(response, 'data.data.token'));
            location.reload();
        }, (errorResponse) => {
            if (errorResponse && errorResponse.status === 400 && _.get(errorResponse, 'data.data.error') === 'invalid_company_provided') {
                const availableCompanies = _.get(errorResponse, 'data.data.available_companies');

                this.modal.open({
                    controller: 'SelectCompanyModalController',
                    controllerAs: 'vm',
                    size: 'sm',
                    templateUrl: selectCompanyModalTemplate,
                    resolve: {
                        availableCompanies: () => {
                            return availableCompanies;
                        }
                    }
                }).result.then((dataFromModal) => {
                    this.companyUid = dataFromModal.selectedCompany.uid;
                    this.login(credentials);
                    this.scope.$applyAsync();
                }, () => {
                    this.state.go('auth.login', {}, {reload: true});
                }).catch((e) => {
                    this.alert.handle(e);
                });
            } else {
                this.alert.error(this.locale.getString('auth.login_failed'), errorResponse.data.message);
            }
        });
    }

    forgot(email) {
        this.auth.recoverPassword(email).then((response) => {
            this.alert.success(this.locale.getString('auth.recover_successful'), this.locale.getString('auth.recover_successful_message'));
            this.state.go('auth.login');
        }, (response) => {
            this.alert.handle(response);
        });
    }
}

AuthController.$inject = [
    '$auth',
    'locale',
    '$rootScope',
    '$state',
    'Alert',
    '$uibModal',
    '$scope',
    '$http',
    'Users'
];

/**
 * @ngdoc object
 * @name auth.controller:AuthCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.auth')
    .controller('AuthCtrl', AuthController);

// function AuthCtrl($auth, locale, $rootScope, $state, SweetAlert, Users, Alert) {
//     const vm = this;
//
//     vm.login = login;
//     vm.forgot = forgot;
//
//     function login(credentials, first_time) {
//         $auth.login(credentials, {
//             transformResponse: (data) => {
//                 const jsonData = JSON.parse(data);
//                 return jsonData.data ? jsonData.data : jsonData;
//             }
//         })
//             .then(function (response) {
//                 $rootScope.user = response.transformed;
//                 if (first_time) {
//                     SweetAlert.swal(locale.getString('auth.login_successful'), locale.getString('auth.first_login_message', {name: response.data.user.first_name}), 'success');
//                 }
//                 $state.go('app.dashboard', {}, {reload: true});
//             })
//             .catch(function (response) {
//                 if (response && response.code)
//                     SweetAlert.swal(locale.getString('auth.login_failed'), response.data.message, 'error');
//             });
//     }
//
//     function forgot(email) {
//         $auth.recoverPassword(email).then(function (response) {
//             SweetAlert.swal(locale.getString('auth.recover_successful'), locale.getString('auth.recover_successful_message'), 'success');
//             $state.go('auth.login');
//         }, function (response) {
//             SweetAlert.swal(locale.getString('auth.recover_failed'), response.data.message, 'error');
//         });
//     }
// }
