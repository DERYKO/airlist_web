import template from './component.tpl.html';
import colors from './../../../../deposits/colors.json';


class RsvpInvitedVsConfirmedController {
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

        this.http.post(this.env.apiUrl + '/stats/guestlists/rsvp/invited-vs-confirmed', {
            guestlist_id: this.guestlistId
        }).then((response) => {
            this.loading = false;
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

    static formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('.');
    }

    prepareChartData() {
        // let invitedCount = 0;
        // _.forEach(this.data.invited, (curCount, date) => {
        //     this.chartData.data[1].push(curCount);
        //     invitedCount += curCount;
        // });

        let confirmedCount = 0;
        _.forEach(this.data.confirmed, (curCount, date) => {
            this.chartData.labels.push(RsvpInvitedVsConfirmedController.formatDate(date));
            this.chartData.data[0].push(curCount);
            confirmedCount += curCount;
        });

        if (confirmedCount === 0) {
            this.showChart = false;
            this.noData = true;
        } else if (this.chartData.labels.length > 0) {
            this.showChart = true;
        }
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
            dataSetOverride: [
                {
                    label: "confirmed",
                    backgroundColor: 'transparent',
                    borderColor: colors.rsvp.status.confirmed,
                    borderWidth: 3,
                    hoverBackgroundColor: colors.rsvp.status.confirmed,
                    pointBackgroundColor: colors.rsvp.status.confirmed,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colors.rsvp.status.confirmed,
                    pointRadius: 3,
                    pointBorderWidth: 3,
                    type: 'line'
                },
                // {
                //     label: "invited",
                //     borderWidth: 0,
                //     backgroundColor: colors.rsvp.status.invited,
                //     borderColor: colors.rsvp.status.invited,
                //     hoverBorderWidth: 0,
                //     hoverBackgroundColor: colors.rsvp.status.invited,
                //     hoverBorderColor: colors.rsvp.status.invited,
                //     type: 'bar'
                // }
            ],
            colors: [],
            options: {
                scales:
                    {
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
            }
        };
    }
}

RsvpInvitedVsConfirmedController.$inject = [
    '$http',
    '$scope',
    'Env'
];

angular.module('airlst.components.stats')
    .component('guestlistRsvpsInvitedVsConfirmed', {
        bindings: {
            'guestlistId': '<'
        },
        controller: RsvpInvitedVsConfirmedController,
        controllerAs: 'vm',
        templateUrl: template
    });
