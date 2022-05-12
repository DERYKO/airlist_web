/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.seatplans')
    .controller('SeatplansCreateCtrl', [
        'Error',
        'Seatplan',
        'SeatplanGroup',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        'NavService',
        SeatplansCreateCtrl
    ]);

function SeatplansCreateCtrl(Error, Seatplan, SeatplanGroup, $stateParams, $state, locale, SweetAlert,NavService) {

    var vm = this;
    vm.model = {};
    vm.groups = [];
    vm.headline = 'Create new Seatplan';
    vm.currentView = 'general';

    vm.save = save;
    vm.cancel = cancel;
    vm.addGroup = addGroup;
    vm.removeGroup = removeGroup;

    init();

    function init() {
        setupEditor();
        _updateCustomActions();
    }

    function _updateCustomActions() {
        let customs = [
            {
                label: 'General',
                active: (vm.currentView === 'general'),
                icon: 'sitemap',
                order: 5,
                action: function () {
                    _changeView('general');
                }
            },
            {
                label: 'Groups',
                active: (vm.currentView === 'groups'),
                icon: 'sitemap',
                order: 10,
                action: function () {
                    _changeView('groups');
                }
            },
            {
                label: 'Custom Fields',
                active: (vm.currentView === 'custom_fields'),
                icon: 'sitemap',
                order: 15,
                action: function () {
                    _changeView('custom_fields');
                }
            }
        ];

        customs.sort(function (a, b) {
            return a.order - b.order;
        });

        NavService.setSideNavCustoms(customs);
    }

    function _changeView(view) {
        vm.currentView = view;
        _updateCustomActions();
    }

    function setupEditor() {
        locale.ready(['seatplans']).then(function () {
            vm.headline = locale.getString('seatplans.seatplans.states.create.title');
            Seatplan.getSchema().then(function (schema) {
                vm.schema = schema;
            });
        });
    }

    function save(model) {
        Seatplan.post(model).then(function (createdSeatplan) {
            vm.model = createdSeatplan;
            var eventToDoAfter = null;
            for (var i = 0; i < vm.groups.length; i++) {
                var curGroup = vm.groups[i];

                if (curGroup.id) {
                    console.log('create group');
                    if (eventToDoAfter) {
                        eventToDoAfter = eventToDoAfter.then(function () {
                            return SeatplanGroup.save(curGroup);
                        });
                    } else {
                        eventToDoAfter = SeatplanGroup.save(curGroup);
                    }
                } else {
                    console.log('save edited group');
                    if (eventToDoAfter) {
                        eventToDoAfter = eventToDoAfter.then(function () {
                            return createdSeatplan.post('groups', curGroup);
                        });
                    } else {
                        eventToDoAfter = createdSeatplan.post('groups', curGroup);
                    }
                }
            }

            if (eventToDoAfter) {
                eventToDoAfter.then(function () {
                    SweetAlert.swal(locale.getString('seatplans.seatplans.messages.created'), locale.getString('seatplans.seatplans.messages.created_message'), 'success');
                    cancel();
                });
            } else {
                SweetAlert.swal(locale.getString('seatplans.seatplans.messages.created'), locale.getString('seatplans.seatplans.messages.created_message'), 'success');
                cancel();
            }
        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancel() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.seatplans.index');
    }

    function addGroup() {
        vm.groups.push({
            "title": locale.getString('seatplans.seatplans.defaults.group_name')
        });
    }

    function removeGroup(group) {
        var indexToDelete = vm.groups.indexOf(group);

        if (indexToDelete > -1) {
            vm.groups.splice(indexToDelete, 1);
        }
    }
}