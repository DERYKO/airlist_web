import mainTemplate from './views/seatplans.tpl.html';
import listTemplate from './views/seatplans-list.tpl.html';
import editorTemplate from './views/seatplans-editor.tpl.html';
import detailsTemplate from './views/seatplans-details.tpl.html';
import elementsTemplate from './views/seatplans-elements.tpl.html';

angular
    .module('airlst.seatplans')
    .config([
        '$stateProvider',
        config
    ]);

var loadSeatplan = [
    'locale',
    'Seatplan',
    '$state',
    '$stateParams',
    'SweetAlert',
    function (locale, Seatplan, $state, $stateParams, SweetAlert) {
        return Seatplan.one($stateParams.id)
            .get({include: 'groups'})
            .then(null, function () {
                SweetAlert.error(locale.getString('seatplans.seatplans.messages.seatplan_not_found'), locale.getString('seatplans.seatplans.messages.seatplan_not_found_message'));
                $state.go('app.seatplans.index');
            });
    }];

function config($stateProvider) {
    $stateProvider
        .state('app.seatplans', {
            abstract: true,
            templateUrl: mainTemplate,
            reloadOnSearch: false,
            data: {
                pageTitle: 'Seatplans',
                showBackBtn: true
            }
        })
        .state('app.seatplans.index', {
            url: '/seatplans',
            sticky: true,
            data: {
                rights: 'seatplans::seatplan-list',
                view: 'index',
                showBackBtn: false
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'SeatplansListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.seatplans.create', {
            url: '/seatplans/create',
            data: {
                rights: 'seatplans::seatplan-create',
                view: 'editor'
            },
            params: {
                template: undefined,
                store: undefined
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'SeatplansCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.seatplans.edit', {
            url: '/seatplans/{id}/edit',
            data: {
                rights: 'seatplans::seatplan-edit',
                view: 'editor'
            },
            params: {

                template: undefined,
                store: undefined
            },
            resolve: {
                model: loadSeatplan
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'SeatplansEditCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.seatplans.details', {
            url: '/seatplans/{id}/details',
            data: {
                rights: 'seatplans::seatplan-view',
                view: 'details'
            },
            params: {
                template: undefined,
                store: undefined
            },
            resolve: {
                model: loadSeatplan
            },
            views: {
                details: {
                    templateUrl: detailsTemplate,
                    controller: 'SeatplansDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.seatplans.elements', {
            url: '/seatplans/groups/{id}/elements',
            data: {
                rights: 'seatplans::elements-list',
                view: 'elements'
            },
            resolve: {
                model: [
                    'locale',
                    'SeatplanGroup',
                    '$stateParams',
                    'SweetAlert',
                    function (locale, SeatplanGroup, $stateParams, SweetAlert) {
                        return SeatplanGroup.one($stateParams.id).get({include: 'seatplan'}).then(null, function () {
                            SweetAlert.error(locale.getString('seatplans.seatplans.messages.seatplan_not_found'), locale.getString('seatplans.seatplans.messages.seatplan_not_found_message'));
                            $state.go('app.seatplans.index');
                        });
                    }
                ]
            },
            views: {
                elements: {
                    templateUrl: elementsTemplate,
                    controller: 'SeatplansElementsCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
