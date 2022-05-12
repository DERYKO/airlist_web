/**
 * @ngdoc controller
 * @name navigation.breadcrumb.controllers:BreadcrumbComponentController
 * @element
 * @description
 *
 */
angular
    .module('airlst.components')
    .controller('BreadcrumbComponentController', [
        '$rootScope',
        'NavService',
        '$sce',
        BreadcrumbComponentController
    ]);

function BreadcrumbComponentController($rootScope, NavService, $sce) {
    let vm = this;

    vm.breadcrumb = [];
    vm.sce = $sce;

    vm.goToElem = goToElem;

    init();

    function init() {
        _updateNavTree();
        $rootScope.$on('al-nav-update-breadcrumb', function(){
            _updateNavTree();
        })
    }

    function _updateNavTree() {
        NavService.getCurrentBreadCrumb().then(function (breadcrumb) {
            vm.breadcrumb = breadcrumb;
        }, function (e) {
            console.error('error while updating breadcrumb', e);
        });
    }

    function goToElem(elem) {
        NavService.goToElem(elem.key, {}, {location: true, reload: true});
    }
}
