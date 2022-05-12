/**
 * @ngdoc object
 * @name guestlists.controller:GuestlistsCreateCtrl
 *
 * @description
 *
 */

angular
    .module('airlst.guestlists')
    .controller('GuestlistsCreateCtrl', [
        'Error',
        'Contact',
        'Categories',
        'Templates',
        'Guestlist',
        'ResourceCommon',
        'Rsvp',
        'SelectBox',
        '$state',
        '$stateParams',
        'SweetAlert',
        'User',
        '$log',
        '$q',
        'Seatplans',
        '$scope',
        'SeatplanElements',
        'Users',
        'Deposit',
        'Acl',
        '$http',
        'GuestlistActionService',
        GuestlistsCreateCtrl
    ]);

function GuestlistsCreateCtrl(Error, Contact, Categories, Templates, Guestlist, ResourceCommon, Rsvp, SelectBox, $state,
                              $stateParams, SweetAlert, User, $log, $q, Seatplans, $scope, SeatplanElements, Users,
                              Deposit, Acl, $http, GuestlistActionService) {
    const vm = this;
    vm.acl = Acl;
    vm.save = saveGuestlist;
    vm.updatePermissions = updatePermissions;
    vm.addUsers = addUsers;
    vm.removeUser = removeUser;
    vm.toggleStatusFlowSelection = toggleStatusFlowSelection;
    vm.isAdmin = true;

    vm.model = {
        code_invited: false,
        code_waitlist: false,
        open_waitlist: false,
        use_contact_code: false,
        auto_send: false,
        ask_password: false,
        unique_emails: false,
        add_to_contacts: false,
        update_contact: false,
        add_category_to_contact: false,
        pax_required: false,
        auto_fill: false,
        send_confirmation: false,
        send_cancellation: false,
        send_request_email: false,
        send_email_only_to_parent: false,
        send_waitlist_email: false,
        use_payments: false,
        attach_invoice: false,
        users: [],
        fields: [],
        fields_guest: [],
        permission: 'public',
        seatplan_id: null,
        test: true,
        remove_not_provided_guest_rsvps: true,
        settings: {}
    };

    vm.config = {
        availableFields: [],
        statesForSelectize: []
    };
    vm.availableFields = [];

    vm.headline = 'Create new guestlist';

    vm.expandedFields = {
        fields: [],
        custom_rsvps: [],
        guest_fields: []
    };
    vm.deposits = {
        rsvp_states: [],
        main_rsvp_message_send_flows: [],
        sub_rsvp_message_send_flows: [],
        message_ticket_flows: []
    };

    setupEditor();

    function setupEditor() {
        $http.get('guestlists/defaults/settings').then((response) => {
            vm.model.settings = response.data.data;
        });
        Deposit.getRemoteDeposit('rsvps', 'states', []).then((value) => {
            vm.deposits.rsvp_states = value;

            vm.config.statesForSelectize = [];
            _.each(value, (v, k) => {
                vm.config.statesForSelectize.push({
                    value: k,
                    label: v
                })
            })
        });

        Deposit.getRemoteDeposit('guestlists', 'settings', {
            main_rsvp_send_flows: {},
            sub_rsvp_send_flows: {},
            messages_ticket_flows: {}
        }).then((value) => {
            vm.deposits.main_rsvp_message_send_flows = [];
            vm.deposits.sub_rsvp_message_send_flows = [];
            vm.deposits.message_ticket_flows = [];

            _.each(value.main_rsvp_send_flows, (v, k) => {
                vm.deposits.main_rsvp_message_send_flows.push({
                    value: k,
                    label: v
                });
            });

            _.each(value.sub_rsvp_send_flows, (v, k) => {
                vm.deposits.sub_rsvp_message_send_flows.push({
                    value: k,
                    label: v
                });
            });

            _.each(value.messages_ticket_flows, (v, k) => {
                vm.deposits.message_ticket_flows.push({
                    value: k,
                    label: v
                });
            });

            $scope.$applyAsync();
        });

        Contact.getSchema().then(function (schema) {
            let fields = {};
            _.each(schema.properties, function (value, key) {
                fields['contact.' + key] = value;
            });

            Rsvp.setGuestlist(vm.model).getSchema().then(function (schema) {
                _.each(schema.properties, function (value, key) {
                    if (!fields['contact.' + key]) {
                        fields['rsvp.' + key] = value;
                    } else if (_.startsWith(key, 'custom_') && vm.model[key + '_name']) {
                        fields['rsvp.' + key] = value;
                    }
                });

                vm.config.positions = {
                    type: 'array',
                    items: [
                        {
                            key: 'key',
                            type: 'textbox',
                            title: 'Key'
                        },
                        {
                            key: 'description',
                            type: 'textbox',
                            title: 'Description'
                        },
                        {
                            key: 'unit_cost',
                            type: 'textbox',
                            title: 'Unit Cost'
                        },
                        {
                            key: 'optional',
                            type: 'boolean',
                            default: false,
                            title: 'Optional'
                        },
                        {
                            key: 'tax_rate',
                            type: 'textbox',
                            title: 'Tax Rate'
                        }
                    ]
                };


                vm.config.customs = {
                    range: _.range(1, 41)
                };
            });

            GuestlistActionService.getDefaultAvailableFieldsForGuestlist().then(function (fields) {
                vm.availableFields = fields;
                vm.config.availableFields = [];
                _.each(fields, (v, k) => {
                    vm.config.availableFields.push({
                        value: k,
                        label: v.default_label
                    });
                });
            });

        });

        vm.cSettings = _.get(Users, 'state.company.settings.guestlists');
    }

    function saveGuestlist(fields, form) {
        const dateFieldsToCheckTimezone = [
            'date',
            'settings.registration_start',
            'settings.registration_end'
        ];

        form.$submitted = true;
        fields = _.cloneDeep(fields);

        if (form.$valid) {
            _.each(dateFieldsToCheckTimezone, function(field) {
                let currentValue = _.get(fields, field, null);

                if(currentValue) {
                    _.set(fields, field, moment(currentValue, 'YYYY-M-D H:m').format());
                }
            });

            Guestlist.post(fields).then(function (response) {
                _goBackToList();
            }, function (response) {
                Error.checkError(response);
            });
        }
    }

    function updatePermissions(update, $index, permissions) {
        if (update) {
            _.forEach(permissions, function (perm) {
                vm.model.users[$index].permissions[perm] = true;
            });
        }
    }

    function addUsers() {
        SelectBox.single(Users.reset({
            persists: false,
            listname: 'GuestlistPermissionUserSelectList'
        }), {
            displayField: 'master_user.full_name'
        }).then(function (selectedUserData) {
            const present = _.filter(vm.model.users, function (o) {
                return o.user.id == selectedUserData.data;
            });

            if (present.length === 0) {
                User.get(selectedUserData.data).then((fullUser) => {
                    vm.model.users.push({
                        user: fullUser,
                        permissions: {read: 1, write: 0, delete: 0, admin: 0}
                    });
                });
            } else {
                SweetAlert.warning('User already exists in permissions list.');
            }
        });
    }

    function removeUser(userToDelete) {
        const indexToDelete = vm.model.users.indexOf(userToDelete);

        console.log(userToDelete);
        if (indexToDelete !== -1) {
            vm.model.users.splice(indexToDelete, 1);
        }
    }

    // New Implementations for wizard

    vm.steps = [
        {
            id: 'general',
            label: 'General',
            disabled: false,
            meta: {
                extended: false
            },
            index: 5
        },
        {
            id: 'limits',
            label: 'Set Limits',
            disabled: false,
            disableCheck: function () {
                return !vm.model.settings.enable_open_registration && !vm.model.settings.enable_code_registration && !vm.model.settings.enable_logged_in_registration;
            },
            index: 10
        },
        {
            id: 'fields',
            label: 'Choose Fields',
            disabled: false,
            index: 15
        },
        {
            id: 'messages',
            label: 'Configure Messages',
            disabled: false,
            index: 20
        },
        {
            id: 'landingpage',
            label: 'Configure Landingpage',
            disabled: false,
            disableCheck: function () {
                return !vm.model.settings.enable_open_registration && !vm.model.settings.enable_code_registration && !vm.model.settings.enable_logged_in_registration;
            },
            index: 25
        },
        {
            id: 'seatplan',
            label: 'Seatplan',
            disabled: false,
            disableCheck: function () {
                return !vm.model.enable_seatplan;
            },
            index: 25
        },
        {
            id: 'review',
            label: 'Review',
            disabled: false,
            index: 30
        }
    ];
    vm.currentStep = null;

    vm.schema = {};
    vm.selectBoxConfigs = {
        seatplans: {
            store: Seatplans,
            displayField: 'title',
            valueField: 'id'
        },
        blocked_seatplan_elements: {
            store: null,
            displayField: 'title',
            valueField: 'id'
        },
        categories: {
            store: Categories.reset({persist: false}),
            displayField: 'name',
            valueField: 'id',
            maxItems: 15
        },
        templates: {
            store: Templates.reset({persist: false}),
            displayField: 'name',
            valueField: 'id'
        }
    };

    vm.validateFormPart = false;

    vm.goToStep = goToStep;
    vm.previousStep = previousStep;
    vm.closeView = closeView;
    vm.nextStep = nextStep;
    vm.currentForm = currentForm;

    _init();

    // Internal Functions
    function _init() {
        _updateSteps();
        _initWatchers();

        Guestlist.schema.then(function (schema) {
            vm.schema = schema;
            _updateSteps();
        });
    }

    function _initWatchers() {
        $scope.$watch('vm.model.enable_seatplan', function (newValue) {
            _updateSteps();
        });
        $scope.$watch('vm.model.settings', function (newValue) {
            _updateSteps();
        }, true);
    }

    function _updateAvailableSeatplanElements() {
        let newStore = SeatplanElements,
            newConf = _.cloneDeep(vm.selectBoxConfigs.blocked_seatplan_elements);
        newStore.commit('setPermanentFilters', {'group.seatplan.id': vm.model.seatplan_id});
        newConf.store = newStore;
        vm.selectBoxConfigs.blocked_seatplan_elements = newConf;
    }

    function _updateSteps() {
        if (!vm.currentStep) {
            vm.currentStep = vm.steps[0];
        }

        let curStepIndex = 1;
        for (let i = 0; i < vm.steps.length; i++) {
            let curStep = vm.steps[i];

            curStep.current = (curStep.id === vm.currentStep.id);
            curStep.completed = (curStep.index < vm.currentStep.index);

            if (typeof curStep.disableCheck !== 'undefined') {
                curStep.disabled = curStep.disableCheck();
            } else {
                curStep.disabled = false;
            }

            if (!curStep.disabled) {
                curStep.index = curStepIndex++;
            }

            vm.steps[i] = curStep;
        }
    }

    function _goBackToList() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.guestlists.index', {store: $stateParams.store});
    }

    // Functions to map to vm
    function goToStep(newStep) {
        if (!newStep.disabled) {
            vm.currentStep = newStep;
        }
        _updateSteps();
    }

    function _moveBy(step, direction) {
        var newStepIndex = vm.steps.indexOf(step) + direction;
        var newStep = vm.steps[newStepIndex];
        if (!newStep.disabled) {
            vm.currentStep = newStep;
        } else {
            _moveBy(newStep, direction);
        }

        _updateSteps();
    }

    function previousStep() {
        _moveBy(vm.currentStep, -1);
    }

    function nextStep() {
        var form = currentForm();
        if (form.$valid) {
            _moveBy(vm.currentStep, +1);
            vm.validateFormPart = false;
        } else {
            vm.validateFormPart = true;
        }
        return form.$valid;
    }

    function currentForm() {
        return $scope.$eval('guestlistForm.formPart_' + vm.currentStep.id);
    }

    function closeView() {
        $state.go('app.guestlists.index');
    }

    function toggleStatusFlowSelection(toggleState, arrayOfData) {
        const index = arrayOfData.indexOf(toggleState);

        if (index > -1) {
            arrayOfData.splice(index, 1);
        } else {
            arrayOfData.push(toggleState);
        }
    }
}
