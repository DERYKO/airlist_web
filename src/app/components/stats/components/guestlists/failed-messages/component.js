import template from './component.tpl.html';
class FailedMessagesController {
    constructor(http, scope, env) {
        this.http = http;
        this.scope = scope;
        this.env = env;
        this.init();
        this.data = [];
        this.error = false;
        this.loading = true;
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
        this.data = [];
        this.loading = true;
        this.error = false;

        if(!this.guestlistId) {
            this.loading = false;
            return;
        }

        this.http.post(this.env.apiUrl + '/stats/messages/latest', {
            guestlist_id: this.guestlistId,
            type: 'failed',
            count: 6
        }).then((response) => {
            this.loading = false;
            this.data = response.data.entries;
            this.applyAsync();
        }, () => {
            this.loading = false;
            this.error = true;
        });
    }

    applyAsync(){
        this.scope.$evalAsync();
    }
}

FailedMessagesController.$inject = [
    '$http',
    '$scope',
    'Env'
];

angular.module('airlst.components.stats')
    .component('guestlistFailedMessagesStats', {
        bindings: {
            'guestlistId': '<'
        },
        controller: FailedMessagesController,
        controllerAs: 'vm',
        templateUrl: template
    });