class RsvpDetailsCtrl {
    constructor($http, Acl, $state, $stateParams, Workflows, NavService, $scope) {
        this.api = $http;
        this.acl = Acl;
        this.state = $state;
        this.stateParams = $stateParams;
        this.workflows = Workflows;
        this.navService = NavService;
        this.scope = $scope;

        this.currentView = this.stateParams.tab || 'overview';
        this.store = this.stateParams.store;
        this.rsvp = this.stateParams.rsvp;
        this.guestlist = _.get(this.rsvp, 'guestlist.data');

        if (!this.rsvp || !this.stateParams.skipReload) {
            this._loadRsvp();
        } else {
            this._updateNav();
            // this.setSelectedIndex();
        }
        this._initWatchers();
    }

    gotoRsvp(model) {
        return this.state.go('app.guestlists.rsvps.details', {
            id: model.id,
            rsvp: model,
            store: this.store,
            back: this.stateParams.back,
            backParams: this.stateParams.backParams,
        });
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.stateParams.id;
        }, () => {
            this._loadRsvp();
        });
    }

    _loadRsvp() {
        this.api.get(`rsvps/${ this.stateParams.id }?include=contact,guestlist,parent,parent.contact`).then((response) => {
            this.rsvp = response.data.data;
            this.guestlist = this.rsvp.guestlist.data;

            this._updateNav();
            // this.setSelectedIndex();
        });
    }

    _updateNav() {
        this._setCustomNavActions();
        this._updateBreadcrumbParams();
        this._setMainActions();
    }

    _setCustomNavActions() {
        const customs = _(this._getCustomNavs())
            .mapValues(nav => {
                nav.active = this.currentView === nav.tab;
                nav.action = () => {
                    const params = {
                        id: this.rsvp.id,
                        tab: nav.tab,
                        store: this.store,
                        rsvp: this.rsvp,
                        back: this.stateParams.back,
                        backParams: this.stateParams.backParams,
                        skipReload: true
                    };

                    this.state.go('app.guestlists.rsvps.details.tab', params, {location: true, reload: true})
                };
                return nav;
            })
            .sortBy('order', 'asc')
            .value();

        this.navService.setSideNavCustoms(customs);
    }

    _updateBreadcrumbParams() {
        const nav = _.find(this._getCustomNavs(), {tab: this.currentView}) || {};
        this.navService.setBreadcrumbParameters({
            guestlist_name: this.guestlist.name,
            rsvp: '#' + this.rsvp.code + ' (' + this.rsvp.contact.data.full_name + ')',
            current_view: nav.label
        });

        this.navService.setStateParameters('app.guestlists.rsvps.details', {
            id: this.rsvp.id,
            tab: 'overview',
            store: this.store,
            rsvp: this.rsvp,
            back: this.stateParams.back,
            backParams: this.stateParams.backParams,
            skipReload: true
        });
    }

    _setMainActions() {
        if (this.currentView === 'overview') {
            const workflows = this.workflows.getWorkflows('rsvps::details')
                .filter(workflow => {
                    return this.workflows.shouldShow(this.rsvp, workflow) && (this.rsvp.archived ? workflow.level === 'archived-highlight' : workflow.level === 'highlight');
                })
                .map(workflow => {
                    if (!workflow.onClick) {
                        workflow.onClick = workflow.action;
                    }
                    workflow.action = () => {
                        workflow.onClick(this.rsvp, this);
                    };

                    return workflow;
                });

            this.navService.overrideMainSideNavActions(workflows);
        }
    }

    _getCustomNavs() {
        const customs = [
            {
                label: 'Overview',
                tab: 'overview',
                icon: 'desktop',
                order: 5
            }
        ];

        if (this.acl.hasRight('rsvps::messages')) {
            customs.push({
                label: 'Messages',
                tab: 'messages',
                icon: 'envelope',
                order: 10
            });
        }

        if (_.get(this.guestlist, 'settings.enable_guests')) {
            customs.push({
                label: 'Guests',
                tab: 'guests',
                icon: 'users',
                order: 15
            });
        }

        return customs;
    }
}

RsvpDetailsCtrl.$inject = [
    '$http',
    'Acl',
    '$state',
    '$stateParams',
    'Workflows',
    'NavService',
    '$scope'
];

/**
 * @ngdoc object
 * @name rsvps.controller:RsvpDetailsCtrl
 *
 * @description
 *
 */
angular.module('airlst.guestlists').controller('RsvpDetailsCtrl', RsvpDetailsCtrl);
