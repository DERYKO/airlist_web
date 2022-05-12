import templateUrl from './contact-picklists.tpl.html';

class ContactPicklistsCtrl {

    constructor(Checkin, $http, NavService, $state, Acl) {
        this.acl = Acl;
        this.model = Checkin;
        this.api = $http;
        this.navs = NavService;
        this.router = $state;
        this.picklists = [];
        this.error = '';
        this.show = false;
    }

    $onInit() {
        this.loadPicklists();
    }

    checkRight() {
        return this.acl.hasRight('addressbook::picklists') && this.acl.hasRight('picklists::view');
    }

    loadPicklists() {
        this.picklists = [];
        if (this.checkRight()) {
            this.api.get(`contacts/${this.contact.id}/picklists`).then((result) => {
                this.picklists = result.data.data;
                this.show = true;
            }, () => {
                this.error = 'Error while loading picklists';
            })
        }
    }

    goToPicklist(picklist) {
        if (this.checkRight()) {
            this.navs.setGoBackAction(null);

            this.router.go('app.picklists.contacts.index', {
                pid: picklist.id,
                back: 'app.contacts.details',
                backParams: {
                    id: this.contact.id
                }
            });
        }
    }
}


ContactPicklistsCtrl.$inject = ['Checkin', '$http', 'NavService', '$state', 'Acl'];


angular
    .module('airlst.contacts')
    .component('contactPicklists', {
        bindings: {
            contact: '='
        },
        controller: ContactPicklistsCtrl,
        controllerAs: 'vm',
        templateUrl: templateUrl
    });
