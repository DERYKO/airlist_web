import template from './component.tpl.html';
import Invoices from '../../../../../store/billing/invoices/index';


class InvoicesPaidVsOpenController {
    constructor(http, scope, env) {
        this.http = http;
        this.scope = scope;
        this.env = env;
        this.init();
        this.resetState();
    }

    init() {
        this.updateData();
    }

    updateData() {
        this.resetState();
        this.http.post(this.env.apiUrl + '/stats/billing/invoices-open-vs-paid').then((response) => {
            this.data = response.data;
            this.prepareChartData();
            this.applyAsync();
        }, () => {
            this.loading = false;
            this.error = true;
        });
    }

    applyAsync() {
        this.scope.$evalAsync();
    }

    prepareChartData() {
        _.forEach(this.data.counts, (curCount) => {
            this.chartData.labels.push(curCount.month + ' - ' + curCount.year);
            this.chartData.data[0].push(curCount.paid);
            this.chartData.data[1].push(curCount.open);
        });
        this.showChart = true;
        this.loading = false;
        this.applyAsync();
    }

    resetState() {
        this.data = [];
        this.loading = true;
        this.error = false;
        this.showChart = false;
        this.noData = false;

        this.chartData = {
            labels: [],
            data: [
                [],
                []
            ],
            series: [
                'Paid',
                'Open'
            ],
            dataSetOverride: [
                {
                    label: 'Paid',
                    borderWidth: 0,
                    backgroundColor: this.hexToRgbA('#73ccb9', 1),
                    hoverBackgroundColor: this.hexToRgbA('#73ccb9', 0.5),
                    type: 'bar'
                },
                {
                    label: 'Open',
                    borderWidth: 0,
                    backgroundColor: this.hexToRgbA('#967adc', 0.8),
                    hoverBackgroundColor: this.hexToRgbA('#967adc', 0.6),
                    type: 'bar'
                }
            ],
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                },
            }
        }
        ;
    }

    hexToRgbA(hex, opacity) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
        }
        throw new Error('Bad Hex');
    }

}

InvoicesPaidVsOpenController.$inject = [
    '$http',
    '$scope',
    'Env',
    'Invoices'
];

angular.module('airlst.components.stats')
    .component('billingInvoicesPaidVsOpen', {
        bindings: {},
        controller: InvoicesPaidVsOpenController,
        controllerAs: 'vm',
        templateUrl: template
    });