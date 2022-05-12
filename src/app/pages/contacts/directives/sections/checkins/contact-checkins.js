import Checkins from '../../../../../store/checkins';
import templateUrl from './contact-checkins.tpl.html';
import showCheckInModalTemplate from './show-checkin-modal.tpl.html';

class ContactCheckinsCtrl {

    constructor(Checkin, $injector) {
        this.model = Checkin;
        this.injector = $injector;
    }

    $onInit() {
        this.loadCheckins();
    }


    loadCheckins() {
        this.store = new Checkins(this.model, {injector: this.injector });

        this.store.commit('setPermanentFilters', {'contact.id': this.contact.id});
        this.store.commit('setVisible', [ 'rsvp.pax_planned', 'rsvp.pax_actual' ,'pax_new', 'pax_old', 'location']);

        this.store.commit('addAction', {
            key: 'details',
            text: 'Details',
            level: 'row',
            class: 'btn green',
            action: this.showCheckin
        });

        this.store.commit('addAction', {
            key: 'show_archived',
            text: 'Show deleted',
            level: 'settings',
            manager: 'showArchived'
        });

        this.store.commit('setVm', this);
    }


    showCheckin(payload, store) {
        store.ng.injector.get('$uibModal').open({
            animation: true,
            size: 'lg',
            templateUrl: showCheckInModalTemplate,
            controller: ['checkin', '$uibModalInstance', function (checkin, $uibModalInstance) {
                this.checkin = checkin;
                this.close = function () {
                    $uibModalInstance.dismiss();
                }
            }],
            controllerAs: 'vm',
            resolve: {
                checkin: () => {
                    return store.state.model
                        .one(payload.row.id)
                        .get({include: 'guestlist,contact,parent,children,parent.contact,children.contact'})
                        .then(null, () => {
                            Alert.erorr('Checkin not found');
                        });
                }
            }
        });
    }
}


ContactCheckinsCtrl.$inject = ['Checkin', '$injector'];


angular
    .module('airlst.contacts')
    .component('contactCheckins', {
        bindings: {
            contact: '='
        },
        controller: ContactCheckinsCtrl,
        controllerAs: 'vm',
        templateUrl: templateUrl
    });