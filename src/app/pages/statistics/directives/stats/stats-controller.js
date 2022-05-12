

/**
 * @ngdoc directive
 * @name payments.directive:contact
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <payments contact=''></payments>
 *
 */
angular
    .module('airlst.statistics')
    .controller('StatisticsStatsCtrl', [
        '$http',
        'Env',
        '$filter',
        'locale',
        '$state',
        '$scope',
        StatisticsStatsCtrl
    ]);

function StatisticsStatsCtrl($http, Env, $filter, locale, $state, $scope) {
    var vm = this;

    vm.loading = true;
    vm.error = false;
    vm.errorMessage = false;
    vm.followLink = followLink;

    vm.defaultColors = [
        '#6AD600',
        '#ffa534',
        '#23ccef',
        '#E83FF4',
        '#F4F43F',
        '#FF0039'
    ];

    vm.chart = {
        labels: [],
        data: [],
        options: {},
        legend: [],
        dataSet: {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }
    };

    function init() {
        locale.ready(['common', 'statistics']).then(function () {
            vm.stats = {
                guestlists: {
                    'rsvp-status': {
                        sourceUrl: 'guestlists/rsvp/status',
                        sourceType: 'count',
                        acceptedParams: [
                            'guestlist_id'
                        ],
                        types: [
                            'pie',
                            'table'
                        ],
                        labelKey: 'status',
                        labels: {
                            unknown: {
                                text: locale.getString('statistics.rsvp.status.labels.unknown'),
                                icon: 'pe-7s-help1',
                                color: '#E83FF4'
                            },
                            requested: {
                                text: locale.getString('statistics.rsvp.status.labels.requested'),
                                icon: 'pe-7s-help1',
                                color: '#E83FF4'
                            },
                            listed: {
                                text: locale.getString('statistics.rsvp.status.labels.listed'),
                                icon: 'pe-7s-menu',
                                color: '#00CFF3'
                            },
                            invited: {
                                text: locale.getString('statistics.rsvp.status.labels.invited'),
                                icon: 'pe-7s-mail',
                                color: '#FFA000'
                            },
                            confirmed: {
                                text: locale.getString('statistics.rsvp.status.labels.confirmed'),
                                icon: 'pe-7s-check',
                                color: '#6AD600'
                            },
                            cancelled: {
                                text: locale.getString('statistics.rsvp.status.labels.cancelled'),
                                icon: 'pe-7s-close-circle',
                                color: '#FF0039'
                            },
                            waitlisted: {
                                text: locale.getString('statistics.rsvp.status.labels.waitlisted'),
                                icon: 'pe-7s-hourglass',
                                color: '#F4F43F'
                            },
                            pending: {
                                text: locale.getString('statistics.rsvp.status.labels.pending'),
                                icon: 'pe-7s-help1',
                                color: '#E83FF4'
                            }
                        },
                        chartOptions: {},
                        dataSetOptions: {
                            general: {
                                borderWidth: 0
                            }
                        }
                    },
                    'rsvp-sex': {
                        sourceUrl: 'guestlists/rsvp/sex',
                        sourceType: 'count',
                        acceptedParams: [
                            'guestlist_id'
                        ],
                        types: [
                            'pie',
                            'table'
                        ],
                        labelKey: 'sex',
                        labels: {
                            unknown: {
                                text: locale.getString('statistics.contacts.sex.labels.unknown'),
                                icon: 'fa-question',
                                color: '#ffa534'
                            },
                            female: {
                                text: locale.getString('statistics.contacts.sex.labels.female'),
                                icon: 'fa-venus',
                                color: '#fb3f4b'
                            },
                            various: {
                                text: locale.getString('statistics.contacts.sex.labels.various'),
                                icon: 'fa-transgender',
                                color: '#40c4f1'
                            },
                            male: {
                                text: locale.getString('statistics.contacts.sex.labels.male'),
                                icon: 'fa-mars',
                                color: '#8b5ed9'
                            }
                        },
                        chartOptions: {},
                        dataSetOptions: {
                            general: {
                                borderWidth: 0
                            }
                        }
                    },
                    'rsvp-field': {
                        sourceUrl: 'guestlists/rsvp/field',
                        sourceType: 'count',
                        acceptedParams: [
                            'guestlist_id',
                            'field'
                        ],
                        types: [
                            'pie',
                            'table'
                        ],
                        labelKey: 'value',
                        labels: {},
                        chartOptions: {},
                        dataSetOptions: {
                            general: {
                                borderWidth: 0
                            }
                        }
                    },
                    'rsvp-checked-in-field': {
                        sourceUrl: 'guestlists/rsvp/field/checked-in',
                        sourceType: 'count',
                        acceptedParams: [
                            'guestlist_id',
                            'field'
                        ],
                        types: [
                            'pie',
                            'table'
                        ],
                        labelKey: 'value',
                        labels: {},
                        chartOptions: {},
                        dataSetOptions: {
                            general: {
                                borderWidth: 0
                            }
                        }
                    },
                    'rsvp-quota': {
                        sourceUrl: 'guestlists/rsvp/quota',
                        sourceType: 'count',
                        types: [
                            'count-bar',
                            'pie'
                        ],
                        acceptedParams: [
                            'guestlist_id'
                        ],
                        labelKey: 'type',
                        labels: {
                            max_count: {
                                text: locale.getString('statistics.guestlists.rsvp-quota.labels.max_count'),
                                order: 1,
                                color: '#E83FF4',
                                useColorInBar: false
                            },
                            cur_count: {
                                text: locale.getString('statistics.guestlists.rsvp-quota.labels.cur_count'),
                                order: 2,
                                color: '#F4F43F',
                                useColorInBar: false
                            },
                            free_spaces_not_needed: {
                                text: locale.getString('statistics.guestlists.rsvp-quota.labels.free_spaces'),
                                order: 3,
                                color: '#23ccef',
                                useColorInBar: false
                            },
                            free_spaces_green: {
                                text: locale.getString('statistics.guestlists.rsvp-quota.labels.free_spaces'),
                                order: 3,
                                color: '#6AD600',
                                useColorInBar: true
                            },
                            free_spaces_orange: {
                                text: locale.getString('statistics.guestlists.rsvp-quota.labels.free_spaces'),
                                order: 3,
                                color: '#ffa534',
                                useColorInBar: true
                            },
                            free_spaces_red: {
                                text: locale.getString('statistics.guestlists.rsvp-quota.labels.free_spaces'),
                                order: 3,
                                color: '#FF0039',
                                useColorInBar: true
                            }
                        }
                    },
                    'checkins': {
                        sourceUrl: 'guestlists/checkins',
                        sourceType: 'time-line',
                        acceptedParams: [
                            'guestlist_id',
                            'grouping',
                            'start_date',
                            'end_date'
                        ],
                        types: [
                            'line'
                        ],
                        chartOptions: {
                            scales: {
                                yAxes: [
                                    {
                                        type: 'linear',
                                        display: true,
                                        position: 'left'
                                    }
                                ]
                            }
                        }
                    },
                    'checkins-latest': {
                        sourceUrl: 'guestlists/checkins/latest',
                        sourceType: 'table',
                        acceptedParams: [
                            'guestlist_id',
                            'count'
                        ],
                        types: [
                            'table'
                        ],
                        columns: [
                            {
                                key: 'contact',
                                label: 'contact'
                            },
                            {
                                key: 'guestlist_name',
                                label: 'guestlist',
                                linked: true,
                                linkParams: {
                                    gid: 'guestlist_id'
                                },
                                linkRoute: 'app.guestlists.rsvps.settings'
                            },
                            {
                                key: 'time',
                                label: 'Datum',
                                date: true,
                                date_format: 'dd. MM. yyyy HH:mm' // see https://docs.angularjs.org/api/ng/filter/date
                            }
                        ],
                        chartOptions: {}
                    },
                    'active-stats': {
                        sourceUrl: 'guestlists/active/stats',
                        sourceType: 'table',
                        acceptedParams: [
                            'guestlist_id'
                        ],
                        types: [
                            'table'
                        ],
                        columns: [
                            {
                                key: 'guestlist_name',
                                label: 'guestlist',
                                linked: true,
                                linkParams: {
                                    gid: 'guestlist_id'
                                },
                                linkRoute: 'app.guestlists.rsvps.settings'
                            },
                            {
                                key: 'overall',
                                label: 'Overall Rsvps'
                            },
                            {
                                key: 'main',
                                label: 'Main rsvps'
                            },
                            {
                                key: 'guests',
                                label: 'Guest rsvps'
                            }
                        ],
                        chartOptions: {}
                    },
                    'dlrg-stats': {
                        sourceUrl: 'guestlists/active/stats',
                        sourceType: 'table',
                        acceptedParams: [
                            'guestlist_id'
                        ],
                        types: [
                            'table'
                        ],
                        columns: [
                            {
                                key: 'guestlist_name',
                                label: 'Kategorie',
                                linked: true,
                                linkParams: {
                                    gid: 'guestlist_id'
                                },
                                linkRoute: 'app.guestlists.rsvps.index'
                            },
                            {
                                key: 'guests',
                                label: 'Bewerbungen'
                            }
                        ],
                        chartOptions: {}
                    }
                },
                contacts: {
                    'sex': {
                        sourceUrl: 'contacts/sex',
                        sourceType: 'count',
                        acceptedParams: [],
                        types: [
                            'pie',
                            'table'
                        ],
                        labelKey: 'sex',
                        labels: {
                            unknown: {
                                text: locale.getString('statistics.contacts.sex.labels.unknown'),
                                icon: 'fa-question',
                                color: '#ffa534'
                            },
                            female: {
                                text: locale.getString('statistics.contacts.sex.labels.female'),
                                icon: 'fa-venus',
                                color: '#fb3f4b'
                            },
                            various: {
                                text: locale.getString('statistics.contacts.sex.labels.various'),
                                icon: 'fa-transgender',
                                color: '#40c4f1'
                            },
                            male: {
                                text: locale.getString('statistics.contacts.sex.labels.male'),
                                icon: 'fa-mars',
                                color: '#8b5ed9'
                            }
                        },
                        chartOptions: {
                            animation: {}
                        },
                        dataSetOptions: {
                            general: {
                                borderWidth: 0
                            }
                        }
                    },
                    'subscriptions': {
                        sourceUrl: 'contacts/subscriptions',
                        sourceType: 'count',
                        acceptedParams: [],
                        types: [
                            'table'
                        ],
                        labelKey: 'subscription',
                        labels: [],
                        chartOptions: {
                            animation: {}
                        },
                        dataSetOptions: {
                            general: {
                                borderWidth: 0
                            }
                        }
                    }
                },
                messages: {
                    'latest': {
                        sourceUrl: 'messages/latest',
                        sourceType: 'table',
                        acceptedParams: [
                            'count'
                        ],
                        types: [
                            'table'
                        ],
                        columns: [
                            {
                                key: 'subject',
                                label: 'subject'
                            },
                            {
                                key: 'contact',
                                label: 'contact'
                            },
                            {
                                key: 'type',
                                label: 'type'
                            },
                            {
                                key: 'date',
                                label: 'Datum',
                                date: true,
                                date_format: 'dd. MM. yyyy HH:mm' // see https://docs.angularjs.org/api/ng/filter/date
                            },
                            {
                                key: 'status',
                                label: 'status',
                                transformers: {
                                    'scheduled': 'Wait for send'
                                }
                            }
                        ],
                        chartOptions: {}
                    }
                },
                general: {
                    'count-bar': {
                        sourceUrl: 'general/counts',
                        sourceType: 'count-bar',
                        types: [
                            'count-bar'
                        ],
                        labelKey: 'type',
                        labels: {
                            messages: {
                                text: locale.getString('statistics.general.count-bar.labels.messages'),
                                order: 3
                            },
                            contacts: {
                                text: locale.getString('statistics.general.count-bar.labels.contacts'),
                                order: 1
                            },
                            bookings: {
                                text: locale.getString('statistics.general.count-bar.labels.bookings'),
                                order: 2
                            }
                        }
                    }
                }
            };

            initParameters();
            initWatchers();
            if (!vm.error) {
                updateChartInformation();
            }
        });
    }

    function initWatchers() {
        $scope.$watch(() => {
            return vm.refreshIndex;
        }, () => {
            if(!vm.loading) {
                updateChartInformation();
            }
        })
    }

    function initParameters() {
        if (vm.stats[vm.group] && vm.stats[vm.group][vm.source]) {
            vm.currentDefinition = vm.stats[vm.group][vm.source];
            vm.chart = {
                labels: [],
                data: [],
                options: {},
                legend: [],
                dataSet: {
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }
            };
        } else {
            vm.error = true;
            vm.loading = false;
            vm.errorMessage = 'Stat does not exist';
        }
    }

    function updateChartInformation() {
        $http({
            method: 'POST',
            url: Env.apiUrl + '/stats/' + vm.currentDefinition.sourceUrl,
            data: prepareRequestParams()
        }).then(function (response) {
            vm.error = false;
            vm.chart.data = [];
            switch (vm.currentDefinition.sourceType) {
                case 'count':
                    prepareCountChartData(response.data);
                    break;
                case 'time-line':
                    prepareTimeLineChartData(response.data);
                    break;
                case 'table':
                    prepareTableChartData(response.data);
                    break;
                case 'count-bar':
                    prepareCountBarChartData(response.data);
                    break;
            }
            vm.loading = false;
        }, function (response) {
            vm.errorMessage = 'Error while loading stats';
            vm.error = true;
            vm.loading = false;
        });
    }

    function prepareCountChartData(data) {
        data.counts.sort(function compare(a, b) {
            if (a.count > b.count)
                return -1;
            if (a.count < b.count)
                return 1;

            return 0;
        });

        var dataSet = {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        };

        if (vm.currentDefinition.dataSetOptions && vm.currentDefinition.dataSetOptions.general) {
            _.forEach(vm.currentDefinition.dataSetOptions.general, function (value, key) {
                dataSet[key] = value;
            });
        }

        var tempData = [];

        _.forEach(data.counts, function (value, countIndex) {
            var curLegendData = {
                text: value[vm.currentDefinition.labelKey],
                icon: '',
                color: vm.defaultColors[countIndex],
                value: value.count,
                useColorInBar: false
            };

            var curLabelData = vm.currentDefinition.labels[value[vm.currentDefinition.labelKey]];
            if (curLabelData) {
                var fieldsToCopyOver = [
                    'text',
                    'icon',
                    'color',
                    'order',
                    'useColorInBar'
                ];

                _.forEach(fieldsToCopyOver, function (field) {
                    if (curLabelData[field]) {
                        curLegendData[field] = curLabelData[field];
                    }
                });

            }

            tempData.push(curLegendData);
        });

        if (vm.type == 'count-bar') {
            tempData = $filter('orderBy')(tempData, 'order');
        }

        _.forEach(tempData, function (curLegendData) {
            dataSet.data.push(curLegendData.value);
            dataSet.backgroundColor.push(curLegendData.color);
            dataSet.hoverBackgroundColor.push(curLegendData.color);
            vm.chart.data.push(curLegendData.value);
            vm.chart.legend.push(curLegendData);
            vm.chart.labels.push(curLegendData.text);
        });
        vm.chart.dataSet = dataSet;
    }

    function prepareCountBarChartData(data) {
        var counts = [];
        _.forEach(data.counts, function (value) {
            counts.push({
                label: vm.currentDefinition.labels[value[vm.currentDefinition.labelKey]].text || '',
                count: value.count,
                order: vm.currentDefinition.labels[value[vm.currentDefinition.labelKey]].order || 1
            });
        });

        counts.sort(function compare(a, b) {
            if (a.order < b.order)
                return -1;
            if (a.order < b.order)
                return 1;

            return 0;
        });

        _.forEach(counts, function (value) {
            vm.chart.data.push(value.count);
            vm.chart.labels.push(value.label);
        });
    }

    function prepareTimeLineChartData(data) {
        var dataSets = [[]];
        _.forEach(data.counts, function (value) {
            dataSets[0].push(value.count);
            vm.chart.labels.push(value.calculated);
        });
        vm.chart.data = dataSets;
    }

    function prepareTableChartData(data) {
        _.forEach(data.entries, function (entryValue, entryKey) {
            var currentSet = [];
            _.forEach(vm.currentDefinition.columns, function (colInfo) {
                if (entryKey == 0) {
                    vm.chart.labels.push(colInfo.label);
                }

                var cellContent = entryValue[colInfo.key];
                if (colInfo.transformers && colInfo.transformers[cellContent]) {
                    cellContent = colInfo.transformers[cellContent];
                } else if (colInfo.date) {
                    var date = new Date(cellContent);
                    cellContent = $filter('date')(date, colInfo.date_format);
                }

                var currentCell = {
                    linked: (!_.isUndefined(colInfo.linked)) ? colInfo.linked : false,
                    text: cellContent
                };

                if (currentCell.linked) {
                    currentCell.linkData = {
                        route: colInfo.linkRoute,
                        params: {}
                    };

                    _.forEach(colInfo.linkParams, function (value, key) {
                        if (entryValue[value]) {
                            currentCell.linkData.params[key] = entryValue[value];
                        }
                    });
                }

                currentSet.push(currentCell);
            });
            vm.chart.data.push(currentSet);
        });

        vm.chart.options.tableHead = true;
    }

    function prepareLabel(key) {
        return vm.currentDefinition.labels[key].text;
    }

    function prepareRequestParams() {
        var out = {};

        if (vm.params) {
            _.forEach(vm.params, function (value, key) {
                if (vm.currentDefinition.acceptedParams.indexOf(key) > -1) {
                    out[key] = value;
                }
            });
        }

        return out;
    }

    function followLink(linkData) {
        $state.go(linkData.route, linkData.params);
    }

    init();
}
