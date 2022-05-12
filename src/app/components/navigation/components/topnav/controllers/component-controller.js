/**
 * @ngdoc controller
 * @name navigation.topnav.controllers:TopNavComponentController
 * @element
 * @description
 *
 */
angular
    .module('airlst.components')
    .controller('TopNavComponentController', [
        '$rootScope',
        'NavService',
        '$scope',
        TopNavComponentController
    ]);

function TopNavComponentController($rootScope, NavService, $scope) {
    let vm = this;

    vm.topNavTree = [];
    vm.goToElem = goToElem;

    init();

    function init() {
        _updateNavTree();

        $rootScope.$on('al-nav-update-topnav', function () {
            _updateNavTree();
        })
    }

    function _updateNavTree() {
        NavService.getTopNavTree().then(topNavTree => {
            vm.topNavTree = topNavTree;
        }, e => {
            console.error('error while updating topNavTree', e);
        });
    }

    function goToElem(elem) {
        NavService.goToElem(elem.key, {});
    }
}