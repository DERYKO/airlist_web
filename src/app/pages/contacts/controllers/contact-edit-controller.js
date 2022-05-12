import contactModelReducer from '../helpers/contact-model-reducer.js';

/**
 * @ngdoc object
 * @name contacts.controller:ContactEditCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .controller('ContactEditCtrl', [
        'Alert',
        'Contact',
        'ResourceCommon',
        '$state',
        '$stateParams',
        '$q',
        'NavService',
        'Workflows',
        'Deposit',
        '$rootScope',
        'Users',
        ContactEditCtrl
    ]);

function ContactEditCtrl(Alert, Contact, ResourceCommon, $state, $stateParams, $q, NavService, Workflows, Deposit, $rootScope, Users) {
    const vm = this;
    vm.save = save;
    vm.cancel = cancelEditing;

    vm.deposits = {
        countries: {},
        languages: {},
        genders: {}
    };
    vm.editView = '';

    init();

    function init() {
        setupEditor();
        loadContact();
        _loadDeposits();
        NavService.setGoBackAction(cancelEditing);
        vm.store = $stateParams.store;
        vm.editView = _.get($rootScope.user, 'settings.core.use_light_version') ? 'light' : 'full';
    }

    function _loadDeposits() {
        Deposit.getRemoteDeposit('contacts', 'countries', []).then(function (value) {
            vm.deposits.countries = value;
        });
        Deposit.getRemoteDeposit('contacts', 'languages', []).then(function (value) {
            vm.deposits.languages = value;
        });
        Deposit.getRemoteDeposit('contacts', 'genders', []).then(function (value) {
            vm.deposits.genders = value;
        });
    }

    function loadContact() {
        if ($stateParams.contact) {
            vm.model = contactModelReducer(_.clone($stateParams.contact), Users.state.company);
            _updateBreadcrumb();
            // setMainActions();

        } else {
            vm.model = Contact.one($stateParams.id).get().then(function (contact) {
                vm.model = contactModelReducer(contact, Users.state.company);
                _updateBreadcrumb();
                // setMainActions();
                return contact;
            });
        }
    }

    function _updateBreadcrumb() {
        NavService.setBreadcrumbParameters({
            contact_full_name: (vm.model) ? vm.model.full_name : ''
        });

        NavService.setStateParameters('app.contacts.details', {
            id: (vm.model) ? vm.model.id : null,
            contact: (vm.model) ? vm.model : null
        });
    }

    function setMainActions() {
        const actions = _(Workflows.getWorkflows('contact::edit'))
            .filter(workflow => {
                return vm.model.archived ? workflow.level === 'archived-highlight' : workflow.level === 'highlight';
            })
            .map(workflow => {
                if (!workflow.onClick) {
                    workflow.onClick = workflow.action;
                }
                workflow.action = () => {
                    workflow.onClick(vm.model, vm);
                };
                workflow.order = workflow.order || 30;
                return workflow;
            })
            .sortBy('order', 'asc')
            .value();

        NavService.overrideMainSideNavActions(actions);
    }

    function setupEditor() {
        Contact.getSchema().then(function (schema) {
            vm.schema = schema;
        });
    }

    function save() {
        return Contact.one(vm.model.id).customPUT(prepareModelForApi()).then(contact => {
            let deferred = $q.resolve(contact);

            vm.model = contact;
            return deferred.then(contact => {
                if (vm.store) {
                    vm.store.dispatch('getData');
                }

                const params = $stateParams.backParams ? _.cloneDeep($stateParams.backParams) : {};
                if (vm.store) {
                    params.store = vm.store;
                }
                params.contact = contact;
                params.id = contact.id;
                Alert.success('Success', 'changes have been saved successful');
                cancelEditing();
            });
        }, response => Alert.handle(response));
    }

    function cancelEditing() {
        const backParams = $stateParams.backParams || {};
        const params = {
            id: backParams.id || $stateParams.id,
            gid: backParams.gid,
            contact: $stateParams.contact,
            rsvp: backParams.rsvp,
            store: vm.store
        }
        $state.go($stateParams.back, params);
    }

    function prepareModelForApi() {
        const out = _.cloneDeep(vm.model);

        for (let i = 1; i <= 40; i++) {
            const currentField = _.get(vm.schema.properties, 'custom_' + i, null);
            if (currentField) {
                if ((currentField.original.type === 'date' || currentField.original.type === 'datetime') && !_.get(out, 'custom_' + i)) {
                    out['custom_' + i] = null;
                }
            }
        }

        return out;
    }
}
