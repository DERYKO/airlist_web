import template from './component.tpl.html';
import Invoices from '../../../../../store/billing/invoices/index';


class LatestInvoiceDraftsController {
    constructor(http, scope, env, Invoices) {
        this.http = http;
        this.scope = scope;
        this.env = env;

        this.store = Invoices.reset({
            persist: false,
            listname: 'DashboardLatestInvoiceDraftsListview'
        });
        this.store.commit('setPermanentFilters', {
            'status': 'draft'
        });
        this.store.commit('setVm', this);

        this.init();
        this.data = [];
        this.error = false;
        this.loading = true;
    }

    init() {
        this.updateData();
    }

    updateData() {
        this.data = [];
        this.loading = true;
        this.error = false;

        this.store.dispatch('getDefinitions').then(() => {
            let columns = this.store.getters.columns;
            let fieldNamesToSelect = [
                    'subject',
                    'created_at'
                ];

            _.forEach(columns, (col) => {
                if (fieldNamesToSelect.indexOf(col.key) > -1) {
                    col.visible = true;
                }
            });

            this.store.commit('setColumns', columns);
            this.store.dispatch('getData').then(() => {
                this.data = this.store.state.data;
                this.loading = false;
                this.applyAsync();
            });
        });
    }

    applyAsync() {
        this.scope.$evalAsync();
    }
}

LatestInvoiceDraftsController.$inject = [
    '$http',
    '$scope',
    'Env',
    'Invoices'
];

angular.module('airlst.components.stats')
    .component('billingLatestInvoiceDrafts', {
        bindings: {},
        controller: LatestInvoiceDraftsController,
        controllerAs: 'vm',
        templateUrl: template
    });