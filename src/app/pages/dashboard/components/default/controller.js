class DashboardDefaultController {
    constructor(scope, Guestlists, Acl) {
        this.scope = scope;
        this.acl = Acl;

        this.guestlists = [];
        this.currentGuestlist = null;
        this.loading = true;
        this.displayType = 'checkin';
        this.checkedInRate = 0;
        this.store = Guestlists.reset({
            persists: false,
            listview: 'DashboardGuestlistListView'
        });
        this.store.commit('setFilters', []);
        this.init();
    }

    init() {
        this.updateGuestlists().then(() => {
            this.loading = false;
            this.apply();
        }, () => {
            this.apply();
        });
    }

    updateGuestlists() {
        this.guestlists = [];
        const colsToSelect = [
                'name',
                'date',
                'id',
                'count_rsvps_confirmed',
                'sum_pax_planned_confirmed',
                'sum_pax_actual_confirmed'
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
                        this.selectGuestlist(this.guestlists[0]);
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

    selectGuestlist(guestlist) {
        this.currentGuestlist = guestlist;
        const guestlistDate = new Date(this.currentGuestlist),
            currentDate = new Date();
        this.checkedInRate = 0;
        if (this.currentGuestlist.sum_pax_actual_confirmed > 0) {
            this.checkedInRate = Math.ceil((this.currentGuestlist.sum_pax_actual_confirmed / this.currentGuestlist.sum_pax_planned_confirmed) * 100);
        }

        if (guestlistDate.getFullYear() < currentDate.getFullYear()
            || (
                (guestlistDate.getFullYear() === currentDate.getFullYear())
                && (guestlistDate.getMonth() < currentDate.getMonth())
            )
            || (
                (guestlistDate.getFullYear() === currentDate.getFullYear())
                && (guestlistDate.getMonth() === currentDate.getMonth())
                && (guestlistDate.getDay() <= currentDate.getDay())
            )
        ) {
            this.displayType = 'checkin';
        } else {
            this.displayType = 'default';
        }
        this.scope.$evalAsync();
    }

    apply() {
        this.scope.$evalAsync();
    }
}

DashboardDefaultController.$inject = [
    '$scope',
    'Guestlists',
    'Acl'
];


angular
    .module('airlst.dashboard')
    .controller('DashboardDefaultController', DashboardDefaultController);
