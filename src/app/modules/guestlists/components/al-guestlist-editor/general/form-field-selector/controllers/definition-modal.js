export default class AlGuestlistFormFieldDefinitionModalController {

    constructor($uibModalInstance, $scope, $injector, fieldConfig, currentDefinition) {
        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.injector = $injector;
        this.translate = this.injector.get('$translate');
        this.filter = this.injector.get('$filter');
        this.fieldConfig = fieldConfig;
        this.definition = currentDefinition;

        this.apiSettingTypes = [
            {
                key: 'read_and_update',
                settings: {
                    locked: false,
                    auto_fill: true
                }
            },
            {
                key: 'only_read',
                settings: {
                    locked: true,
                    auto_fill: true
                }
            },
            {
                key: 'no_action',
                settings: {
                    locked: true,
                    auto_fill: false
                }
            }
        ];

        this.formConfig = {
            apiSettingTypes: []
        };

        this._setCurrentApiSettingTypeForDefinition();
        this._prepareFormConfig();
        this._initWatchers();
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.currentApiSettingType;
        }, () => {
            const currentSelectedSetting = _.first(this.filter('filter')(this.apiSettingTypes, {key: this.currentApiSettingType}, true));
            if (currentSelectedSetting) {
                this.definition = _.merge(this.definition, currentSelectedSetting.settings);
            }
        });
    }

    _prepareFormConfig() {
        _.each(this.apiSettingTypes, (type) => {
            this.formConfig.apiSettingTypes.push({
                key: type.key,
                label: this.translate.instant(`guestlists.editor.components.form-field-selector.apiSettingTypes.${type.key}`)
            });
        });
    }


    dismiss() {
        this.modalInstance.dismiss();
    }

    save() {
        this.modalInstance.close(this.definition);
    }

    _setCurrentApiSettingTypeForDefinition() {
        _.each(this.apiSettingTypes, (type) => {
            let hasInvalidSetting = false;

            _.each(type.settings, (value, key) => {
                if (value !== this.definition[key]) {
                    hasInvalidSetting = true;
                }
            });

            if (!hasInvalidSetting) {
                this.currentApiSettingType = type.key;
            }
        })
    }
}

AlGuestlistFormFieldDefinitionModalController.$inject = [
    '$uibModalInstance',
    '$scope',
    '$injector',
    'fieldConfig',
    'currentDefinition'
];
