export default class AlGuestlistEditorComponentController {

    constructor($injector, $scope) {
        this.injector = $injector;
        this.scope = $scope;
        this.translate = this.injector.get('$translate');
        this.navService = this.injector.get('NavService');
        this.acl = this.injector.get('Acl');
        this.guestlistActionService = this.injector.get('GuestlistActionService');
        this.log = this.injector.get('$log');

        this.state = {};
        this.maxCustomFieldCounts = {
            contact: 40,
            rsvp: 40
        };
        this.definitionFields = [
            'registration_fields',
            'registration_guest_fields',
            'representative_fields',
            'recommendations_fields',
        ];
        this.globalEnabledFieldsInitiated = false;

        this._resetState();
        this._updateTabs();

        this._updateView('general');
        this._prepareContactCustomFieldDefinitions();
        this._initWatchers();
    }

    // Public callable functions
    updateModelValues(updatedValues) {
        const originalModel = _.cloneDeep(this.state.model);

        this._updateState({
            ...this.state,
            model: _.defaultsDeep(updatedValues, this.state.model)
        });

        if (_.get(originalModel, 'settings.enabled_fields')) {
            const newModel = _.cloneDeep(this.state.model);
            _.each(this.definitionFields, (field) => {
                if (!_.isEqual(originalModel.settings[field], newModel.settings[field])) {
                    this._updateGlobalEnabledFields();
                }
            });

            if (!this.globalEnabledFieldsInitiated) {
                this._updateGlobalEnabledFields();
            }
        }

        if (this.onModelUpdate) {
            this.onModelUpdate({newData: this.state.model});
        }
    }

    handleEnabledFieldsUpdate(newFieldList, blockGlobalUpdate) {
        this._updateState({
            ...this.state,
            model: {
                ...this.state.model,
                settings: {
                    ...this.state.model.settings,
                    enabled_fields: newFieldList
                }
            }
        });

        if (!blockGlobalUpdate) {
            this.injector.get('$timeout')(() => {
                this._updateGlobalEnabledFields();
            }, 0);
        }
    }

    handleCustomFieldChange(action, group, definition, number) {
        const newCustomFieldDefinitions = _.cloneDeep(this.state.customFieldDefinitions.definitions);
        switch (action) {
            case 'update':
                if (!this._checkIfCustomFieldExists(group, number)) {
                    return;
                }
                _.set(newCustomFieldDefinitions, `${group}.${number}`, AlGuestlistEditorComponentController._cleanUpCustomFieldDefinition(definition));
                break;
            case 'delete':
                if (!this._checkIfCustomFieldExists(group, number)) {
                    return;
                }
                delete newCustomFieldDefinitions[group][number];
                break;
            case 'add':
                const newNumber = this._findNextCustomFieldNumberForGroup(group);
                _.set(newCustomFieldDefinitions, `${group}.${newNumber}`, AlGuestlistEditorComponentController._cleanUpCustomFieldDefinition(definition));
                break;
        }

        this._updateState({
            ...this.state,
            customFieldDefinitions: {
                ...this.state.customFieldDefinitions,
                definitions: newCustomFieldDefinitions
            }
        });

        this._updateCustomFieldAvailability();
        this._updateAvailableFieldsByCurrentCustomFields();
    }


    // Private callable functions
    _findNextCustomFieldNumberForGroup(group) {
        for (let i = 1; i <= this.maxCustomFieldCounts[group]; i++) {
            const definition = _.get(this.state.customFieldDefinitions.definitions, `${group}.${i}`);
            if (!definition || _.isEmpty(definition)) {
                return i;
            }
        }

        return null;
    }

    _updateAvailableFieldsByCurrentCustomFields() {
        const customFieldRegex = /^(rsvp|contact)\.custom_([0-9]{1,2})$/,
            newAvailableFields = _.cloneDeep(this.state.availableFields);

        _.each(newAvailableFields, (field, slug) => {
            if (customFieldRegex.test(slug)) {
                const regexParts = customFieldRegex.exec(slug);
                if (!_.has(this.state.customFieldDefinitions.definitions, `${regexParts[1]}.${regexParts[2]}`)) {
                    delete newAvailableFields[slug];
                } else {
                    newAvailableFields[slug] = this._createFieldFromCustomDefinition(_.get(this.state.customFieldDefinitions.definitions, `${regexParts[1]}.${regexParts[2]}`))
                }
            }
        });

        _.each(this.state.customFieldDefinitions.definitions, (fields, group) => {
            _.each(fields, (fieldDefinition, fieldKey) => {
                const fieldSlug = `${group}.custom_${fieldKey}`;
                if (!newAvailableFields[fieldSlug]) {
                    newAvailableFields[fieldSlug] = this._createFieldFromCustomDefinition(fieldDefinition);
                }
            })
        });

        this._updateState({
            ...this.state,
            availableFields: newAvailableFields
        });
    }

    _createFieldFromCustomDefinition(customFieldDefinition) {
        customFieldDefinition = _.cloneDeep(customFieldDefinition);

        const fieldToFill = {
            default_label: customFieldDefinition.name,
            group: 'customs'
        };
        switch (customFieldDefinition.type) {
            case 'select':
                fieldToFill.enum = {};
                _.each(customFieldDefinition.enum, (val) => {
                    fieldToFill.enum[val] = val;
                });
            case 'textbox':
                fieldToFill.type = 'string';
                fieldToFill.multiline = false;
                break;
            case 'textarea':
                fieldToFill.type = 'string';
                fieldToFill.multiline = true;
                break;
            case 'decimal':
                fieldToFill.type = 'float';
                break;
            case 'boolean':
                fieldToFill.type = 'bool';
                break;
            case 'media_image':
                fieldToFill.type = 'image';
                break;
            case 'media_file':
                fieldToFill.type = 'file';
                break;
            case 'color_code_select':
                fieldToFill.type = 'color-codes';
                fieldToFill.enum = {};
                _.each(customFieldDefinition.enum, (val) => {
                    fieldToFill.enum[val.label] = val;
                });
                break;
            default:
            case 'integer':
            case 'datetime':
            case 'date':
                fieldToFill.type = customFieldDefinition.type;
                break;

        }

        return fieldToFill;
    }

    _checkIfCustomFieldExists(group, number) {
        if (_.has(this.state.customFieldDefinitions, `definitions.${group}.${number}`) && _.isObject(_.get(this.state.customFieldDefinitions, `definitions.${group}.${number}`))) {
            return true;
        }

        this.log.info('Custom field not exists', {group, number});
        return false;
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.guestlist;
        }, () => {
            if (this.guestlist) {
                this._loadAvailableFields();
                this._prepareRsvpCustomFieldDefinitions();
            }
        });
        this.scope.$watch(() => {
            return this.externalViewTrigger;
        }, () => {
            if (this.externalViewTrigger) {
                this._updateView(_.clone(this.externalViewTrigger));
            }
        });
    }

    _updateGlobalEnabledFields() {
        const globalEnabledFields = _.cloneDeep(this.state.model.settings.enabled_fields);
        this.globalEnabledFieldsInitiated = true;

        _.each(this.definitionFields, (field) => {
            _.each(_.get(this.state.model, `settings.${field}`, {}), (value) => {
                if (globalEnabledFields.indexOf(value.slug) === -1) {
                    globalEnabledFields.push(value.slug);
                }
            });
        });

        this.handleEnabledFieldsUpdate(globalEnabledFields, true);
    }

    _updateState(newState) {
        this.state = newState;
        this._updateTabs();
        this.scope.$applyAsync();
    }

    _resetState() {
        this._updateState({
            currentView: 'form',
            currentAnchor: '',
            model: {},
            availableFields: {},
            customFieldDefinitions: {
                availability: {
                    contact: false,
                    rsvp: false
                },
                definitions: {
                    contact: {},
                    rsvp: {}
                }
            }
        });
    }

    _loadAvailableFields() {
        if (!this.guestlist) {
            return;
        }

        this.guestlistActionService.getAvailableFieldsForGuestlist(this.guestlist.id).then((availableFields) => {
            this._updateState({
                ...this.state,
                availableFields
            });
        }, (e) => {
            this.log('Error in loading available fields', error);
        });

    }

    _updateCustomFieldAvailability() {
        this._updateState({
            ...this.state,
            customFieldDefinitions: _.defaultsDeep({
                availability: {
                    rsvp: Object.keys(this.state.customFieldDefinitions.definitions.rsvp).length < this.maxCustomFieldCounts.rsvp,
                    contact: Object.keys(this.state.customFieldDefinitions.definitions.contact).length < this.maxCustomFieldCounts.contact
                }
            }, this.state.customFieldDefinitions)
        });
    }

    _prepareRsvpCustomFieldDefinitions() {
        const currentRsvpCustomFieldDefinitions = {};
        let fieldsAvailable = false;

        for (let i = 1; i <= this.maxCustomFieldCounts.rsvp; i++) {
            const fieldDefinition = _.get(this.guestlist, `custom_${i}_name`);
            if (fieldDefinition && _.isObject(fieldDefinition) && Object.keys(fieldDefinition).length > 0) {
                currentRsvpCustomFieldDefinitions[i] = AlGuestlistEditorComponentController._cleanUpCustomFieldDefinition(fieldDefinition);
            } else {
                fieldsAvailable = true;
            }
        }

        this._updateState({
            ...this.state,
            customFieldDefinitions: _.defaultsDeep({
                availability: {
                    rsvp: Object.keys(currentRsvpCustomFieldDefinitions).length < this.maxCustomFieldCounts.rsvp
                },
                definitions: {
                    rsvp: currentRsvpCustomFieldDefinitions
                }
            }, this.state.customFieldDefinitions)
        });
    }

    _prepareContactCustomFieldDefinitions() {
        const company = this.injector.get('Users').state.company;

        const currentContactCustomFieldDefinitions = {};
        let fieldsAvailable = false;

        for (let i = 1; i <= this.maxCustomFieldCounts.contact; i++) {
            const fieldDefinition = _.get(company, `custom_${i}_name`);
            if (fieldDefinition && _.isObject(fieldDefinition) && Object.keys(fieldDefinition).length > 0) {
                currentContactCustomFieldDefinitions[i] = AlGuestlistEditorComponentController._cleanUpCustomFieldDefinition(fieldDefinition);
            } else {
                fieldsAvailable = true;
            }
        }

        this._updateState({
            ...this.state,
            customFieldDefinitions: _.defaultsDeep({
                availability: {
                    contact: Object.keys(currentContactCustomFieldDefinitions).length < this.maxCustomFieldCounts.contact
                },
                definitions: {
                    contact: currentContactCustomFieldDefinitions
                }
            }, this.state.customFieldDefinitions)
        });
    }

    _updateTabs() {
        let viewsToPerform = [
            {
                key: 'general',
                icon: 'sitemap',
                order: 5,
                anchors: [
                    {
                        key: 'general'
                    },
                    {
                        key: 'location'
                    },
                    {
                        key: 'visibility'
                    },
                    {
                        key: 'advanced',
                        accessor: () => {
                            return this.acl.hasModule('addressbook');
                        }
                    }
                ]
            },
            {
                key: 'fields',
                icon: 'keyboard',
                order: 10
            },
            {
                key: 'form',
                icon: 'file-spreadsheet',
                order: 15,
                anchors: [
                    {
                        key: 'type'
                    },
                    {
                        key: 'guests_of_guest'
                    },
                    {
                        key: 'representative'
                    },
                    {
                        key: 'recommendation'
                    },
                    {
                        key: 'form_fields'
                    },
                    {
                        key: 'registration_settings'
                    }
                ]
            },
            {
                key: 'landing',
                icon: 'browser',
                order: 20,
                anchors: [
                    {
                        key: 'website'
                    },
                    {
                        key: 'alerts'
                    }
                ]
            },
            {
                key: 'messages',
                icon: 'envelope',
                order: 25,
                anchors: [
                    {
                        key: 'templates'
                    },
                    {
                        key: 'email_settings'
                    }
                ]
            },
            {
                key: 'tickets',
                icon: 'ticket',
                order: 30,
                anchors: [
                    {
                        key: 'design'
                    },
                    {
                        key: 'ticket_settings'
                    }
                ]
            },
            {
                key: 'limitations',
                icon: 'exclamation-triangle',
                order: 35,
                anchors: [
                    {
                        key: 'open_reg',
                        accessor: () => {
                            return _.get(this.state, 'model.settings.enable_open_registration', false);
                        }
                    },
                    {
                        key: 'close_reg',
                        accessor: () => {
                            return _.get(this.state, 'model.settings.enable_code_registration', false);
                        }
                    },
                    {
                        key: 'field_limits'
                    }
                ]
            }
        ];

        viewsToPerform.sort((a, b) => {
            return a.order - b.order;
        });

        const tabsToSet = [];

        _.each(viewsToPerform, (tabInformation) => {
            tabsToSet.push({
                label: this.translate.instant(`guestlists.editor.navigation.${tabInformation.key}.label`),
                active: (this.state.currentView === tabInformation.key),
                icon: tabInformation.icon,
                action: () => this._updateView(tabInformation.key),
                subItems: (tabInformation.anchors && this.state.currentView === tabInformation.key) ? _.map(_.filter(tabInformation.anchors, (anchorInformation) => {
                    if (_.isUndefined(anchorInformation.accessor) || !_.isFunction(anchorInformation.accessor)) {
                        return true;
                    }

                    return anchorInformation.accessor();
                }), (anchorInformation) => {
                    return {
                        label: this.translate.instant(`guestlists.editor.navigation.${tabInformation.key}.subItems.${anchorInformation.key}`),
                        active: (this.state.currentView === tabInformation.key && this.state.currentAnchor === anchorInformation.key),
                        action: () => this._updateView(tabInformation.key, anchorInformation.key),
                    }
                }) : []
            });
        });

        this.navService.setSideNavCustoms(tabsToSet);
    }

    _updateView(newView, newAnchor) {
        this._updateState({
            ...this.state,
            currentView: newView,
            currentAnchor: newAnchor ? newAnchor : ''
        });

        if (newAnchor) {
            const $elemToScrollTo = jQuery('#' + newView + '_' + newAnchor);
            if ($elemToScrollTo.length > 0) {
                jQuery('html, body').animate({scrollTop: $elemToScrollTo.offset().top - 110}, 200);
            } else {
                this.injector.get('$timeout')(() => {
                    const $elemToScrollTo = jQuery('#' + newView + '_' + newAnchor);
                    if ($elemToScrollTo) {
                        jQuery('html, body').animate({scrollTop: $elemToScrollTo.offset().top - 110}, 200);
                    }
                }, 0);
            }
        }
        this._updateTabs();
    }

    static _cleanUpCustomFieldDefinition(definition) {
        const allowedFields = [
            'name',
            'type'
        ];

        switch (definition.type) {
            case 'select':
            case 'color_code_select':
                allowedFields.push('enum');
                break;
        }

        return _.pick(definition, allowedFields);
    }
}

AlGuestlistEditorComponentController.$inject = [
    '$injector',
    '$scope'
];
