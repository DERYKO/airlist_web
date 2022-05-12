import selectCompanyModalTemplate from '../../../../pages/auth/views/modals/selected-company-modal.tpl.html';

/**
 * @ngdoc object
 * @name theme.base.controller:HeaderCtrl
 *
 * @description
 *
 */

class LayoutHeaderCtrl {
    constructor($location, $transitions, Users, $uibModal, $auth, Alert, $http, $state, $timeout) {
        this.modal = $uibModal;
        this.auth = $auth;
        this.alert = Alert;
        this.api = $http;
        this.currentLocation = $location.path();
        this.state = $state;
        this.timeout = $timeout;
        this.showNav = false;

        $transitions.onStart({}, trans => {
            trans.promise.finally(() => {
                this.currentLocation = $location.path();
            });
        });

        this.store = Users;
        this.store.dispatch('getLoggedIn').then(() => {
            this.user = this.store.state.loggedin.profile;

            if (this.user) {
                this.showNav = true;
            } else {
                this.showNav = false;
            }
        });
        this.checkinMode = false;
    }

    toggleCheckinMode() {
        this.store.dispatch('toggleCheckinMode', this.checkinMode);
    }

    switchCompany() {
        this.modal.open({
            controller: 'SelectCompanyModalController',
            controllerAs: 'vm',
            size: 'sm',
            templateUrl: selectCompanyModalTemplate,
            resolve: {
                availableCompanies: () => {
                    return this.store.state.loggedin.profile.available_companies;
                }
            }
        }).result.then((dataFromModal) => {
            const companyUidToSwitchTo = dataFromModal.selectedCompany.uid;

            this.api.post('auth/switch-company', {
                company_uid: companyUidToSwitchTo
            }).then((response) => {
                this.auth.setToken(_.get(response, 'data.data.token'));
                this.state.go('app.dashboard', {}).then(() => {
                    this.timeout(() => {
                        location.reload();
                    }, 400);
                    // console.log('test');
                });
            }, () => {
                this.alert.error('Error', 'Error while switching company');
            })
        }, (e) => {

        }).catch((e) => {
            this.alert.handle(e);
        });
    }
}


angular
    .module('airlst.theme.airlst')
    .controller('LayoutHeaderCtrl', [
        '$location',
        '$transitions',
        'Users',
        '$uibModal',
        '$auth',
        'Alert',
        '$http',
        '$state',
        '$timeout',
        LayoutHeaderCtrl
    ]);

