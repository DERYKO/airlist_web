export default class AlGuestlistLimitConfiguratorComponentController {

    constructor($scope, $injector) {
        this.scope = $scope;
        this.injector = $injector;
        this.translate = this.injector.get('$translate');
        this.api = this.injector.get('$http');
        this.alert = this.injector.get('Alert');
        this.filter = this.injector.get('$filter');
        this.queue = this.injector.get('$q');
        this.lodash = _;

        this.guestlist = null;
        this.editEnabled = false;
        this.originalGlLimits = null;
        this.currentLimitInformation = [];
        this.currentSelectedAddField = null;
        this.addableFields = [];
        this.guestlistFields = {};
        this.statesForSelectize = [];

        this._initWatchers();
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.guestlist;
        }, () => {
            if (this.guestlist) {
                this._loadInformation();
            }
        }, true);

        this.scope.$watch(() => {
            return this.currentLimits;
        }, () => {
            if (!_.isEqual(this.currentLimits, this.currentLimitInformation)) {
                this.currentLimitInformation = this.currentLimits;
            }
        }, true);

        this.scope.$watch(() => {
            return this.currentLimitInformation;
        }, () => {
            if (this.guestlist) {
                this._prepareLimitDataForSetting();
            }
        }, true);
    }

    addField(field) {
        const glField = _.get(this.guestlistFields, field);
        if (field && glField) {
            const newLimitEntry = {
                key: field,
                field: glField,
                limits: []
            };

            if (glField.enum) {
                _.each(glField.enum, (label, key) => {
                    newLimitEntry.limits.push({
                        value: key,
                        current: 0,
                        limit: -1
                    });
                });
            }

            this.currentLimitInformation.push(newLimitEntry);
        }
        this._updateAddableFields();
        this.currentSelectedAddField = null;
    }

    addEmptyValueToField(limitField) {
        limitField.limits.push({
            value: '',
            current: 0,
            limit: -1
        });
    }

    removeLimitValue(limitField, limitValue) {
        const indexToRemove = limitField.limits.indexOf(limitValue);

        if (indexToRemove !== -1) {
            limitField.limits.splice(indexToRemove, 1);
        }

        this.scope.$applyAsync();
    }

    checkIfValueEditEnabled(limitField) {
        return _.isUndefined(limitField.field.enum);
    }

    removeFieldLimits(group) {
        this.alert.confirm({
            title: 'Confirm',
            message: `Are you sure you want to delete the whole limit group?`,
            type: 'warning',
            confirmBtn: 'Delete',
            closeOnConfirm: true,
            wait: false
        }).then(() => {
            const indexToDelete = this.currentLimitInformation.indexOf(group);
            if (indexToDelete !== -1) {
                this.currentLimitInformation.splice(indexToDelete, 1);
                this.scope.$applyAsync();
            }
        }, () => {

        });

    }

    /* Private functions */
    _loadInformation() {
        this.queue.all([
            this.api.get(`guestlists/${this.guestlist.id}/limits`).then((response) => {
                this.originalGlLimits = response.data.data;
            }, () => {
                this.alert.error('Error while loading current limit information');
            }),
            this.api.get(`guestlists/${this.guestlist.id}/fields`).then((response) => {
                this.guestlistFields = response.data.data
            }, () => {
                this.alert.error('Error while loading current limit information');
            })
        ]).then(() => {
            this.currentLimitInformation = this._readLimitsFromApi(this.originalGlLimits);
            this._updateAddableFields();
        });
    }

    _prepareLimitDataForSetting() {
        const out = {};

        _.each(this.currentLimitInformation, (limitInformation) => {
            if (Object.keys(limitInformation.limits).length > 0) {
                out[limitInformation.key] = {};
                _.each(limitInformation.limits, (values) => {
                    out[limitInformation.key][values.value] = values.limit;
                });
            }
        });

        this.onLimitsUpdate({newValue: out});
    }

    _readLimitsFromApi(apiData) {
        let currentLimitInformation = [];
        _.each(apiData, (limits, field) => {
            const glField = _.get(this.guestlistFields, field),
                newLimitEntry = {
                    key: field,
                    field: glField,
                    limits: []
                };

            _.each(limits, (limitInformation, value) => {
                if (glField.enum && _.isUndefined(glField.enum[value])) {
                    return;
                }
                newLimitEntry.limits.push({
                    ...limitInformation,
                    value: value
                })
            });

            if (glField.enum) {
                _.each(glField.enum, (label, key) => {
                    if (this.filter('filter')(newLimitEntry.limits, {value: key}).length === 0) {
                        newLimitEntry.limits.push({
                            value: key,
                            current: 0,
                            limit: -1
                        });
                    }
                });
            }

            currentLimitInformation.push(newLimitEntry);
        });

        return currentLimitInformation;
    }

    _updateAddableFields() {
        this.addableFields = [];
        _.each(this.guestlistFields, (field, key) => {
            if (this.filter('filter')(this.currentLimitInformation, {key}).length === 0) {
                this.addableFields.push({
                    value: key,
                    label: field.label
                });
            }
        });
    }
}

AlGuestlistLimitConfiguratorComponentController.$inject = [
    '$scope',
    '$injector'
];
