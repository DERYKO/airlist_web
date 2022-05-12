import scorePassword from '../../../helpers/score-password';

export default class ResetController {

    constructor($auth, locale, $state, SweetAlert) {
        this.auth = $auth;
        this.locale = locale;
        this.state = $state;
        this.sweetAlert = SweetAlert;

        this.model = {
            password: '',
            passwordConfirmation: ''
        };

        this._calculateStrength();
        this.checkPasswordMatch();
    }

    checkPasswordMatch() {
        this.passwordsMatch = (this.model.password === this.model.passwordConfirmation);
    }

    checkStrength() {
        this._calculateStrength();
    }

    submit() {
        if (!this.passwordsMatch || this.strength < 60) {
            return;
        }

        const details = {
            code: this.state.params.code,
            password: this.model.password
        };

        this.auth.resetPassword(details).then(() => {
            this.sweetAlert.swal(this.locale.getString('auth.reset_successful'), this.locale.getString('auth.reset_successful_message'), 'success');
            this.state.go('auth.login');
        }, (response) => {
            this.sweetAlert.swal(this.locale.getString('auth.reset_failed'), response.data.error, 'error');
        });
    }

    _calculateStrength() {
        this.strength = scorePassword(this.model.password);

        let classToSet;
        if (this.strength < 60) {
            classToSet = 'insecure';
        } else if (this.strength <= 80) {
            classToSet = 'ok';
        } else {
            classToSet = 'strong';
        }

        this.strengthClass = classToSet;
    }
}

ResetController.$inject = [
    '$auth',
    'locale',
    '$state',
    'SweetAlert'
];
