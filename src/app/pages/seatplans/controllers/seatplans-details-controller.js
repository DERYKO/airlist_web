/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.seatplans')
    .controller('SeatplansDetailsCtrl', [
        '$state',
        'model',
        SeatplansDetailsCtrl
    ]);

function SeatplansDetailsCtrl($state, model) {
    var vm = this;
    vm.seatplan = model;

    vm.cancel = cancel;
    vm.editElements = editElements;

    init();

    function init() {

    }

    function cancel() {
        $state.go('app.seatplans.index');
    }

    function editElements(group) {
        $state.go('app.seatplans.elements', {id: group.id});
    }
}