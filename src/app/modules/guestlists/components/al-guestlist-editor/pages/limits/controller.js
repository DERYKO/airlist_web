import AbstractAlGuestlistEditorPagesController from '../../abstracts/abstract-page-controller';

export default class AlGuestlistEditorPageLimitsComponentController extends AbstractAlGuestlistEditorPagesController {

    constructor($injector, $scope) {
        super($injector, $scope);

        this.enableOpenRegPaxLimit = false;
        this.enableCodeRegPaxLimit = false;
    }

    updateLimits(newValue) {
        this.model.settings.registration_limits = newValue;
    }

    _initWatchers() {
        super._initWatchers();

        this.scope.$watch(() => {
            return this.enableOpenRegPaxLimit;
        }, () => {
            if (this.model.settings && !this.enableOpenRegPaxLimit) {
                this.model.settings.open_reg_pax_limit = 0;
            }
        });

        this.scope.$watch(() => {
            return this.enableCodeRegPaxLimit;
        }, () => {
            if (this.model.settings && !this.enableCodeRegPaxLimit) {
                this.model.settings.code_reg_pax_limit = 0;
            }
        })
    }

    _fillModelFromGuestlist() {
        this.model = {
            settings: {
                open_reg_pax_limit: this.getGuestlistValue('settings.open_reg_pax_limit'),
                open_reg_pax_limit_states: this.getGuestlistValue('settings.open_reg_pax_limit_states'),
                open_reg_enable_waitlist: this.getGuestlistValue('settings.open_reg_enable_waitlist'),
                code_reg_pax_limit: this.getGuestlistValue('settings.code_reg_pax_limit'),
                code_reg_pax_limit_states: this.getGuestlistValue('settings.code_reg_pax_limit_states'),
                code_reg_enable_waitlist: this.getGuestlistValue('settings.code_reg_enable_waitlist'),

                registration_limit_public_counts: this.getGuestlistValue('settings.registration_limit_public_counts'),
                registration_limit_states: this.getGuestlistValue('settings.registration_limit_states'),
                registration_limits: this.getGuestlistValue('settings.registration_limits')
            }
        };

        if (this.model.settings.open_reg_pax_limit > 0) {
            this.enableOpenRegPaxLimit = true;
        }

        if (this.model.settings.code_reg_pax_limit > 0) {
            this.enableCodeRegPaxLimit = true;
        }
    }

    _initFormConfig() {
        const formConfig = {
            ...this.state.formConfig,
            rsvpStates: []
        };

        this._updateState({
            ...this.state,
            formConfig
        });

        this.depositService.getRemoteDeposit('rsvps', 'states', []).then((depositRsvpStates) => {
            const formConfig = {
                rsvpStates: []
            };

            _.each(depositRsvpStates, (v, k) => {
                formConfig.rsvpStates.push({
                    value: k,
                    label: v
                })
            });

            this._updateState({
                ...this.state,
                formConfig: {
                    ...this.state.formConfig,
                    ...formConfig
                }
            });
        })
    }
}
