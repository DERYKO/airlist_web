import Rsvps from '../../../../../store/rsvps';
import templateUrl from './contact-rsvps.tpl.html';

class ContactRsvpsCtrl {

    constructor(Rsvps, $state, $stateParams, addContactToGuestlist) {
        this.rsvps = Rsvps;
        this.state = $state;
        this.params = _.cloneDeep($stateParams);
        this.params.tab = 'rsvps';
        this.addAction = addContactToGuestlist;
    }

    $onInit() {
        this.loadRsvps();
    }


    loadRsvps() {
        const $state = this.state;
        const params = this.params;
        this.store = this.rsvps.create('RsvpsListview' + this.contact.id);

        this.store.commit('disableExtendedListView');
        this.store.commit('setPermanentFilters', {'contact.id': this.contact.id});
        this.store.commit('setVisible', ['guestlist.name', 'guestlist.date', 'pax_planned', 'pax_actual', 'status']);

        this.store.commit('addAction', {
            key: 'details',
            text: 'Details',
            level: 'row',
            class: 'btn green',
            action({row}) {
                $state.go('app.guestlists.rsvps.details', {
                    gid: row.guestlist.id,
                    id: row.id,
                    back: $state.current.name,
                    backParams: params
                })
            }
        });
        this.store.commit('addAction', this.addAction);

        this.store.commit('addAction', {
            key: 'show_archived',
            text: 'Show deleted',
            level: 'settings',
            manager: 'showArchived'
        });

        this.store.commit('setVm', this);
    }

}


ContactRsvpsCtrl.$inject = ['Rsvps', '$state', '$stateParams', 'addContactToGuestlist'];


angular
    .module('airlst.contacts')
    .component('contactRsvps', {
        bindings: {
            contact: '='
        },
        controller: ContactRsvpsCtrl,
        controllerAs: 'vm',
        templateUrl: templateUrl
    });