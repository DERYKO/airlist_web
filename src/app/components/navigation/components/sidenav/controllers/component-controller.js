/**
 * @ngdoc controller
 * @name navigation.sidenav.controllers:SideNavComponentController
 * @element
 * @description
 *
 */

class SideNavComponentController {
    constructor($rootScope, NavService) {
        this.navigator = NavService;
        this.scope = $rootScope;
        this.state = $rootScope.$state;
        this.sidenav = [];
        this._updateSideNav();

        $rootScope.$on('al-nav-update-sidenav', () => {
            this._updateSideNav();
        })
    }

    _updateSideNav() {
        this.navigator.getCurrentSideNav().then(sidenav => {
            this.sidenav = sidenav;
            // if (!this.sidenav.main.length && !this.sidenav.customs.length) {
                // this.scope.collapsedBody = true;
            // }
        }, e => {
            console.error('error while updating breadcrumb', e);
        });
    }

    goToElem(elem) {
        this.navigator.goToElem(elem.key, {})
    }

    toggleSideNavStatus() {
        this.scope.collapsedBody = !this.scope.collapsedBody;
    }

    goBack() {
        this.navigator.goBack();
    }
}

angular
    .module('airlst.components')
    .controller('SideNavComponentController', [
        '$rootScope',
        'NavService',
        SideNavComponentController
    ]);