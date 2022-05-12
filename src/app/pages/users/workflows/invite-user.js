import inviteEmailModalTemplate from '../views/modals/invite-email-modal.tpl.html';

class InviteUserWorkflow {
    constructor($state, $uibModal) {
        this.key = 'invite-user';
        this.title = 'Invite User';
        this.level = 'highlight';
        this.icon = 'plus-circle';

        this.state = $state;
        this.modal = $uibModal;
    }

    action(payload, store) {
        this.modal.open({
            templateUrl: inviteEmailModalTemplate,
            controller: 'InviteEmailModalController',
            size: 'sm',
            controllerAs: 'vm'
        });
    }

}

angular
    .module('airlst.users')
    .factory('inviteUser', [
        '$state',
        '$uibModal',
        ($state, $uibModal) => new InviteUserWorkflow($state, $uibModal)
    ]);
