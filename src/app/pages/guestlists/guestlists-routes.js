import mainGuestlistTemplate from './views/guestlists.tpl.html';
import guestlistIndexTemplate from './views/guestlists-list.tpl.html';
import guestlistCreateTemplate from './views/guestlists-create-wizard.tpl.html';
import guestlistEditorTemplate from './views/guestlists-editor.tpl.html';
import guestlistSeatsTemplate from './views/guestlists-seats.tpl.html';
import guestlistSettingsTemplate from './views/guestlists-settings.tpl.html';
import guestlistLimitsTemplate from './views/guestlists/limits.tpl.html';

import mainRsvpTemplate from './views/rsvps.tpl.html';
import rsvpListTemplate from './views/rsvps-list.tpl.html';
import rsvpDuplicatesTemplate from './views/rsvps-duplicates.tpl.html';
import rsvpCreateTemplate from './views/rsvps-create.tpl.html';
import rsvpEditorTemplate from './views/rsvps-editor.tpl.html';
import rsvpDetailsTemplate from './views/rsvps-details.tpl.html';
import rsvpMasterListTemplate from './views/rsvps-masterlist.tpl.html';
import rsvpImportTemplate from './views/rsvp-import.tpl.html';
import GuestlistEditController from './controllers/guestlists/guestlist-edit-controller';

angular
    .module('airlst.guestlists')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.guestlists', {
            abstract: true,
            url: '/guestlists',
            templateUrl: mainGuestlistTemplate,
            data: {
                showBackBtn: true,
                pageTitle: 'Guestlists',
            }
        })
        .state('app.guestlists.index', {
            url: '',
            sticky: true,
            data: {
                showBackBtn: false,
                rights: 'guestlists::list',
                view: 'list'
            },
            views: {
                list: {
                    templateUrl: guestlistIndexTemplate,
                    controller: 'GuestlistsListCtrl',
                    controllerAs: 'vm'
                }
            },
            reloadOnSearch: false
        })
        .state('app.guestlists.create', {
            url: '/create',
            data: {
                rights: 'guestlists::edit',
                view: 'details'
            },
            params: {
                store: undefined
            },
            views: {
                details: {
                    templateUrl: guestlistCreateTemplate,
                    controller: 'GuestlistsCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.masterlist', {
            url: '/master',
            params: {
                rows: undefined,
                store: undefined
            },
            data: {
                rights: 'rsvps::masterlist',
                view: 'details'
            },
            views: {
                'details': {
                    templateUrl: rsvpMasterListTemplate,
                    controller: 'RsvpsMasterListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps', {
            url: '/{gid:int}',
            sticky: true,
            abstract: true,
            data: {
                pageTitle: 'Bookings',
                view: 'rsvps'
            },
            params: {
                guestlist: undefined,
                back: 'app.guestlists.rsvps.index',
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        gid: $stateParams.gid,
                        store: $stateParams.store
                    }
                }],
            },
            views: {
                rsvps: {
                    templateUrl: mainRsvpTemplate
                }
            }
        })
        .state('app.guestlists.rsvps.index', {
            sticky: true,
            url: '',
            data: {
                bodyClass: 'wide',
                rights: 'rsvps::list',
                subview: 'rsvps-list'
            },
            params: {
                back: 'app.guestlists.index',
                store: undefined
            },
            views: {
                'rsvps-list': {
                    templateUrl: rsvpListTemplate,
                    controller: 'RsvpsListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.create', {
            sticky: true,
            url: '/rsvps/create',
            data: {
                rights: 'rsvps::edit',
                subview: 'rsvps-details'
            },
            params: {
                contacts: undefined,
                store: undefined,
                backParams: ['$stateParams', ($stateParams) => ({gid: $stateParams.gid, store: $stateParams.store})]
            },
            views: {
                'rsvps-details': {
                    templateUrl: rsvpCreateTemplate,
                    controller: 'RsvpCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.details', {
            sticky: true,
            url: '/rsvps/{id}',
            data: {
                rights: 'rsvps::view',
                subview: 'rsvps-details',
                track: false
            },
            params: {
                rsvp: undefined,
                store: undefined,
                skipReload: undefined,
                back: 'app.guestlists.rsvps.index',
                backParams: ['$stateParams', ($stateParams) => ({store: $stateParams.store})]
            },
            views: {
                'rsvps-details': {
                    templateUrl: rsvpDetailsTemplate,
                    controller: 'RsvpDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.details.tab', {
            url: '/{tab}',
            data: {
                rights: 'rsvps::view',
                subview: 'rsvps-details',
                track: false
            },
            sticky: true,
            params: {
                rsvp: undefined,
                store: undefined,
                skipReload: undefined
            },
            views: {
                'rsvps-details': {
                    templateUrl: rsvpDetailsTemplate,
                    controller: 'RsvpDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.edit', {
            sticky: true,
            url: '/rsvps/{id}/edit',
            data: {
                rights: 'rsvps::edit',
                subview: 'rsvps-details'
            },
            params: {
                store: undefined,
                back: 'app.guestlists.rsvps.details',
                backParams: ['$stateParams', ($stateParams) => ({
                    gid: $stateParams.gid,
                    guestlist: $stateParams.guestlist,
                    id: $stateParams.id,
                    store: $stateParams.store
                })]
            },
            views: {
                'rsvps-details': {
                    templateUrl: rsvpEditorTemplate,
                    controller: 'RsvpEditCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.seats', {
            url: '/seats',
            params: {
                rows: undefined,
                store: undefined
            },
            data: {
                rights: 'rsvps::view',
                subview: 'guestlist-settings'
            },
            views: {
                'guestlist-settings': {
                    templateUrl: guestlistSeatsTemplate,
                    controller: 'GuestlistsSeatsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.settings', {
            url: '/settings',
            params: {
                guestlist: undefined
            },
            sticky: true,
            data: {
                rights: 'guestlists::view',
                subview: 'guestlist-settings'
            },
            views: {
                'guestlist-settings': {
                    templateUrl: guestlistSettingsTemplate,
                    controller: 'GuestlistsSettingsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.limits', {
            url: '/limits',
            params: {
                guestlist: undefined
            },
            sticky: true,
            data: {
                rights: 'guestlists::view-limits',
                subview: 'guestlist-settings'
            },
            views: {
                'guestlist-settings': {
                    templateUrl: guestlistLimitsTemplate,
                    controller: 'GuestlistLimitsController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.edit-settings', {
            url: '/edit',
            params: {
                guestlist: undefined,
                back: 'app.guestlists.rsvps.index',
                editorView: 'general'
            },
            sticky: true,
            data: {
                rights: 'guestlists::edit',
                subview: 'guestlist-settings'
            },
            views: {
                'guestlist-settings': {
                    templateUrl: guestlistEditorTemplate,
                    controller: GuestlistEditController,
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.import', {
            url: '/import/rsvp',
            data: {
                back: 'app.guestlists.rsvps.index',
                rights: 'rsvps::import',
                subview: 'rsvps-details'
            },
            views: {
                'rsvps-details': {
                    templateUrl: rsvpImportTemplate,
                    controller: 'RsvpsImportCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.guestlists.rsvps.duplicates', {
            sticky: true,
            url: '/duplicates',
            data: {
                bodyClass: 'wide',
                rights: 'rsvps::duplicates',
                subview: 'rsvps-list'
            },
            params: {
                back: 'app.guestlists.rsvps.index',
                store: undefined
            },
            views: {
                'rsvps-list': {
                    templateUrl: rsvpDuplicatesTemplate,
                    controller: 'RsvpsDuplicatesCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
