import template from './billable_link-directive.tpl.html';
import rsvpDetailsTemplate from '../../../../guestlists/views/rsvps-details.tpl.html';

/**
 * @ngdoc directive
 * @name billing.position_links.directive:position_links
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <billable-link billable=""></billable_link>
 *
 */
angular
    .module('airlst.billing.position_links')
    .directive('billableLink', BillableLinkDirective);

function BillableLinkDirective() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: [
            '$state',
            '$scope',
            '$uibModal',
            'Rsvp',
            'SweetAlert',
            BillableLinkDirectiveController
        ],
        bindToController: {
            billable: '='
        }
    };
}

function BillableLinkDirectiveController($state, $scope, $uibModal, Rsvp, SweetAlert) {
    var vm = this;

    vm.label = '';
    vm.route = '';
    vm.route_params = '';
    vm.custom_action = null;

    vm.show = false;
    vm.doClickAction = doClickAction;

    init();

    function init() {
        updateBillableInformation();
        initWatchers();
    }

    function initWatchers() {
        $scope.$watch('vm.billable', function (newVal) {
            vm.billable = newVal;
            updateBillableInformation();
        });
    }

    function updateBillableInformation() {
        if (typeof vm.billable === 'undefined') {
            vm.label = '';
            vm.route = '';
            vm.route_params = {};
            vm.show = false;
            vm.custom_action = null;
            return;
        }

        switch (vm.billable.type) {
            case 'seatplan_element':
                vm.label = 'Seatplan Element ' + vm.billable.label + ' on guestlist ' + vm.billable.guestlist_name;
                vm.route = 'app.guestlists.rsvps.seatsRsvp';
                vm.route_params = {
                    gid: vm.billable.guestlist_id,
                    rsvpId: vm.billable.id
                };
                vm.show = true;
                break;
            case 'rsvp':
                vm.label = 'Rsvp of ' + vm.billable.label + '  on ' + vm.billable.guestlist_name;
                vm.custom_action = function () {
                    var $modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: rsvpDetailsTemplate,
                        controller: 'RsvpDetailsCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            rsvp: function () {
                                return Rsvp.one(vm.billable.id).get({include: 'guestlist,contact,parent,children,parent.contact,children.contact'}).then(null, function () {
                                    SweetAlert.swal(locale.getString('rsvps.rsvp_not_found'), locale.getString('rsvps.rsvp_not_found_message'), 'error');
                                });
                            },
                            manager: function () {
                                return vm.manager;
                            }
                        }
                    });

                    return $modalInstance.result.then(function () {

                    }, function (response) {
                        return $q.reject(response);
                    });
                };
                vm.show = true;
                break;
            case 'contact':
                vm.label = 'Contact ' + vm.billable.label;
                vm.route = 'app.contacts.details';
                vm.route_params = {
                    id: vm.billable.id
                };
                vm.show = true;
                break;
            case 'invoice':
                vm.label = 'Invoice ' + vm.billable.label;
                vm.route = 'app.billing.invoices.details';
                vm.route_params = {
                    id: vm.billable.id
                };
                vm.show = true;
                break;
        }
    }

    function doClickAction() {
        if (!vm.custom_action) {
            window.open($state.href(vm.route, vm.route_params), '_blank');
        } else {
            vm.custom_action();
        }
    }
}