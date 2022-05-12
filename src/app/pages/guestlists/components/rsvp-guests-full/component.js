import templateUrl from './component.tpl.html';

class RsvpGuestsFullCtrl {
    constructor(Rsvps, $scope) {
        this.rsvpsStore = Rsvps.create('RsvpGuestBaseStore');
        this.scope = $scope;

        this.rsvp = null;

        this._initWatchers();
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.rsvp;
        }, () => {
            if (this.rsvp) {
                this._resetStore();
            }
        }, true)
    }

    _resetStore() {
        this.store = this.rsvpsStore.reset({
            persist: false,
            listview: 'Rsvp' + this.rsvp.id + 'Guests'
        });

        this.store.commit('setSlug', 'rsvps/' + this.rsvp.id + '/child');
        this.store.commit('setTitle', 'Guests of rsvp #' + this.rsvp.code + ' (' + this.rsvp.contact.data.full_name + ')');
        this.store.commit('setEmptyListActions', [
            'quick-add-contact'
        ]);
        this.store.commit('setPermanentFilters', {
            guestlist_id: this.rsvp.guestlist_id,
            parent_rsvp_id: this.rsvp.id
        });
        this.store.resetGetters();

        this.store.commit('setVisible', [
            'contact.full_name',
            'contact.email',
            'status',
            'code'
        ]);
        this.store.commit('setSort', {'contact.full_name': 'asc'});
        this.store.commit('setVm', this);
         this.store.dispatch('loadWorkflows', 'rsvps::list-guests');
    }
}

RsvpGuestsFullCtrl.$inject = [
    'Rsvps',
    '$scope'
];

angular
    .module('airlst.guestlists')
    .component('rsvpGuestsFull', {
        bindings: {
            rsvp: '<'
        },
        controller: RsvpGuestsFullCtrl,
        controllerAs: 'vm',
        templateUrl: templateUrl
    });

