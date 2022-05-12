import AbstractAlGuestlistEditorPagesController from '../../abstracts/abstract-page-controller';

export default class AlGuestlistEditorPageLandingComponentController extends AbstractAlGuestlistEditorPagesController {

    _initFormConfig() {
        this._updateState({
            ...this.state,
            formConfig: {
                ...this.state.formConfig,
                landingPageLabels: _.get(this.injector.get('Users'), 'state.company.settings.guestlists.lp_field_labels')
            }
        });
    }

    /**
     * @private
     */
    _fillModelFromGuestlist() {
        this.model = _.cloneDeep({
            settings: {
                image_1: this.getGuestlistValue('settings.image_1'),
                image_2: this.getGuestlistValue('settings.image_2'),
                image_3: this.getGuestlistValue('settings.image_3'),
                lp_text_1: this.getGuestlistValue('settings.lp_text_1'),
                lp_text_2: this.getGuestlistValue('settings.lp_text_2'),
                lp_text_3: this.getGuestlistValue('settings.lp_text_3'),
                lp_text_4: this.getGuestlistValue('settings.lp_text_4'),
                lp_text_5: this.getGuestlistValue('settings.lp_text_5'),
                lp_alert_texts: this.getGuestlistValue('settings.lp_alert_texts')
            }
        });
    }
}
