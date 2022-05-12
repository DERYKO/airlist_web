class LimitsController {

    constructor($stateParams, $http, growl, NavService, $q, $filter, $state, Alert, $scope, Deposit) {
        this.stateParams = $stateParams;
        this.http = $http;
        this.growl = growl;
        this.navService = NavService;
        this.queue = $q;
        this.filter = $filter;
        this.state = $state;
        this.lodash = _;
        this.alert = Alert;
        this.scope = $scope;
        this.deposit = Deposit;

        this.guestlist = null;
        this.editEnabled = false;
        this.originalGlLimits = null;
        this.loadingInformation = true;
        this.currentLimitInformation = [];
        this.currentSelectedAddField = null;
        this.addableFields = [];
        this.guestlistFields = {};
        this.statesForSelectize = [];

        this._loadInformation().finally(() => {
            this.loadingInformation = false;
        })
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

    saveLimits() {
        const dataToSend = _.cloneDeep(this.guestlist);

        dataToSend.settings.registration_limits = this._prepareLimitDataForSetting();

        this.http.put(`guestlists/${this.stateParams.gid}`, dataToSend).then(() => {
            this.disableEdit();
            this.growl.success('Limits saved', {title: 'Success'});
            this._loadInformation();
        }, () => {
            this.growl.error('Error while saving limits', {title: 'Error'});
        });
    }

    backToList() {
        this.state.go('app.guestlists.rsvps.index', {gid: this.guestlist.id});
    }

    enableEdit() {
        this.editEnabled = true;
    }

    disableEdit() {
        this.editEnabled = false;
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

        console.log(indexToRemove);
        if(indexToRemove !== -1) {
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
            if(indexToDelete !== -1) {
                this.currentLimitInformation.splice(indexToDelete, 1);
                this.scope.$applyAsync();
            }
        }, () => {

        });

    }

    /* Private functions */
    _loadInformation() {
        this.deposit.getRemoteDeposit('rsvps', 'states', []).then((value) => {
            this.statesForSelectize  =[];
            _.each(value, (v,k) => {
                this.statesForSelectize.push({
                    value: k,
                    label: v
                })
            })
        });
        return this.http.get(`guestlists/${this.stateParams.gid}`).then((response) => {
            this.guestlist = response.data.data;

            this.queue.all([
                this.http.get(`guestlists/${this.stateParams.gid}/limits`).then((response) => {
                    this.originalGlLimits = response.data.data;
                }, () => {
                    this.growl.error('Error while loading current limit information');
                }),
                this.http.get(`guestlists/${this.stateParams.gid}/fields`).then((response) => {
                    this.guestlistFields = response.data.data
                }, () => {
                    this.growl.error('Error while loading current limit information');
                })
            ]).then(() => {
                this.currentLimitInformation = this._readLimitsFromApi(this.originalGlLimits);
                this._updateAddableFields();
            });
            this._updateNavigation();
        }, () => {
            this.growl.error('Error while loading guestlist information');
        });
    }

    _updateNavigation() {
        this.navService.setBreadcrumbParameters({
            guestlist_name: this.guestlist.name
        });
        this.navService.setStateParameters('app.guestlists.rsvps.index', {
            gid: this.guestlist.id
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
        return out;
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

LimitsController.$inject = [
    '$stateParams',
    '$http',
    'growl',
    'NavService',
    '$q',
    '$filter',
    '$state',
    'Alert',
    '$scope',
    'Deposit'
];

/**
 * @ngdoc object
 * @name guestlists.controller:GuestlistsLimitsController
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .controller('GuestlistLimitsController', LimitsController);
