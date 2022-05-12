/**
 * @ngdoc object
 * @name contacts.controller:ContactsCtrl
 *
 * @description
 *
 */

const customNavs = [
    {
        label: 'Overview',
        icon: 'desktop',
        order: 5,
        rights: [],
    },
    {
        key: 'documents',
        label: 'Documents',
        icon: 'file',
        order: 15,
        rights: [],
    },
    {
        key: 'rsvps',
        label: 'RSVPs',
        icon: 'envelope-open',
        order: 15,
        rights: [
            'addressbook::rsvps'
        ],
    },
    {
        key: 'messages',
        label: 'Messages',
        icon: 'envelope',
        order: 15,
        rights: [
            'addressbook::messages'
        ],
    },
    {
        key: 'checkins',
        label: 'Checkins',
        icon: 'sign-in',
        order: 15,
        rights: [
            'addressbook::checkins'
        ],
    },
    {
        key: 'invoices',
        label: 'Invoices',
        icon: 'euro-sign',
        order: 10,
        rights: [
            'addressbook::invoices',
            'billing::invoice-list'
        ],
    },
    {
        key: 'subscriptions',
        label: 'Subscriptions',
        icon: 'rss',
        order: 11,
        rights: [
            'billing_subscriptions::list'
        ],
    }
];

class ContactsDetailsCtrl {
    constructor(Alert, $http, NavService, $state, $stateParams, Users, Workflows, locale, Acl, $scope) {
        this.api = $http;
        this.alert = Alert;
        this.router = $state;
        this.params = $stateParams;
        this.store = $stateParams.store;
        this.currentView = $stateParams.tab;
        this.contact = $stateParams.contact;
        this.navs = NavService;
        this.user = Users;
        this.workflows = Workflows;
        this.locale = locale;
        this.acl = Acl;
        this.scope = $scope;
        if (!this.contact || !$stateParams.skipReload) {
            this.loadContact();
        } else {
            this.updateNav();
            this.setSelectedIndex();
        }
        this._initWatchers();
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.params.id;
        }, () => {
            this.loadContact();
        });
    }

    loadContact() {
        window.scrollTo(0, 0);
        this.api.get(`contacts/${this.params.id}`)
            .then(response => {
                this.contact = this.localeSubscriptionStatus(response.data.data);
                this.updateNav();
                this.setSelectedIndex();
                return response;
            }, err => {
                this.alert.handle(err);
                this.router.go(this.params.back, this.params.backParams);
            });
    }

    localeSubscriptionStatus(contact) {
        contact.main_subscription_status = contact.main_subscription_status ? this.locale.getString('profile.' + contact.main_subscription_status) : '';
        return contact;
    }

    gotoContact(model) {
        const params = {
            id: this.store.state.slug === 'rsvps' ? model.contact.id : model.id,
            contact: this.store.state.slug === 'rsvps' ? model.contact : model,
            store: this.store,
            back: this.params.back,
            backParams: this.params.backParams,
        };
        return this.router.go('app.contacts.details', params, {reload: true})
    }

    updateNav() {
        this.setCustomActions();
        this.updateBreadcrumbParams();
        this.setBackButton();
        if (!this.currentView) {
            this.setMainActions();
        }
    }

    updateBreadcrumbParams() {

        const nav = _.find(customNavs, {key: this.currentView}) || {};
        this.navs.setBreadcrumbParameters({
            contact_full_name: (this.contact) ? this.contact.full_name : '',
            current_view: nav.label
        });

        this.navs.setStateParameters('app.contacts.details', {
            id: (this.contact) ? this.contact.id : null,
            contact: (this.contact) ? this.contact : null
        });
    }

    setCustomActions() {
        const customs = _(customNavs)
            .mapValues(nav => {
                nav.active = this.currentView === nav.key;
                nav.action = () => {
                    const path = nav.key ? 'app.contacts.details.tab' : 'app.contacts.details';
                    const params = {
                        id: this.contact.id,
                        tab: nav.key,
                        store: this.store,
                        contact: this.contact,
                        back: this.params.back,
                        backParams: this.params.backParams,
                        skipReload: true,
                    };

                    this.router.go(path, params, {location: true, reload: true})
                };
                return nav;
            })
            .reject(nav => _.reject(nav.rights, right => this.acl.hasRight(right)).length)
            .sortBy('order', 'asc')
            .value();

        this.navs.setSideNavCustoms(customs);
    }

    setMainActions() {
        const actions = _(this.workflows.getWorkflows('addressbook::details'))
            .filter(workflow => {
                return this.contact.archived ? workflow.level === 'archived-highlight' : workflow.level === 'highlight';
            })
            .map(workflow => {
                if (!workflow.onClick) {
                    workflow.onClick = workflow.action;
                }
                workflow.action = () => {
                    workflow.onClick(this.contact, this);
                };
                workflow.order = workflow.order || 30;
                return workflow;
            })
            .sortBy('order', 'asc')
            .value();

        this.navs.overrideMainSideNavActions(actions);
    }

    setSelectedIndex() {
        if (this.store) {
            const contact = this.store.state.slug === 'rsvps' ? {contact: {id: this.contact.id}} : {id: this.contact.id};
            this.selectedIndex = _.findIndex(this.store.state.data, contact);
        }
    }

    setBackButton() {
        this.navs.setGoBackAction(() => {
            const params = this.params.backParams || {
                id: this.contact.id
            };
            params.store = this.store;
            params.contact = this.contact;
            return this.router.go(this.params.back, params);
        });
    }
}


angular
    .module('airlst.contacts')
    .controller('ContactsDetailsCtrl', [
        'Alert',
        '$http',
        'NavService',
        '$state',
        '$stateParams',
        'Users',
        'Workflows',
        'locale',
        'Acl',
        '$scope',
        ContactsDetailsCtrl
    ]);
