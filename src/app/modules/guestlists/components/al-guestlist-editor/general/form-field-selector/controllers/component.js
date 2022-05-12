import fieldSettingsModalTemplate from '../views/definition-modal.tpl.html';
import customFieldDefintionModalTemplate from '../views/customfield-modal.tpl.html';
import AlGuestlistFormFieldDefinitionModalController from './definition-modal';
import AlGuestlistFormFieldCustomFieldModalController from './custom-field-modal';

export default class AlGuestlistFormFieldSelectorComponentController {

    constructor($scope, $injector) {
        this.scope = $scope;
        this.injector = $injector;
        this.translate = this.injector.get('$translate');
        this.api = this.injector.get('$http');
        this.log = this.injector.get('$log');
        this.filter = this.injector.get('$filter');
        this.guestlistActionService = this.injector.get('GuestlistActionService');
        this.modal = this.injector.get('$uibModal');

        this._reset();
        this._initWatchers();
    }

    // Public methods
    changeCurrentFilter(filter) {
        this.currentFilter = filter.key;
        this.selectableFieldsSearch = '';
        this._updateSelectableFields();
    }

    handleFieldGroupToggle(groupKey) {
        const newGroupMode = !!_.get(this.selectedGroupsInputModels, groupKey);
        _.each(this.availableFields, (field, fieldSlug) => {
            if (field.group === groupKey) {
                if (this.selectedFieldsInputModels[fieldSlug] !== newGroupMode) {
                    this.selectedFieldsInputModels[fieldSlug] = newGroupMode;
                    this.handleFieldToggle(fieldSlug);
                }
            }
        });
        this._triggerDefinitionUpdate();
    }

    handleFieldToggle(fieldSlug) {
        if (this.selectedFieldsInputModels[fieldSlug]) {
            this._addFieldToCurrentDefinition(fieldSlug);
        } else {
            this._removeFieldFromCurrentDefinition(fieldSlug);
        }

        this._checkWholeFieldGroupStates();
        this._triggerDefinitionUpdate();
    }

    getDefinitionFieldTypeReadable(item) {
        if (item.auto_fill && !item.locked) {
            return this.translate.instant('guestlists.editor.components.form-field-selector.apiSettingTypes.read_and_update');
        } else if (item.auto_fill) {
            return this.translate.instant('guestlists.editor.components.form-field-selector.apiSettingTypes.only_read');
        } else if (!item.locked) {
            return this.translate.instant('guestlists.editor.components.form-field-selector.apiSettingTypes.only_update');
        } else {
            return this.translate.instant('guestlists.editor.components.form-field-selector.apiSettingTypes.no_action');
        }
    }

    openFieldSettings(field) {
        this.modal.open({
            templateUrl: fieldSettingsModalTemplate,
            controller: AlGuestlistFormFieldDefinitionModalController,
            controllerAs: 'vm',
            resolve: {
                fieldConfig: () => {
                    return this.availableFields[field.slug];
                },
                currentDefinition: () => {
                    return _.first(this.filter('filter')(this.internalDefintion, {slug: field.slug}, true));
                }
            }
        }).result.then((result) => {
            let definitionToReplace = _.first(this.filter('filter')(this.internalDefintion, {slug: field.slug}, true)),
                indexToReplace = this.internalDefintion.indexOf(definitionToReplace);

            if (indexToReplace !== -1) {
                this.internalDefintion[indexToReplace] = result;
            }
        }, () => {

        });
    }

    changeCustomFieldDefinition(field) {
        if (!field.isCustomField) {
            this.log.info('Selected field is no custom field: ' + field.key);
            return;
        }

        this._openCustomFieldModal(this.customFieldDefinitions.definitions[field.customFieldInformation.group][field.customFieldInformation.number]).then((customFieldResult) => {
            switch (customFieldResult.action) {
                case 'save':
                    this._triggerCustomFieldUpdate('update', field.customFieldInformation.group, customFieldResult.data, field.customFieldInformation.number);
                    break;
                case 'delete':
                    this._triggerCustomFieldUpdate('delete', field.customFieldInformation.group, customFieldResult.data, field.customFieldInformation.number);
                    break;
                default:
                    this.log.info('Invalid action given from custom-field modal: ' + customFieldResult.action);
                    break;
            }
        }, () => {

        });
    }

    addNewCustomField() {
        this._openCustomFieldModal({
            name: this.newCustomFieldName
        }, true).then((customFieldResult) => {
            if (customFieldResult.action === 'save') {
                this._triggerCustomFieldUpdate('add', customFieldResult.data.group, customFieldResult.data);
            } else {
                this.log.info('Invalid action given from custom-field modal: ' + customFieldResult.action);
            }

            this.selectableFieldsSearch = customFieldResult.data.name;
            this.newCustomFieldName = '';
            this.scope.$applyAsync();
        }, () => {

        });
    }

    // Internal methods
    _openCustomFieldModal(currentDefinition, notExists) {
        return this.modal.open({
            templateUrl: customFieldDefintionModalTemplate,
            controller: AlGuestlistFormFieldCustomFieldModalController,
            controllerAs: 'vm',
            resolve: {
                currentDefinition: () => {
                    return currentDefinition;
                },
                alreadyExists: () => {
                    return !notExists;
                },
                fieldAvailabilities: () => {
                    return this.customFieldDefinitions.availability;
                }
            }
        }).result;
    }

    _triggerCustomFieldUpdate(action, fieldGroup, fieldDefinition, fieldNumber) {
        this.onCustomFieldChange({
            action,
            group: fieldGroup,
            definition: fieldDefinition,
            number: fieldNumber
        });
    }

    _addFieldToCurrentDefinition(fieldSlug) {
        this._removeFieldFromCurrentDefinition(fieldSlug);
        const fieldToAdd = _.cloneDeep(this.availableFields[fieldSlug]);

        this.internalDefintion.push({
            slug: fieldSlug,
            label: fieldToAdd.default_label,
            description: '',
            required: false,
            auto_fill: true,
            locked: false,
            unique: false,
            unique_count: 1
        })
    }

    _removeFieldFromCurrentDefinition(fieldSlug) {
        if (this.internalDefintion) {
            const itemToRemove = _.first(this.filter('filter')(this.internalDefintion, {slug: fieldSlug}, true)),
                indexToRemove = this.internalDefintion.indexOf(itemToRemove);

            if (indexToRemove !== -1) {
                this.internalDefintion.splice(indexToRemove, 1);
            }
        }
    }

    _reset() {
        this.currentFilter = '';
        this.availableFilters = [];
        this.selectableFields = {};
        this.currentDefinition = [];
        this.internalDefinition = {};

        this.internalDefintion = [];

        this.customFieldDefinitions = {};
        this.availableFields = {};
        this.selectedFields = [];
        this.selectableFieldsSearch = '';
        this.selectedFieldsSearch = '';

        this.selectedFieldsInputModels = {};
        this.selectedGroupsInputModels = {};
        this.newCustomFieldName = '';
    }

    _updateSelectableFields() {
        this.selectableFields = {};
        const customFieldRegex = /^(rsvp|contact)\.custom_([0-9]{1,2})$/;

        const curFilter = _.first(_.filter(this.availableFilters, (filter) => {
            return filter.key === this.currentFilter;
        }));

        _.each(this.availableFields, (field, fieldSlug) => {
            if (!curFilter
                || !(
                    curFilter.type === 'all'
                    || (curFilter.type === 'all_configured' && this.filter('filter')(this.internalDefintion, {slug: fieldSlug}).length > 0)
                    || (curFilter.type === 'group' && field.group === curFilter.extended.groupKey)
                )
            ) {
                return;
            }

            if (_.isUndefined(this.selectableFields[field.group])) {
                this.selectableFields[field.group] = {
                    key: field.group,
                    label: this.translate.instant(`guestlists.editor.components.form-field-selector.fieldGroups.${field.group}`),
                    fields: []
                }
            }

            const newField = {
                slug: fieldSlug,
                isCustomField: customFieldRegex.test(fieldSlug),
                enabledInMain: (this.globalSelectedFields && this.globalSelectedFields.indexOf(fieldSlug) !== -1),
                label: field.default_label
            };

            if (newField.isCustomField) {
                const regexParts = customFieldRegex.exec(fieldSlug);

                newField.customFieldInformation = {
                    group: regexParts[1],
                    number: regexParts[2]
                }
            }

            this.selectableFields[field.group].fields.push(newField);
            this.selectableFields[field.group].fields = this.filter('filter')(_.sortBy(this.selectableFields[field.group].fields, [field => field.label.toLowerCase()]), this.selectableFieldsSearch);

            if (_.isEmpty(this.selectableFields[field.group].fields)) {
                delete this.selectableFields[field.group];
            }
        });

        this.selectableFields = _.sortBy(this.selectableFields, ['label']);

        this._initFilters();
    }

    _initFromAvailableFields() {
        this._initFilters();
        this._updateSelectableFields();
        this._initCheckboxModels();

        this._updateCurrentStateByCurrentDefinition();
    }

    _initFilters() {
        this.availableFilters = [
            {
                key: 'all_configured',
                label: this.translate.instant('guestlists.editor.components.form-field-selector.filters.all_configured'),
                type: 'all_configured'
            },
            {
                key: 'all',
                label: this.translate.instant('guestlists.editor.components.form-field-selector.filters.all'),
                type: 'all'
            }
        ];

        const availableFieldGroups = [];
        let customFilters = [];

        _.each(this.availableFields, (field) => {
            if (availableFieldGroups.indexOf(field.group) === -1) {
                availableFieldGroups.push(field.group);
            }
        });

        _.each(availableFieldGroups, (group) => {
            customFilters.push({
                key: `group_${group}`,
                label: this.translate.instant(`guestlists.editor.components.form-field-selector.fieldGroups.${group}`),
                type: 'group',
                extended: {
                    groupKey: group
                }
            })
        });

        customFilters = _.sortBy(customFilters, ['label']);

        this.availableFilters = this.availableFilters.concat(customFilters);

        let currentFilterValid = false;

        _.each(this.availableFilters, (filter) => {
            if (filter.key === this.currentFilter) {
                currentFilterValid = true;
            }
        });

        if (!currentFilterValid) {
            this.currentFilter = 'all';
        }
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.availableFields;
        }, () => {
            this._initFromAvailableFields();
        });
        this.scope.$watch(() => {
            return this.globalSelectedFields;
        }, () => {
            this._updateSelectableFields();
        });

        this.scope.$watch(() => {
            return this.selectableFieldsSearch;
        }, () => {
            if (this.selectableFieldsSearch) {
                this.currentFilter = 'all';
            }
            this._updateSelectableFields();
        });

        this.scope.$watch(() => {
            return this.currentDefinition;
        }, (newVal, oldVal) => {
            this.internalDefintion = _.cloneDeep(this.currentDefinition);
            this._updateCurrentStateByCurrentDefinition();
        }, true);

        this.scope.$watch(() => {
            return this.internalDefintion;
        }, (newVal, oldVal) => {
            if (!_.isEqual(newVal, oldVal) && this.onDefinitionUpdate) {
                this._triggerDefinitionUpdate();
            }
        }, true);
    }

    _triggerDefinitionUpdate() {
        this._updateCurrentStateByCurrentDefinition();
        this.onDefinitionUpdate({
            newDefinition: this.internalDefintion
        });

        const $draggableContainer = jQuery(`#${this.idPrefix}draggable`);

        if ($draggableContainer.length > 0) {
            $draggableContainer.sortable('refresh');
        }
    }

    _updateCurrentStateByCurrentDefinition() {
        if (this.internalDefintion && Object.keys(this.availableFields).length > 0) {
            _.each(this.availableFields, (field, fieldSlug) => {
                this.selectedFieldsInputModels[fieldSlug] = (this.injector.get('$filter')('filter')(this.internalDefintion, {slug: fieldSlug}, true).length > 0);
            });

            this._checkWholeFieldGroupStates();
        }
    }

    _checkWholeFieldGroupStates() {
        const groupInactiveFields = {};
        _.each(this.availableFields, (fieldInfo, fieldSlug) => {
            if (!_.has(groupInactiveFields, fieldInfo.group)) {
                groupInactiveFields[fieldInfo.group] = false;
            }

            if (!this.selectedFieldsInputModels[fieldSlug]) {
                groupInactiveFields[fieldInfo.group] = true;
            }
        });

        _.each(groupInactiveFields, (value, group) => {
            this.selectedGroupsInputModels[group] = !value;
        });
    }

    _initCheckboxModels() {
        _.each(this.availableFields, (fieldInfo, fieldSlug) => {
            this.selectedFieldsInputModels[fieldSlug] = false;
            this.selectedGroupsInputModels[fieldInfo.group] = false;
        })
    }
}

AlGuestlistFormFieldSelectorComponentController.$inject = [
    '$scope',
    '$injector'
];
