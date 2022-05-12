import template from './component.tpl.html';

class SubscriptionCountsController {
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

        this.http.post(this.env.apiUrl + '/stats/contacts/subscriptions-for-heart', {
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
        _.forEach(this.data, (curSubscription, index) => {
            let curClassAndColor = this.colorsAndClasses[index];
            if (!curClassAndColor) {
                curClassAndColor = this.colorsAndClasses[0];
            }
            curSubscription.class = curClassAndColor.class;
            this.chartData.labels.push(curSubscription.subscription);
            this.chartData.colors.push(curClassAndColor.color);
            this.dataSetOverride[0].backgroundColor.push(curClassAndColor.color);
            this.dataSetOverride[0].hoverBackgroundColor.push(curClassAndColor.color);
            this.chartData.data.push(curSubscription.count);
        });


        if (this.data.length > 0) {
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

                        }]
                    },
            },
            colors: []
        };
        this.dataSetOverride = [{
            borderWidth: 0,
            hoverBorderWidth: 0,
            backgroundColor: [],
            hoverBackgroundColor: []
        }];
        this.colorsAndClasses = [
            {
                'class': 'legend-1',
                'color': '#E0E0E0'
            },
            {
                'class': 'legend-2',
                'color': '#73CCB9'
            },
            {
                'class': 'legend-3',
                'color': '#967ADC'
            },
            {
                'class': 'legend-4',
                'color': '#F5B858'
            },
            {
                'class': 'legend-5',
                'color': '#40C4F1'
            },
            {
                'class': 'legend-6',
                'color': '#ED5565'
            },
            {
                'class': 'legend-7',
                'color': '#ED5565'
            },
            {
                'class': 'legend-8',
                'color': '#ED5565'
            },
            {
                'class': 'legend-9',
                'color': '#ED5565'
            },
            {
                'class': 'legend-10',
                'color': '#ED5565'
            },
            {
                'class': 'legend-11',
                'color': '#ED5565'
            },
            {
                'class': 'legend-12',
                'color': '#ED5565'
            },
            {
                'class': 'legend-13',
                'color': '#ED5565'
            }
        ];
    }
}

SubscriptionCountsController.$inject = [
    '$http',
    '$scope',
    'Env'
];

angular.module('airlst.components.stats')
    .component('contactSubscriptionCounts', {
        bindings: {},
        controller: SubscriptionCountsController,
        controllerAs: 'vm',
        templateUrl: template
    });
