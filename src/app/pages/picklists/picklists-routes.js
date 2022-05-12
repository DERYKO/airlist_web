import mainTemplate from './views/base.tpl.html';
import contactsMainTemplate from './views/contacts/contacts.tpl.html';
import contactsDetailsTemplate from './views/contacts/contacts-details.tpl.html';
import contactsListTemplate from './views/contacts/contacts-list.tpl.html';
import picklistFormTemplate from './views/picklists/editor.html';
import picklistListTemplate from './views/picklists/list.tpl.html';

angular
    .module('airlst.picklists')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.picklists', {
            abstract: true,
            url: '/picklists',
            templateUrl: mainTemplate,
            params: {
                back: 'app.picklists.index',
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        store: $stateParams.store,
                    }
                }],
            },
            data: {
                showBackBtn: true,
                pageTitle: 'Picklists'
            }
        })
        .state('app.picklists.index', {
            url: '',
            sticky: true,
            data: {
                showBackBtn: false,
                rights: 'picklists::list',
                view: 'list'
            },
            views: {
                list: {
                    templateUrl: picklistListTemplate,
                    controller: 'PicklistsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.picklists.create', {
            url: '/create',
            data: {
                rights: 'picklists::create',
                view: 'editor'
            },
            params: {
                store: undefined
            },
            views: {
                editor: {
                    templateUrl: picklistFormTemplate,
                    controller: 'PicklistsCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.picklists.multiple', {
            url: '/update',
            data: {
                rights: [
                    'picklists::bulk',
                    'picklists::edit'
                ],
                view: 'editor'
            },
            params: {
                store: undefined
            },
            views: {
                editor: {
                    templateUrl: picklistFormTemplate,
                    controller: 'PicklistsFormCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.picklists.contacts', {
            url: '/{pid}',
            sticky: true,
            abstract: true,
            params: {
                picklist: undefined,
                back: 'app.picklists.contacts.index',
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        pid: $stateParams.pid,
                        picklist: $stateParams.picklist,
                        store: $stateParams.store,
                    }
                }],
            },
            data: {
                rights: 'picklists::contacts',
                view: 'contacts'
            },
            views: {
                contacts: {
                    templateUrl: contactsMainTemplate
                }
            }
        })
        .state('app.picklists.contacts.index', {
            url: '',
            sticky: true,
            params: {
                back: 'app.picklists.index',
                store: undefined
            },
            data: {
                rights: 'picklists::contacts',
                subview: 'contacts-list'
            },
            views: {
                'contacts-list': {
                    templateUrl: contactsListTemplate,
                    controller: 'PicklistContactsListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.picklists.contacts.edit-settings', {
            url: '/edit',
            params: {
                picklist: undefined,
                store: undefined
            },
            sticky: true,
            data: {
                rights: 'picklists::edit',
                subview: 'picklist-details'
            },
            views: {
                'picklist-details': {
                    templateUrl: picklistFormTemplate,
                    controller: 'PicklistsEditCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.picklists.contacts.details', {
            url: '/contacts/{cid}',
            params: {
                picklist: undefined,
                store: undefined,
                contact: undefined
            },
            sticky: true,
            data: {
                rights: 'addressbook::view',
                subview: 'contacts-details'
            },
            views: {
                'contacts-details': {
                    templateUrl: contactsDetailsTemplate,
                    controller: 'PicklistContactDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
