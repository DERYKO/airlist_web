export default class RsvpsDuplicatesExtendedListViewCtrl {
    get row() {
        return this._row;
    }

    set row(value) {
        this._row = value;
    }

    constructor($injector, $scope) {
        this.injector = $injector;
        this.scope = $scope;
        this.row = null;
        this.api = this.injector.get('$http');
        this.growl = this.injector.get('growl');
        this.filter = this.injector.get('$filter');
        this.alert = this.injector.get('Alert');
        this.state = this.injector.get('$state');
        this.loading = true;
        this.noDuplicatesStates = {};
        this._initWatchers();
    }

    setRow(row) {
        this._row = row;
        this._updateNoDuplicateStates();
        this.init();
    }

    setStore(store) {
        this.store = store;
        this.init();
    }

    init() {
        if (this.row && this.store) {
            this.loadData();
        }
    }

    loadData() {
        this.guestlist = this.store.state.vm.guestlist;

        this.rsvpsStore = this.injector.get('Rsvps').create({
            persist: false,
            listview: `Guestlist${this.guestlist.id}PreviewListView`,
        });

        this.rsvpsStore.commit('setPrefix', `guestlists/${this.guestlist.id}`);

        this.rsvpsStore.dispatch('getDefinitions').then(() => {
            const guestlistFields = _.map(this.guestlist.settings.registration_fields, (field) => {
                return field.slug.replace('rsvp.', '');
            });

            guestlistFields.push('created_at');
            guestlistFields.push('status');

            const columns = this.rsvpsStore.getters.columns;
            _.each(columns, (col) => {
                col.visible = guestlistFields.indexOf(col.key) !== -1;
            });
            this.rsvpsStore.commit('setColumns', columns);

            this._doMainStoreUpdate();
        })
    }

    confirmNDeleteRsvp(row) {
        this.alert.confirm({
            title: 'Confirm Deletion',
            message: `Do you really want to delete this guest? Please note that guests of guest are also deleted if they are attached.`,
            type: 'warning',
            confirmBtn: 'Delete',
            closeOnConfirm: true,
            wait: false
        }).then(() => {
            this.api.delete(`rsvps/${row.id}`)
                .then(() => {
                    this.growl.success(`Successfully deleted rsvp`, {title: 'Success'});
                    this._doMainStoreUpdate();
                }, () => {
                    this.growl.error(`Error while deleting rsvp`, {title: 'Success'});
                    this._doMainStoreUpdate();
                });
        }, () => {

        });
    }

    editRsvp(row) {
        this.state.go('app.guestlists.rsvps.edit', {
            id: row.id,
            gid: this.guestlist.id
        })
    }

    checkIfIdIsNew(id) {
        let entityInformation = _.first(this.filter('filter')(this.row.duplicate_information.entities, {id: id}));

        if (entityInformation) {
            return entityInformation.is_new;
        }

        return false;
    }

    getUnresolvedCount() {
        return _.filter(this.noDuplicatesStates).length;
    }

    _updateNotADuplicateStateOfId(id, newState) {
        const requestData = {
            identifier: this.row.duplicate_information.identifier,
            primary: id,
            table: this.store.state.slug
        };
        let promise;

        if(!newState) {
            promise = this.api.post(`fp/duplicates/no-duplicate`, requestData);
        } else {
            promise = this.api.delete(`fp/duplicates/no-duplicate`, {
                data: requestData,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
        }

        promise.then(() => {
            this._doMainStoreUpdate();
        }, () => {
            this.growl.error('Error while marking as no duplicate', {title: 'Error'});
            this._doMainStoreUpdate();
        });
    }

    _updateDuplicateStates(newValues, oldValues) {
        _.each(newValues, (state, id) => {
            if(state !== oldValues[id]) {
                this._updateNotADuplicateStateOfId(id, state);
            }
        });
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.noDuplicatesStates;
        }, (newValue, oldValue) => {
            this._updateDuplicateStates(newValue, oldValue);
        }, true);
    }

    _updateNoDuplicateStates() {
        this.noDuplicatesStates = {};

        _.each(this.row.duplicate_information.entities, (row) => {
            this.noDuplicatesStates[row.id] = row.is_new;
        });
    }

    _doMainStoreUpdate() {
        if (this.store) {
            this.store.dispatch('getData').then(() => {
                this._updateRowFromStore();
                this._justReloadData();
                this.scope.$applyAsync();
            });
        }
    }

    _justReloadData() {
        this.rsvpsStore.commit('unsetFilter', {key: 'id'});
        this.rsvpsStore.commit('setFilter', {
            key: 'id',
            value: _.map(this.row.duplicate_information.entities, (entity) => {
                return entity.id;
            }).join(' OR ')
        });

        this.rsvpsStore.dispatch('getData').then(() => {
            this._calculateDifferentValueColumns();
            this.loading = false;
        })
    }

    _updateRowFromStore() {
        let currentIdentifier = this.row.duplicate_information.identifier,
            newRow = _.first(this.filter('filter')(this.store.state.data, {duplicate_information: {identifier: currentIdentifier}}));

        if (newRow) {
            this.row = newRow;
        }
    }

    _calculateDifferentValueColumns() {
        this.differentValueColumns = [];
        _.each(this.rsvpsStore.getters.visibleColumns, (col) => {
            if (this.checkIfColHasDifferentValues(col.key)) {
                this.differentValueColumns.push(col.key);
            }
        });
    }

    checkIfColHasDifferentValues(colKey) {
        let availableValues = [];

        _.each(this.rsvpsStore.state.data, (row) => {
            availableValues.push(_.get(row, colKey));
        });

        return _.intersection(availableValues).length > 1;
    }

    goToView(newView) {
        this.currentView = newView;
    }
}
