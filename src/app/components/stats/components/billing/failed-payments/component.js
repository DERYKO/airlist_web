import template from './component.tpl.html';

class FailedPaymentsController {
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
        // this.initWatchers();
        this.updateData();
    }

    updateData() {
        this.data = [];
        this.loading = true;
        this.error = false;

        this.http.post(this.env.apiUrl + '/stats/billing/failed-invoices', {
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

FailedPaymentsController.$inject = [
    '$http',
    '$scope',
    'Env'
];

angular.module('airlst.components.stats')
    .component('billingFailedPayments', {
        bindings: {
            'guestlistId': '<'
        },
        controller: FailedPaymentsController,
        controllerAs: 'vm',
        templateUrl: template
    });