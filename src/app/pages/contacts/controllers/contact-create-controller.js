/**
 * @ngdoc object
 * @name contacts.controller:ContactsCtrl
 *
 * @description
 *
 */

class ContactCreateCtrl {
    constructor(Alert, Contact, $http, locale, NavService, ResourceCommon, $state, $stateParams, Deposit, $rootScope) {

        this.model = {
            country: 'DE',
            business_country: 'DE',
            language: 'DE',
            sex: 'unknown'
        };
        this.depositService = Deposit;

        this.deposits = {
            countries: {},
            languages: {},
            genders: {}
        };

        Contact.getSchema().then(schema => {
            this.schema = schema;
            _(this.schema.properties)
                .pickBy({type: 'boolean'})
                .map((prop, key) => {
                    this.model[key] = 0;
                })
                .value();
            this.model.addressbook = 1;
            this.model.business_preferred = false;
        });
        this.store = $stateParams.store;

        this.locale = locale;
        this.api = $http;
        this.uploader = ResourceCommon.uploadImage;
        this.alert = Alert;
        this.navigator = NavService;
        this.rootScope = $rootScope;

        this.editView = _.get(this.rootScope.user, 'settings.use_light_version') ? 'light' : 'full';

        this.setToolbarActions(NavService, $stateParams, $state);
        this._loadDeposits();
    }

    _loadDeposits() {
        this.depositService.getRemoteDeposit('contacts', 'countries', []).then((value) => {
            this.deposits.countries = value;
        });
        this.depositService.getRemoteDeposit('contacts', 'languages', []).then((value) => {
            this.deposits.languages = value;
        });
        this.depositService.getRemoteDeposit('contacts', 'genders', []).then((value) => {
            this.deposits.genders = value;
        });
    }


    setToolbarActions(NavService, $stateParams, $state) {
        NavService.setGoBackAction(() => {
            const params = $stateParams.backParams || {};
            params.model = this.model;
            params.store = this.store;
            console.log($stateParams.back);
            $state.go($stateParams.back, params)
        })
    }

    save(model) {
        this.locale.ready('sweetalerts').then(() => {
            this.api.post('contacts', this.prepareModelForApi(model))
                .then(response => {
                    this.model = response.data.data;

                    this.alert.success(this.locale.getString('sweetalerts.records_saved'), this.locale.getString('sweetalerts.records_saved_message'));
                    this.cancel();
                }, response => {
                    this.alert.handle(response);
                });
        });
    }

    prepareModelForApi(model) {
        const out = _.cloneDeep(model);

        for (let i = 1; i <= 40; i++) {
            const currentField = _.get(this.schema.properties, 'custom_' + i, null);
            if (currentField) {
                if ((currentField.original.type === 'date' || currentField.original.type === 'datetime') && !_.get(out, 'custom_' + i)) {
                    out['custom_' + i] = null;
                }
            }
        }

        return out;
    }

    cancel() {
        return this.navigator.goBack();
    }
}


angular
    .module('airlst.contacts')
    .controller('ContactCreateCtrl', [
        'Alert',
        'Contact',
        '$http',
        'locale',
        'NavService',
        'ResourceCommon',
        '$state',
        '$stateParams',
        'Deposit',
        '$rootScope',
        ContactCreateCtrl
    ]);
