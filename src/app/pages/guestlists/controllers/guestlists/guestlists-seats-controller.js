/**
 * @ngdoc object
 * @name guestlists.controller:GuestlistsSeatsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .controller('GuestlistsSeatsCtrl', [
        '$scope',
        'Guestlist',
        'locale',
        '$stateParams',
        'Rsvp',
        'SweetAlert',
        'Seatplan',
        '$uibModal',
        GuestlistsSeatsCtrl
    ]);

function GuestlistsSeatsCtrl($scope, Guestlist, locale, $stateParams, Rsvp, SweetAlert, Seatplan, $uibModal) {
    var vm = this;

    vm.activateGroup = activateGroup;
    vm.handleSeatplanSelectionChange = handleSeatplanSelectionChange;
    vm.handleSeatplanClick = handleSeatplanClick;
    vm.handleSeatplanDblClick = handleSeatplanDblClick;
    vm.handleSeatplanUnSelectable = handleSeatplanUnSelectable;
    vm.openDoBookingModal = openDoBookingModal;

    function init() {
        vm.loading = true;
        vm.seatplan = {};
        vm.bookingInformation = {};
        vm.blockedSeatplanElements = [];
        vm.guestlist = {};
        vm.currentGroupId = 0;
        vm.selected = {
            ids: [],
            objects: []
        };
        Guestlist.one($stateParams.gid).get({include: 'seatplan,blockedSeatplanElements'}).then(function (record) {
            vm.guestlist = record;
            var oldGroupId = vm.currentGroupId;

            _.forEach(vm.guestlist.blockedSeatplanElements.data, function (val) {
                vm.blockedSeatplanElements.push(val.id);
            });

            Rsvp.setGuestlist(vm.guestlist).getList().then(function (rsvpsList) {
                _.forEach(rsvpsList, function (rsvp, key) {
                    if (rsvp.seatplan_elements) {
                        _.forEach(rsvp.seatplan_elements, function (seatplan_booking) {
                            vm.bookingInformation[seatplan_booking.seatplan_element_id] = {
                                rsvp: rsvp,
                                rsvp_element: seatplan_booking
                            };
                        });
                    }
                });

                vm.seatplan = Seatplan.one(vm.guestlist.seatplan_id).get({include: 'groups'}).then(function (data) {
                    vm.seatplan = data;
                    vm.loading = false;

                    if (!oldGroupId) {
                        vm.currentGroupId = vm.seatplan.groups.data[0].id;
                    } else {
                        vm.currentGroupId = oldGroupId;
                    }
                }, function () {
                    SweetAlert.swal('Error', 'Seatplan can not be loaded', 'error');
                });
            });

            return record;
        }, function () {
            SweetAlert.swal(locale.getString('guestlists.guestlist_not_found'), locale.getString('guestlists.guestlist_not_found_message'), 'error');
        });
    }

    function handleSeatplanClick(e, clickedElement) {
        console.log('seatplan click', clickedElement);
    }

    function handleSeatplanDblClick(e, clickedElement) {
        vm.handleSeatplanSelectionChange(clickedElement, true);
        vm.openDoBookingModal();
    }

    function handleSeatplanSelectionChange(triggeredElement, selectionState) {
        $scope.$apply(function () {
            if (selectionState) {
                vm.selected.objects.push(triggeredElement);
                vm.selected.ids.push(triggeredElement.id);
            } else {
                var indexToSplice = -1;
                for (var i = 0; i < vm.selected.objects.length; i++) {
                    var curElem = vm.selected.objects[i];
                    if (curElem.id == triggeredElement.id) {
                        indexToSplice = i;
                        break;
                    }
                }

                if (indexToSplice > -1) {
                    vm.selected.ids.splice(indexToSplice, 1);
                    vm.selected.objects.splice(indexToSplice, 1);
                }
            }
        });

        console.log(vm.selected);
    }

    function handleSeatplanUnSelectable(clickedElement) {
        console.log('seatplan un selectable', clickedElement);
    }

    function activateGroup(group) {
        vm.currentGroupId = group.id;
    }

    function openDoBookingModal() {
        var bookingModalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'doBookingModal.html',
            size: 'lg',
            controller: function (Contact) {
                var modalVm = this;

                modalVm.saveRsvp = saveRsvp;
                modalVm.selected = vm.selected.objects;
                modalVm.seatplan = vm.seatplan;
                modalVm.config = {
                    contact: {
                        model: Contact,
                        settings: {}
                    }
                };
                modalVm.rsvp = {
                    guestlist_id: vm.guestlist.id,
                    seatplan_elements: {}
                };

                for (var i = 0; i < modalVm.selected.length; i++) {
                    var currentElement = modalVm.selected[i];
                    modalVm.rsvp.seatplan_elements[currentElement.id] = {
                        id: currentElement.id
                    }
                }

                function saveRsvp(rsvp) {
                    Rsvp.setGuestlist(vm.guestlist).post(rsvp).then(function () {
                        bookingModalInstance.close();
                        init();
                        SweetAlert.swal('success', 'rsvp created', 'success');
                    }, function () {

                    });
                }
            },
            controllerAs: 'vm'
        });
    }

    init();
}