export default class DekraDashboardController {
    constructor(Users, $http, $scope, Acl, Guestlists, Rsvps, $state, growl) {
        this.usersStore = Users;
        this.api = $http;
        this.scope = $scope;
        this.acl = Acl;
        this.rsvpsBaseStore = Rsvps;
        this.state = $state;
        this.growl = growl;

        this.loading = true;

        this.oeMapping = [];
        this.oeStats = {};
        this.oeClipboardText = '';

        this.guestlists = [];
        this.currentGuestlist = null;
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
        this._loadOeMapping().then(() => {
            this.updateGuestlists().then(() => {
                this._loadStatsFromApi().then(() => {
                    this.loading = false;
                    this.apply();
                }, (e) => {
                    console.log('error here 1', e);
                    this.apply();
                });
            }, (e) => {
                console.log('error here 2', e);
                this.apply();
            });
        }, (e) => {
            console.log('error here 3', e);
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
        this.loading = true;
        this._loadStatsFromApi().then(() => {
            this.loading = false;
            this.scope.$applyAsync();
        });
    }

    apply() {
        this.scope.$applyAsync();
    }

    _loadOeMapping() {
        return this.usersStore.dispatch('getLoggedIn').then(() => {
            this.oeMapping = _.get(this.usersStore.state.company, 'settings.core.custom_json_config.oe_mapping');

            this.oeMapping.sort((a, b) => {
                if (a.oe_number < b.oe_number) {
                    return -1;
                }
                if (a.oe_number > b.oe_number) {
                    return 1;
                }
                return 0;
            });
            this._updateClipboardText();
            this.apply();
        });
    }

    _loadStatsFromApi() {
        this.oeStats = {};

        return this.api.post('stats/guestlists/rsvp/sum-by-field-and-status', {
            guestlist_id: this.currentGuestlist.id,
            field: 'contacts.custom_1'
        }).then((response) => {
            _.each(response.data.sums, (row) => {
                this.oeStats[row.value] = {
                    sum_all: row.sum_all,
                    sum_invited: row.sum_invited,
                    sum_confirmed: row.sum_confirmed,
                    sum_cancelled: row.sum_cancelled,
                    sum_checked_in: row.sum_checked_in
                }
            });

            this._updateClipboardText();
        });
    }

    goToRsvpListAndFilterOeNumber(oeNumber) {
        const store = this.rsvpsBaseStore.create('GuestlistView' + this.currentGuestlist.id);

        const visibleFields = store.state.visible;
        if (visibleFields.indexOf('contact.custom_1') === -1) {
            visibleFields.push('contact.custom_1');
            store.commit('setVisible', visibleFields);
        }

        store.commit('setFilter', {
            key: 'contact.custom_1',
            value: oeNumber
        });

        store.dispatch('saveState');

        this.state.go('app.guestlists.rsvps.index', {
            gid: this.currentGuestlist.id,
            store: store
        });

    }

    clipboardSuccess() {
        this.growl.success('Just go to excel and paste the contents', {title: 'Copied'});
    }

    clipboardError() {
        this.growl.success('', {title: 'Error while copy'});
    }

    _tsvFromArray(data) {
        const rows = [];

        _.each(data, (row, x) => {
            _.each(row, (cell, y) => {
                if (cell && cell.replace)
                    data[x][y] = cell.replace(/\t|\r\n|\r|\n/mg, ' ');
            });
            rows.push(row.join('\t'));
        });

        return rows.join('\r\n');
    }

    _updateClipboardText() {
        this.oeClipboardText = '';
        const dataForExport = [
            [
                'Vorname, Nachname',
                'Firma',
                'Niederlassung',
                'OE-Nr',
                'Anzahl Personen',
                'Invited',
                'Confirmed',
                'Cancelled',
                'Check-Ins'
            ]
        ];
        _.each(this.oeMapping, (oeRow) => {
            if (_.get(this.oeStats, `${oeRow.oe_number}.sum_all`, 0) > 0) {
                dataForExport.push([
                    oeRow.first_name + ' ' + oeRow.last_name,
                    oeRow.company,
                    oeRow.department,
                    oeRow.oe_number,
                    ''+_.get(this.oeStats, `${oeRow.oe_number}.sum_all`, 0),
                    ''+_.get(this.oeStats, `${oeRow.oe_number}.sum_invited`, 0),
                    ''+_.get(this.oeStats, `${oeRow.oe_number}.sum_confirmed`, 0),
                    ''+_.get(this.oeStats, `${oeRow.oe_number}.sum_cancelled`, 0),
                    ''+_.get(this.oeStats, `${oeRow.oe_number}.sum_checked_in`, 0)
                ]);
            }
        });
        if(dataForExport.length > 0) {
            this.oeClipboardText = this._tsvFromArray(dataForExport);
        }
    }
}

DekraDashboardController.$inject = [
    'Users',
    '$http',
    '$scope',
    'Acl',
    'Guestlists',
    'Rsvps',
    '$state',
    'growl'
];
