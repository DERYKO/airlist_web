import template from './component.tpl.html';
import colors from './../../../../deposits/colors.json';

class RsvpsByStatusController {
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

        this.http.post(this.env.apiUrl + '/stats/guestlists/rsvp/status', {
            guestlist_id: this.guestlistId
        }).then((response) => {
            this.loading = false;
            this.data = response.data.counts;
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
        _.forEach(this.data, (curStatus) => {
            this.chartData.labels.push(curStatus.status);
            this.chartData.colors.push(colors.rsvp.status[curStatus.status]);
            this.chartData.data.push(curStatus.count);
        });


        if(this.data.length > 0) {
            this.showChart = true;
        }
        this.applyAsync();
    }

    resetState() {
        this.data = [];
        this.loading = true;
        this.error = false;
        this.showChart = false;
        this.chartData = {
            labels: [],
            data: [],
            options: {
                scales:
                    {
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        yAxes: [{
                            // maxBarThickness: 25
                        }]
                    },
            },
            colors: []
        };
    }
}

RsvpsByStatusController.$inject = [
    '$http',
    '$scope',
    'Env'
];

angular.module('airlst.components.stats')
    .component('guestlistRsvpsByStatus', {
        bindings: {
            'guestlistId': '<'
        },
        controller: RsvpsByStatusController,
        controllerAs: 'vm',
        templateUrl: template
    });