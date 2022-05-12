/**
 * @ngdoc object
 * @name airlst.controller:RsvpsImportCtrlCtrl
 *
 * @description
 *
 */

class RsvpsImportCtrl {
    constructor(Rsvps, locale, Alert, $state, $scope, NavService, $stateParams, $http) {
        this.locale = locale;
        this.alert = Alert;
        this.state = $state;
        this.scope = $scope;
        this.navService = NavService;
        this.stateParams = $stateParams;
        this.api = $http;
        this.rsvpStore = Rsvps.create();

        this.updateGuestlistData().then(response => {
            this.setupStore();
            this.setupBreadcrumbs();
        });
    }

    updateGuestlistData() {
        return new Promise((resolve, reject) => {
            this.api.get(`guestlists/${ this.stateParams.gid }`).then((response) => {
                this.guestlist = response.data.data;
                resolve(response);
            }, (e) => {
                reject(e);
            })
        });
    }

    setupBreadcrumbs(NavService) {
        this.scope.$watch(() => {
            return this.guestlist;
        }, () => {
            this.navService.setBreadcrumbParameters({
                guestlist_name: this.guestlist.name
            });
        });

        this.navService.setBreadcrumbParameters({
            guestlist_name: this.guestlist.name
        });
    }

    setupStore() {
        this.rsvpStore.commit('setPrefix', 'guestlists/' + this.state.params.gid);
        this.rsvpStore.dispatch('getDefinitions')
            .then(() => {
                this.fields = _.keyBy(this.rsvpStore.state.columns, 'key');
            });
    }

    onSuccess() {
        this.state.go('app.guestlists.rsvps.index');
    }

    onFailure(response) {
        this.alert.error(this.locale.getString('sweetalerts.import_unsuccessful_title'), response.message);
    }
}

angular
    .module('airlst.guestlists')
    .controller('RsvpsImportCtrl', [
        'Rsvps',
        'locale',
        'Alert',
        '$state',
        '$scope',
        'NavService',
        '$stateParams',
        '$http',
        RsvpsImportCtrl
    ]);
