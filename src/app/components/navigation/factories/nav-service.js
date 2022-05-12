import menuItems from '../deposit/menu-items.json';
import topNavStructure from '../deposit/topnav-structure.json';
import sideNavStructure from '../deposit/sidenav-structure.json';

/**
 * @ngdoc service
 * @name navigation.factory:NavService
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .factory('NavService', [
        'locale',
        '$state',
        '$q',
        '$transitions',
        '$rootScope',
        '$stateParams',
        '$window',
        'Users',
        NavService
    ]);

function NavService(locale, $state, $q, $transitions, $rootScope, $stateParams, $window, Users) {
    let service = this;
    service.locales = [
        'navigation',
        'common'
    ];

    service.menuItems = menuItems;
    service.topNavStructure = topNavStructure;

    service.sideNavStructure = sideNavStructure;
    service.sideNavCustoms = [];
    service.sideNavMainActionsOverride = [];
    service.breadcrumbParameters = [];
    service.showBackBtn = false;
    service.stateParameters = {};

    service.getTopNavTree = getTopNavTree;
    service.goToElem = goToElem;
    service.getCurrentBreadCrumb = getCurrentBreadCrumb;
    service.getCurrentSideNav = getCurrentSideNav;
    service.setSideNavCustoms = setSideNavCustoms;
    service.overrideMainSideNavActions = overrideMainSideNavActions;
    service.setBreadcrumbParameters = setBreadcrumbParameters;
    service.setStateParameters = setStateParameters;
    service.goBack = goBack;
    service.setGoBackAction = setGoBackAction;
    service.shouldShowBackBtn = shouldShowBackBtn;

    function getTopNavTree() {
        return $q(function (resolve, reject) {
            return $q.all([
                locale.ready(service.locales)
            ]).then(function () {
                resolve(_prepareTopNavStructureRecursive(service.topNavStructure).items);
            }, function (e) {
                reject(e);
            });
        });
    }

    function goToElem(elemKey, params) {
        let stateParams = params || {},
            elemToGoTo = _getElemByKey(elemKey);
        if (elemToGoTo && elemToGoTo.route) {
            if (service.stateParameters[elemToGoTo.route]) {
                stateParams = service.stateParameters[elemToGoTo.route];
            }
            $state.go(elemToGoTo.route, stateParams, {location: true, reload: true});
        }
    }

    function getCurrentBreadCrumb() {
        return $q(function (resolve, reject) {
            return $q.all([
                locale.ready(service.locales)
            ]).then(function () {
                let breadCrumbElemsReverse = [],
                    lastElem = _getElemByRoute($state.current.name),
                    lastKey = (lastElem) ? lastElem.key : null;


                while (lastKey) {
                    let lastElem = _getElemByKey(lastKey);
                    if (lastElem && lastElem.key !== 'dashboard') {
                        let responseElem = _prepareResponseElem(lastElem);
                        breadCrumbElemsReverse.push(responseElem);
                        lastKey = lastElem.parent;
                    } else {
                        lastKey = null;
                    }
                }

                breadCrumbElemsReverse.push(_prepareResponseElem(_getElemByKey('dashboard')));
                resolve(breadCrumbElemsReverse.reverse());
            }, function (e) {
                reject(e);
            });
        });
    }

    function getCurrentSideNav() {
        return $q(function (resolve, reject) {
            return $q.all([
                locale.ready(service.locales)
            ]).then(function () {
                let curElem = _getElemByRoute($state.current.name),
                    out = {
                        main: [],
                        customs: service.sideNavCustoms
                    };

                if (service.sideNavMainActionsOverride.length === 0 && curElem && service.sideNavStructure[curElem.key]) {
                    for (let i = 0; i < service.sideNavStructure[curElem.key].length; i++) {
                        let curSideNavItem = service.sideNavStructure[curElem.key][i],
                            curMenuItem = _getElemByKey(curSideNavItem.key);

                        if (curMenuItem && (!curMenuItem.right || _checkUserRight(curMenuItem.right))) {
                            out.main.push({
                                key: curMenuItem.key,
                                label: locale.getString('navigation.' + curSideNavItem['locale-key']),
                                icon: curSideNavItem.icon,
                                primary: !!curSideNavItem.primary
                            });
                        }
                    }
                } else if (service.sideNavMainActionsOverride.length > 0) {
                    for (let i = 0; i < service.sideNavMainActionsOverride.length; i++) {
                        let currentOverrideElem = service.sideNavMainActionsOverride[i];
                        currentOverrideElem.custom = true;
                        if (!currentOverrideElem.label && currentOverrideElem.title) {
                            currentOverrideElem.label = currentOverrideElem.title;
                        }
                        out.main.push(currentOverrideElem);
                    }
                }

                resolve(out);
            }, function (e) {
                reject(e);
            });
        });
    }

    function setSideNavCustoms(sideNavCustoms) {
        service.sideNavCustoms = sideNavCustoms;
        _fireEvent('update-sidenav', []);
    }

    function overrideMainSideNavActions(sideNavMainActionsOverride) {
        service.sideNavMainActionsOverride = sideNavMainActionsOverride;
        _fireEvent('update-sidenav', []);
    }

    function setBreadcrumbParameters(breadcrumbParameters) {
        service.breadcrumbParameters = breadcrumbParameters;
        _fireEvent('update-breadcrumb', []);
    }

    function setStateParameters(state, stateParameters) {
        service.stateParameters[state] = stateParameters;
        _fireEvent('update-breadcrumb', []);
    }

    function goBack() {
        service.showBackBtn = false;
        if (service.onGoBack) {
            service.onGoBack();
            service.onGoBack = undefined;
            return;
        }

        if ($stateParams.back) {
            return $state.go($stateParams.back, $stateParams.backParams);
        }

        $window.history.back()
    }

    function setGoBackAction(func) {
        service.showBackBtn = true;
        service.onGoBack = func;
    }

    function shouldShowBackBtn(show) {
        service.showBackBtn = show;
    }

    /* Private functions */
    function _init() {
        $transitions.onStart({}, function (trans) {
            _resetSideNavCustoms();
            _resetSideNavMainOverride();
            _resetStateParameters();
            _resetBreadcrumbParameters();

            trans.promise.finally(function () {
                _fireEvent('update-topnav', []);
                _fireEvent('update-breadcrumb', []);
                _fireEvent('update-sidenav', []);
            });
        });
    }

    function _prepareResponseElem(rawElem) {
        return {
            "key": rawElem.key,
            "label": locale.getString('navigation.' + rawElem['locale-key'], service.breadcrumbParameters)
        };
    }

    function _prepareTopNavStructureRecursive(curList) {
        let out = {
            childActive: false,
            items: []
        };
        _.each(curList, function (curListElement, key) {
            let curMenuItem = _getElemByKey(curListElement.key);
            if (!curMenuItem || (curMenuItem.right && !_checkUserRight(curMenuItem.right))) {
                return;
            }

            if (curMenuItem['required-right']) {
                const explodedRight = curMenuItem['required-right'].split('::');
                if (explodedRight.length !== 2) {
                    console.error('Right name error on menu generation', {
                        menuItem: curMenuItem
                    });
                    return;
                }

                if (!Users.dispatch('hasRight', {
                    module: explodedRight[0],
                    right: explodedRight[1]
                })) {
                    return;
                }
            }

            let curElemOut = _prepareResponseElem(curMenuItem);
            curElemOut.active = !!(curMenuItem.route && curMenuItem.route === $state.current.name);
            curElemOut.order = curListElement.order;
            curElemOut.children = [];

            if (curListElement.children.length) {
                let curElementChildren = _prepareTopNavStructureRecursive(curListElement.children);
                if (curElementChildren.childActive) {
                    curElemOut.active = true;
                }
                curElemOut.children = curElementChildren.items;

                // Remove dropdown without children
                if (!curElemOut.children.length) {
                    return;
                }
            }

            if (curElemOut.active) {
                out.childActive = true;
            }
            out.items.push(curElemOut);
        });

        return out;
    }

    function _fireEvent(event, args) {
        let eventName = 'al-nav-' + event;

        $rootScope.$emit(eventName, args);
    }

    function _resetSideNavCustoms() {
        service.sideNavCustoms = [];
    }

    function _resetSideNavMainOverride() {
        service.sideNavMainActionsOverride = [];
    }

    function _resetBreadcrumbParameters() {
        service.breadcrumbParameters = [];
    }

    function _resetStateParameters() {
        service.stateParameters = {};
    }

    function _checkUserRight(right) {
        return true;
    }

    function _getElemByKey(key) {
        for (let i = 0; i < service.menuItems.length; i++) {
            if (service.menuItems[i].key === key) {
                return service.menuItems[i];
            }
        }

        return null;
    }

    function _getElemByRoute(route) {
        for (let i = 0; i < service.menuItems.length; i++) {
            if (service.menuItems[i].route === route) {
                return service.menuItems[i];
            }
        }

        return null;
    }

    _init();
    return service;
}
