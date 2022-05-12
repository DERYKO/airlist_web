export default class GuestlistEditController {
    constructor($injector, $scope) {
        this.injector = $injector;
        this.scope = $scope;
        this.navService = this.injector.get('NavService');
        this.alert = this.injector.get('Alert');
        this.api = this.injector.get('$http');
        this.acl = this.injector.get('Acl');
        this.angularState = this.injector.get('$state');
        this.stateParams = this.injector.get('$stateParams');

        this.depositService = this.injector.get('Deposit');
        this.editorView = this.stateParams.editorView ? this.stateParams.editorView : 'general';

        this._resetState();
        this._checkStateParams();

        this._loadGuestlist().then(() => {
            this._updateBreadcrumb();
            this._updateState({
                ...this.state,
                loading: false
            });
        });
    }

    onModelUpdate(newData) {
        this._updateState({
            ...this.state,
            model: newData
        });
    }

    submitData() {
        this.api.put(`guestlists/${this.state.guestlist.id}`, this.state.model)
            .then(() => {
                this.alert.success('Sucess', 'Changes have been saved');
                this.goToListView();
            }, (response) => {
                this.alert.handle(response);
            });
    }

    goToListView() {
        if (this.state.backStore) {
            this.state.backStore.dispatch('getData');
        }
        this.angularState.go('app.guestlists.rsvps.index', {
            gid: this.stateParams.gid,
            store: this.state.backStore
        });
    }

    cancel() {
        this.navService.goBack();
    }

    _checkStateParams() {
        if (this.stateParams.store) {
            this._updateState({
                ...this.state,
                backStore: this.stateParams.store
            });
        }
    }

    _loadGuestlist() {
        return this.api.get(`guestlists/${this.stateParams.gid}`)
            .then((response) => {
                this._updateState({
                    ...this.state,
                    guestlist: _.cloneDeep(response.data.data)
                });
            }, () => {
                this.alert.error('Not found', 'The requested guestlists was not found in system');
                this.angularState.go('app.guestlists.index');
            });
    }

    _updateBreadcrumb() {
        if (this.state.guestlist) {
            this.navService.setBreadcrumbParameters({
                guestlist_name: this.state.guestlist.name
            });

            this.navService.setGoBackAction(() => {
                const params = (this.stateParams.backParams && this.stateParams.backParams.gid) ? this.stateParams.backParams : {
                    gid: this.state.guestlist.id,
                    store: this.state.backStore
                };

                if (this.state.backStore) {
                    params.store = this.state.backStore;
                }

                return this.state.go($stateParams.back, params);
            })
        }
    }

    _updateState(newState) {
        this.state = newState;
    }

    _resetState() {
        this._updateState({
            loading: true,
            model: null,
            guestlist: null,
            backStore: null
        });
    }
}

GuestlistEditController.$inject = [
    '$injector',
    '$scope'
];
