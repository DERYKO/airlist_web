import AbstractAlGuestlistEditorPagesController from '../../abstracts/abstract-page-controller';
import moment from 'moment';

export default class AlGuestlistEditorPageFormComponentController extends AbstractAlGuestlistEditorPagesController {

    constructor($injector, $scope) {
        super($injector, $scope);

        this.registrationTypes = [
            {
                key: 'no_external',
                settings: {
                    enable_open_registration: false,
                    enable_code_registration: false
                }
            },
            {
                key: 'just_open',
                settings: {
                    enable_open_registration: true,
                    enable_code_registration: false
                }
            },
            {
                key: 'just_closed',
                settings: {
                    enable_open_registration: false,
                    enable_code_registration: true
                }
            },
            {
                key: 'open_and_closed',
                settings: {
                    enable_open_registration: true,
                    enable_code_registration: true
                }
            }
        ];

        this.copyMainGuestFieldModels = {
            guests: {
                state: true,
                field_setting: 'registration_guest_fields',
                enable_setting: 'enable_guests'
            },
            recommendations: {
                state: true,
                field_setting: 'recommendations_fields',
                enable_setting: 'enable_recommendations'
            },
            representative: {
                state: true,
                field_setting: 'representative_fields',
                enable_setting: 'enable_representative'
            }
        };
        this.currentRegistrationType = 'no_external';
        this.statusMappingPresets = [
            {
                key: "no_change"
            },
            {
                key: "allow_cancellation"
            },
            {
                key: "allow_all_changes"
            },
            {
                key: "individual"
            }
        ];
        this.currentStatusMappingPreset = 'no_change';

        this.registrationTimeRangeEnabled = false;
        this.dateFields = {
            registration_start: moment(),
            registration_end: moment()
        };

        this.openRegPasswordEnabled = false;

        /** @todo Find solution for autofill on guestlist init */
        this.doNotAutoConfirmOpenRegistration = true;
        this._initSpecialWatchers();
        this.modelPrepared = false;
        this.internalDefinitions = {};
    }

    updateFieldDefinition(setting, newDefinition) {
        this.internalDefinitions[setting] = newDefinition;
        _.set(this.model, `settings.${setting}`, newDefinition);
    }

    triggerCustomFieldChange(action, group, definition, number) {
        this.onCustomFieldChange({action, group, definition, number});
    }

    handleSubPersonGroupChange(groupIdentifier) {
        const groupConfig = this.copyMainGuestFieldModels[groupIdentifier];

        if (this.model.settings[groupConfig.enable_setting]) {
            groupConfig.state = true;
        } else {
            this.model.settings[groupConfig.field_setting] = [];
        }
    }

    handleCopyMainGuestFieldsChange(groupIdentifier) {
        const groupConfig = this.copyMainGuestFieldModels[groupIdentifier];

        if (groupConfig.state) {
            this.updateFieldDefinition(groupConfig.field_setting, _.cloneDeep(this.model.settings.registration_fields));
        }
    }

    toggleStatusFlowSelection(toggleState, arrayOfData) {
        const index = arrayOfData.indexOf(toggleState);

        if (index > -1) {
            arrayOfData.splice(index, 1);
        } else {
            arrayOfData.push(toggleState);
        }
    }

    // Internal functions
    _initWatchers() {
        super._initWatchers();

        this.scope.$watch(() => {
            return this.currentRegistrationType;
        }, () => {
            _.each(this.registrationTypes, (typeInfo) => {
                if (typeInfo.key === this.currentRegistrationType) {
                    this.model.settings = {
                        ...this.model.settings,
                        ..._.cloneDeep(typeInfo.settings)
                    }
                }
            });

            this._triggerModelUpdate();
        });

        this.scope.$watch(() => {
            return this.dateFields;
        }, () => {
            _.set(this.model, 'settings.registration_start', this.dateFields.registration_start ? this.transformDateFieldForModel(this.dateFields.registration_start) : null);
            _.set(this.model, 'settings.registration_end', this.dateFields.registration_end ? this.transformDateFieldForModel(this.dateFields.registration_end) : null);
            this._triggerModelUpdate()
        }, true);

        this.scope.$watch(() => {
            return this.openRegPasswordEnabled;
        }, () => {
            if (this.openRegPasswordEnabled) {
                this.model.settings.open_reg_password = '';
                this._triggerModelUpdate();
            }
        }, true);

        this.scope.$watch(() => {
            return this.registrationTimeRangeEnabled;
        }, () => {
            if (this.registrationTimeRangeEnabled) {
                this.dateFields.registration_end = this.transformDateForDateField(moment());
                this.dateFields.registration_start = this.transformDateForDateField(moment());
            } else {
                this.dateFields.registration_end = null;
                this.dateFields.registration_start = null;
            }
        }, true);

        this.scope.$watch(() => {
            return this.model.settings.registration_fields;
        }, () => {
            _.each(this.copyMainGuestFieldModels, (value, key) => {
                if (value.state && this.model.settings[value.enable_setting]) {
                    this.updateFieldDefinition(value.field_setting, _.cloneDeep(this.model.settings.registration_fields));
                } else if (!this.model.settings[value.enable_setting]) {
                    this.updateFieldDefinition(value.field_setting, []);
                }

            });
        }, true);

        this.scope.$watch(() => {
            return this.currentStatusMappingPreset;
        }, () => {
            if (this.state.formConfig.statusMappings.length > 0) {
                const currentMapping = _.first(this.injector.get('$filter')('filter')(this.state.formConfig.statusMappings, {key: this.currentStatusMappingPreset}, true));

                if (currentMapping) {
                    if(!_.isNull(currentMapping.mapping)) {
                        this.model.settings.registration_status_flow = currentMapping.mapping;
                    }
                    if(!_.isNull(currentMapping.loginStates)) {
                        this.model.settings.enable_login_states = currentMapping.loginStates;
                    }

                    this.scope.$applyAsync();
                }
            }

        });
    }

    _initSpecialWatchers() {
        _.each(this.copyMainGuestFieldModels, (settings, key) => {
            this.scope.$watch(() => {
                return this.model.settings[settings.enable_setting];
            }, () => {
                if (this.modelPrepared) {
                    this.handleSubPersonGroupChange(key);
                }
            });
            this.scope.$watch(() => {
                return settings.state;
            }, () => {
                if (this.modelPrepared) {
                    this.handleCopyMainGuestFieldsChange(key);
                }
            });
        });
    }

    _fillModelFromGuestlist() {
        this.model = {
            settings: {
                registration_start: moment(),
                registration_end: moment(),
                enable_open_registration: false,
                enable_code_registration: false,
                enable_guests: this.getGuestlistValue('settings.enable_guests'),
                guest_count_maximum: this.getGuestlistValue('settings.guest_count_maximum'),

                enable_representative: this.getGuestlistValue('settings.enable_representative'),
                representative_default_state: this.getGuestlistValue('settings.representative_default_state'),

                enable_recommendations: this.getGuestlistValue('settings.enable_recommendations'),
                recommendation_default_state: this.getGuestlistValue('settings.recommendation_default_state'),
                recommendation_count_maximum: this.getGuestlistValue('settings.recommendation_count_maximum'),

                open_reg_password: this.getGuestlistValue('settings.open_reg_password'),

                registration_fields: this.getGuestlistValue('settings.registration_fields'),
                registration_guest_fields: this.getGuestlistValue('settings.registration_guest_fields'),
                recommendations_fields: this.getGuestlistValue('settings.recommendations_fields'),
                representative_fields: this.getGuestlistValue('settings.representative_fields'),

                registration_status_flow: this.getGuestlistValue('settings.registration_status_flow'),
                enable_login_states: this.getGuestlistValue('settings.enable_login_states')
            }
        };

        this.internalDefinitions = {
            registration_fields: this.getGuestlistValue('settings.registration_fields'),
            registration_guest_fields: this.getGuestlistValue('settings.registration_guest_fields'),
            recommendations_fields: this.getGuestlistValue('settings.recommendations_fields'),
            representative_fields: this.getGuestlistValue('settings.representative_fields'),
        };

        _.each(this.copyMainGuestFieldModels, (value, key) => {
            value.state = _.isEqual(this.model.settings.registration_fields, this.model.settings[value.field_setting]);
        });

        this.openRegPasswordEnabled = !!this.model.open_reg_password;

        if (this.guestlist.settings.registration_start || this.guestlist.settings.registration_end) {
            this.registrationTimeRangeEnabled = true;
            this.dateFields.registration_start = this.transformDateForDateField(this.guestlist.settings.registration_start);
            this.dateFields.registration_end = this.transformDateForDateField(this.guestlist.settings.registration_end);
        } else {
            this.registrationTimeRangeEnabled = false;
            this.dateFields.registration_start = null;
            this.dateFields.registration_end = null;
        }

        _.each(this.registrationTypes, (typeInfo) => {
            let typeIsValid = true;
            _.each(typeInfo.settings, (value, setting) => {
                if (!_.has(this.guestlist, `settings.${setting}`) || _.get(this.guestlist, `settings.${setting}`) !== value) {
                    typeIsValid = false;
                }
            });

            if (typeIsValid) {
                this.currentRegistrationType = typeInfo.key;
            }
        });

        this.injector.get('$timeout')(() => {
            this.modelPrepared = true;
            this._checkCurrentStatusMappingPreset();
        }, 0);
    }

    _initFormConfig() {
        const formConfig = {
            ...this.state.formConfig,
            registrationTypes: [],
            rsvpStates: [],
            statusMappings: []
        };

        _.each(this.registrationTypes, (typeConfig) => {
            formConfig.registrationTypes.push({
                key: typeConfig.key,
                label: this.translate.instant(`guestlists.editor.pages.form.registrationTypes.${typeConfig.key}.label`),
                help_text: this.translate.instant(`guestlists.editor.pages.form.registrationTypes.${typeConfig.key}.help_text`)
            })
        });

        this._updateState({
            ...this.state,
            formConfig
        });

        this.depositService.getRemoteDeposit('rsvps', 'states', []).then((depositRsvpStates) => {
            const formConfig = {
                rsvpStates: [],
                statusMappings: []
            };

            _.each(depositRsvpStates, (v, k) => {
                formConfig.rsvpStates.push({
                    value: k,
                    label: v
                })
            });

            _.each(this.statusMappingPresets, (presetConfig) => {
                const currentMapping = {
                    default: []
                },
                currentLoginStates = _.map(depositRsvpStates, (sL, sS) => {
                    return sS;
                });

                _.each(depositRsvpStates, (label, status) => {
                    let currentMappingStates = [];

                    switch (presetConfig.key) {
                        case 'allow_cancellation':
                            currentMappingStates.push('cancelled');
                            break;
                        case 'allow_all_changes':
                            currentMappingStates = _.map(depositRsvpStates, (sL, sS) => {
                                return sS;
                            });
                            break;
                    }

                    if (status !== 'waitlisted') {
                        if (currentMappingStates.indexOf('confirmed') === -1) {
                            currentMappingStates.push('confirmed');
                        }
                    }

                    if (currentMappingStates.indexOf(status) === -1) {
                        currentMappingStates.push(status);
                    }

                    currentMapping[status] = currentMappingStates;
                });

                formConfig.statusMappings.push({
                    key: presetConfig.key,
                    label: this.translate.instant(`guestlists.editor.pages.form.statusMappingPresets.${presetConfig.key}`),
                    mapping: (presetConfig.key !== 'individual') ? currentMapping : null,
                    loginStates: (presetConfig.key !== 'individual') ? currentLoginStates : null
                });

            });

            this._updateState({
                ...this.state,
                formConfig: {
                    ...this.state.formConfig,
                    ...formConfig
                }
            });

            this.injector.get('$timeout')(() => {
                this._checkCurrentStatusMappingPreset();
            }, 0);
        })
    }

    _checkCurrentStatusMappingPreset() {
        if (this.state.formConfig.statusMappings.length > 0 && this.modelPrepared) {
            let mappingSet = false;

            _.each(this.state.formConfig.statusMappings, (mapping) => {
                if (_.isEqual(mapping.mapping, _.get(this.model, 'settings.registration_status_flow'))) {
                    mappingSet = true
                    this.currentStatusMappingPreset = mapping.key;
                }
            });

            if (!mappingSet) {
                this.currentStatusMappingPreset = 'individual';
            }
        }

    }
}
