import template from './component.tpl.html';

class LatestStageChangesController {
    constructor(http, scope, env) {
        this.http = http;
        this.scope = scope;
        this.env = env;
        this.init();
        this.resetState();
    }

    init() {
        this.initWatchers();
    }

    initWatchers() {
        this.scope.$watch(() => {
            return this.guestlistId;
        }, (newVal) => {
            this.updateData();
        });
    }

    updateData() {
        this.resetState();
        if (!this.guestlistId) {
            this.loading = false;
            return;
        }

        this.http.post(this.env.apiUrl + '/stats/guestlists/rsvp/state-changes/latest', {
            guestlist_id: this.guestlistId,
            count: 8
        }).then((response) => {
            this.loading = false;
            this.data = response.data.entries;
            this.applyAsync();
        }, () => {
            this.loading = false;
            this.error = true;
        });
    }

    applyAsync() {
        this.scope.$evalAsync();
    }

    resetState() {
        this.data = [];
        this.loading = true;
        this.error = false;
    }
}

LatestStageChangesController.$inject = [
    '$http',
    '$scope',
    'Env'
];

angular.module('airlst.components.stats')
    .component('guestlistRsvpsLatestStateChanges', {
        bindings: {
            'guestlistId': '<'
        },
        controller: LatestStageChangesController,
        controllerAs: 'vm',
        templateUrl: template
    });