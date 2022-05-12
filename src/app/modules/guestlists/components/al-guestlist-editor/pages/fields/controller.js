import AbstractAlGuestlistEditorPagesController from '../../abstracts/abstract-page-controller';

export default class AlGuestlistEditorPageFieldsComponentController extends AbstractAlGuestlistEditorPagesController {

    constructor($injector, $scope) {
        super($injector, $scope);

        this.currentDefnition = [];
        this.currentEnabledFields = [];
    }

    _initWatchers() {
        super._initWatchers();

        this.scope.$watch(() => {
            return this.globalModel;
        }, (newVal, oldVal) => {
            if (!_.get(this.globalModel, 'settings.enabled_fields') || _.isEqual(_.get(newVal, 'settings.enabled_fields'), _.get(oldVal, 'settings.enabled_fields'))) {
                return;
            }

            this.currentEnabledFields = _.cloneDeep(this.globalModel.settings.enabled_fields);

            this.currentDefnition = _.map(this.globalModel.settings.enabled_fields, (field) => {
                return {
                    slug: field
                };
            });
        }, true);
    }

    updateFieldDefinition(newDefinition) {
        const newDef = _.uniqBy(newDefinition, 'slug');

        this.currentEnabledFields = [];
        this.currentEnabledFields = _.map(newDef, (row) => {
            return row.slug;
        });

        this.currentDefnition = _.cloneDeep(newDef);

        if (this.onEnabledFieldsUpdate) {
            this.onEnabledFieldsUpdate({
                newFieldList: _.cloneDeep(this.currentEnabledFields)
            });
        }
    }

    triggerCustomFieldChange(action, group, definition, number) {
        this.onCustomFieldChange({action, group, definition, number});
    }

    _fillModelFromGuestlist() {
        this.model = {
            settings: {
                enabled_fields: this.guestlist.settings.enabled_fields
            }
        };
    }

    _initFormConfig() {

    }
}
