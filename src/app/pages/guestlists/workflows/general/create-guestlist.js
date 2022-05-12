import GuestlistCreateModalController from '../../../../modules/guestlists/controllers/modals/create-modal-controller';
import GuestlistAfterCreateModalController
    from '../../../../modules/guestlists/controllers/modals/after-create-modal-controller';
import createModalTemplate from '../../../../modules/guestlists/views/modals/create-modal.tpl.html';
import afterCreateModalTemplate from '../../../../modules/guestlists/views/modals/after-create-modal.tpl.html';

class createGuestlist {
    constructor($state, $uibModal, Alert, $translate) {
        this.key = 'create-guestlist';
        this.title = 'Create a new guestlist';
        this.level = 'highlight';
        this.icon = 'plus-circle';
        this.order = 10;
        this.state = $state;
        this.uibModal = $uibModal;
        this.alert = Alert;
        this.translate = $translate;
    }

    action({}, store) {
        return this.uibModal.open({
            controller: GuestlistCreateModalController,
            controllerAs: 'vm',
            templateUrl: createModalTemplate
        }).result.then((data) => {
            const guestlistData = data.guestlist;

            this.alert.success(this.translate.instant('guestlists.workflows.create-guestlist.messages.created.title'), this.translate.instant('guestlists.workflows.create-guestlist.messages.created.message'));
            this.state.go('app.guestlists.rsvps.index', {gid: guestlistData.id});

            return this.uibModal.open({
                controller: GuestlistAfterCreateModalController,
                controllerAs: 'vm',
                templateUrl: afterCreateModalTemplate,
                resolve: {
                    guestlist: () => {
                        return guestlistData;
                    }
                }
            }).result.then(() => {

            }, () => {

            });
        }, () => {
            console.log('modal closed');
        });
        // return this.state.go('app.guestlists.create', {store: store, backParams: {store: store}});
    }

}

angular
    .module('airlst.guestlists')
    .factory('createGuestlist', [
        '$state',
        '$uibModal',
        'Alert',
        '$translate',
        ($state, $uibModal, Alert, $translate) => new createGuestlist($state, $uibModal, Alert, $translate)
    ]);
