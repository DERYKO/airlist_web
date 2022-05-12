import scorePassword from '../../../helpers/score-password';

/**
 *
 */
class ActivationController {
    constructor(locale, $state, $stateParams, Alert, $http) {
        this.locale = locale;
        this.state = $state;
        this.stateParams = $stateParams;
        this.alert = Alert;
        this.api = $http;

        this.submitting = false;
        this.ready = false;
        this.passwordStrength = 0;
        this.passwordConfirmation = '';

        this.model = {
            first_name: '',
            last_name: '',
            password: ''
        };

        this.locale.ready('auth').then(() => {
            this.ready = true;
        });
    }

    checkStrength() {
        this.passwordStrength = scorePassword(this.model.password);
    }

    checkPasswordConfirmation() {
        this.passwordsMatch = this.model.password === this.passwordConfirmation;

        return this.passwordsMatch;
    };

    activate(activateForm) {
        if (this.submitting || !activateForm.$valid || !this.checkPasswordConfirmation() || this.passwordStrength < 60) {
            return;
        }

        this.submitting = true;

        const dataForApi = {
            ...this.model,
            uid: this.stateParams.uid
        };

        this.api.post('auth/activate', dataForApi).then(() => {
            this.state.go('auth.login');
            this.alert.success('Activated', 'Your account was activated successfully');
        }, (response) => {
            this.submitting = false;
            this.alert.handle(response);
        });

        console.log('submitting');
    }
}

ActivationController.$inject = [
    'locale',
    '$state',
    '$stateParams',
    'Alert',
    '$http'
];

/**
 * @ngdoc object
 * @name auth.controller:ActivationCtrlCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.auth')
    .controller('ActivationCtrl', ActivationController);
