/**
 * @ngdoc object
 * @name theme.base.controller:HeaderCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.theme.airlst')
    .controller('AlPaginationCtrl', [
        '$scope',
        'PagerService',
        AlPaginationController
    ]);

function AlPaginationController($scope, PagerService) {
    let vm = this;

    vm.pager = {};

    vm.goToPage = goToPage;

    _init();

    // Internal Functions
    function _init() {
        $scope.$watch('vm.store', function () {
            updatePagination()
        });
    }

    function updatePagination() {
        if (vm.store) {
            vm.pager = PagerService.getPager(vm.store.state.pagination.total, vm.store.state.pagination.current, vm.store.state.pagination.perPage);
        }
    }

    // Functions to map on controller
    function goToPage(pageNumber) {
        vm.store.state.pagination.current = pageNumber;
        vm.store.dispatch('goToPage');
        updatePagination();
    }
}