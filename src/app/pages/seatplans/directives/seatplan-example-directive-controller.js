/**
 * @ngdoc directive
 * @name seatplans.directive:airlst.seatplans
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <seatplan-example seatplan=''></seatplan-example>
 *
 */
angular
    .module('airlst.seatplans')
    .controller('SeatplanExampleCtrl', [
        'Seatplan',
        '$attrs',
        SeatplanExampleCtrl
    ]);

function SeatplanExampleCtrl(Seatplan, $attrs) {
    var vm = this;

    vm.startLoading = startLoading;
    vm.stopLoading = stopLoading;

    vm.error = '';
    vm.showError = false;
    vm.loading = true;
    vm.seatplan = {};

    $attrs.$observe('seatplanId', function (val) {
        vm.seatplanId = val;
        init();
    });

    function init() {
        if (!vm.seatplanId) {
            console.log(vm.seatplanId);
            showError('Ivalid seatplan ID given');
            return;
        }

        loadSeatplan();
    }

    function startLoading() {
        vm.loading = true;
    }

    function stopLoading() {
        vm.loading = false;
    }

    function showError(message) {
        vm.error = message;
        vm.showError = true;
    }

    function loadSeatplan() {
        return Seatplan.one(vm.seatplanId).get({include: 'groups'}).then(function (data) {
            vm.seatplan = data;
            stopLoading();
        }, function () {
            showError('Error while loading seatplan');
            stopLoading();
        });
    }

    init();
}