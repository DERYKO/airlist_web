import contactsTemplate from './views/contacts.tpl.html';
import contactsListTemplate from './views/contacts-list.tpl.html';
import contactsDetailsTemplate from './views/contacts-details.tpl.html';
import contactsEditorTemplate from './views/contacts-editor.tpl.html';
import contactsImportTemplate from './views/contacts-import.tpl.html';
import duplicatesListDuplicates from './views/contacts-list-duplicates.tpl.html';
import duplicatesViewDuplicate from './views/contacts-view-duplicate.tpl.html';

angular
    .module('airlst.contacts')
    .config(['$stateProvider', config]);

function config($stateProvider) {
    $stateProvider
        .state('app.contacts', {
            abstract: true,
            templateUrl: contactsTemplate,
            data: {
                pageTitle: 'Contacts'
            }
        })
        .state('app.contacts.index', {
            url: '/contacts',
            sticky: true,
            data: {
                bodyClass: 'wide',
                rights: 'addressbook::list',
                view: 'index'
            },
            params: {
                store: undefined
            },
            views: {
                index: {
                    templateUrl: contactsListTemplate,
                    controller: 'ContactsListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.contacts.create', {
            url: '/contacts/create',
            data: {
                rights: 'addressbook::create',
                view: 'details'
            },
            params: {
                store: undefined,
                back: 'app.contacts.index',
            },
            views: {
                details: {
                    templateUrl: contactsEditorTemplate,
                    controller: 'ContactCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.contacts.multiple', {
            url: '/contacts/update',
            params: {
                rows: undefined,
                store: undefined,
                guestlist: undefined,
                picklist: undefined,
                relationship: undefined
            },
            data: {
                rights: 'addressbook::bulk',
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: contactsEditorTemplate,
                    controller: 'ContactsMultipleEditorCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.contacts.import', {
            url: '/contacts/import',
            data: {
                rights: 'addressbook::import',
                view: 'import'
            },
            views: {
                'import': {
                    templateUrl: contactsImportTemplate,
                    controller: 'ContactsImportCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.contacts.duplicates', {
            url: '/contacts/duplicates',
            data: {
                rights: 'addressbook::duplicates',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: duplicatesListDuplicates,
                    controller: 'ContactsDuplicatesCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.contacts.duplicate', {
            url: '/contacts/duplicates/{id}',
            params: {
                contact: undefined,
            },
            data: {
                rights: 'addressbook::duplicates',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: duplicatesViewDuplicate,
                    controller: 'ContactsDuplicateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.contacts.details', {
            url: '/contacts/{id}',
            params: {
                contact: undefined,
                store: undefined,
                back: 'app.contacts.index',
                skipReload: undefined,
            },
            sticky: true,
            data: {
                rights: 'addressbook::view',
                view: 'details'
            },
            views: {
                'details': {
                    templateUrl: contactsDetailsTemplate,
                    controller: 'ContactsDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.contacts.edit', {
            url: '/contacts/{id}/edit',
            params: {
                contact: undefined,
                store: undefined,
                back: 'app.contacts.details',
            },
            sticky: true,
            data: {
                rights: 'addressbook::edit',
                track: false,
                view: 'details'
            },
            views: {
                'details': {
                    templateUrl: contactsEditorTemplate,
                    controller: 'ContactEditCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.contacts.details.tab', {
            url: '/{tab}',
            params: {
                contact: undefined,
                store: undefined,
                skipReload: undefined,
            },
            sticky: true,
            data: {
                bodyClass: 'wide',
                rights: 'addressbook::view',
                track: false,
                view: 'details'
            },
            views: {
                'details': {
                    templateUrl: contactsDetailsTemplate,
                    controller: 'ContactsDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
