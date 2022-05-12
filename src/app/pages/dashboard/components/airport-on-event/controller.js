import getLoggedIn from '../../../../store/users/actions/get-loggedin';

class AirportOnEventDashboardController {
    constructor(scope, Guestlists, $http, Users, $interval) {
        this.scope = scope;
        this.api = $http;
        this.users = Users;
        this.interval = $interval;
        this.guestlists = [];
        this.currentGuestlist = null;
        this.loading = true;
        this.displayType = 'checkin';
        this.checkedInRate = 0;
        this.internalUpdateCount = 0;
        this.store = Guestlists.reset({
            persists: false,
            listview: 'DashboardGuestlistListView'
        });
        this.countLocations = [];
        this.store.commit('setFilters', []);
        this.refreshIndex = 0;
        this.acceptPusher = true;
        this.init();
    }

    init() {
        this.updateGuestlists().then(() => {
            this.loading = false;
            this.apply();
        }, () => {
            this.apply();
        });

        this.users.dispatch('getLoggedIn').then((user, p2, p3) => {
            this.users.state.pusher.bind('count-update', (data) => {
                if (this.currentGuestlist && data.guestlist_id === this.currentGuestlist.id) {
                    this.countLocations = data.current_counts;
                    if(this.acceptPusher) {
                        console.log('refresh on count');
                        this.acceptPusher = false;
                        this.refreshIndex++;
                    }
                    this.apply();
                }
            });

            this.users.state.pusher.bind('new-checkin', (data) => {
                if (this.currentGuestlist && data.guestlist_id === this.currentGuestlist.id) {
                    this.currentGuestlist.sum_pax_actual = data.guestlist_stats.sum_pax_actual;
                    this.currentGuestlist.sum_pax_planned = data.guestlist_stats.sum_pax_planned;
                    this.checkedInRate = 0;
                    if (this.currentGuestlist.sum_pax_actual > 0) {
                        this.checkedInRate = Math.ceil((this.currentGuestlist.sum_pax_actual / this.currentGuestlist.sum_pax_planned) * 100);
                    }
                    if(this.acceptPusher) {
                        console.log('refresh on checkin');
                        this.acceptPusher = false;
                        this.refreshIndex++;
                    }
                    this.apply();
                }
            });
        }, (e) => {
            console.log(e);
        });

        this.interval(() => {
            this.acceptPusher = true;
            console.log('reenable pusher');
        }, 10000);
    }

    updateGuestlists() {
        this.guestlists = [];
        const colsToSelect = [
            'name',
            'date',
            'id',
            'count_rsvps_confirmed',
            'sum_pax_planned',
            'sum_pax_actual'
        ];


        return new Promise((resolve, reject) => {
            this.store.dispatch('getDefinitions').then(() => {
                let newColumns = [];
                _.forEach(this.store.getters.columns, function (curCol) {
                    curCol.visible = colsToSelect.indexOf(curCol.key) > -1;

                    newColumns.push(curCol);
                });
                this.store.commit('setColumns', newColumns);
                let sort = {
                    date: 'asc'
                };
                this.store.commit('setSort', sort);

                this.store.dispatch('getData').then(() => {
                    this.guestlists = this.store.state.data;
                    if (!this.currentGuestlist || this.guestlists.indexOf(this.currentGuestlist) === -1) {
                        this.setDefaultGuestlist();
                    }
                    resolve(this.guestlists);
                }, (e) => {
                    reject(e);
                });
            }, (e) => {
                reject(e);
            });
        });
    }

    setDefaultGuestlist() {
        const currentDate = new Date();

        _.forEach(this.guestlists, (guestlist) => {
            const guestlistDate = new Date(guestlist.date);

            if (guestlistDate.getFullYear() === currentDate.getFullYear()
                && guestlistDate.getMonth() === currentDate.getMonth()
                && guestlistDate.getDate() === currentDate.getDate()
            ) {
                this.selectGuestlist(guestlist);
            }
        });

        if(!this.currentGuestlist && this.guestlists.length > 0) {
            this.selectGuestlist(this.guestlists[0]);
        }
    }

    selectGuestlist(guestlist, noReload) {
        this.currentGuestlist = guestlist;
        this.countLocations = [];
        this.loading = !noReload;
        this.checkedInRate = 0;
        this.refreshIndex = 0;
        if (this.currentGuestlist.sum_pax_actual > 0) {
            this.checkedInRate = Math.ceil((this.currentGuestlist.sum_pax_actual / this.currentGuestlist.sum_pax_planned) * 100);
        }
        this.api.get('guestlists/' + this.currentGuestlist.id + '/counts').then((response) => {
            this.countLocations = response.data.data;
            this.loading = false;
        }, () => {
            this.loading = false;
            console.log('error while loading counts');
        });
        this.scope.$evalAsync();
    }

    apply() {
        this.scope.$evalAsync();
    }
}

AirportOnEventDashboardController.$inject = [
    '$scope',
    'Guestlists',
    '$http',
    'Users',
    '$interval'
];

angular
    .module('airlst.dashboard')
    .controller('AirportOnEventDashboardController', AirportOnEventDashboardController);
