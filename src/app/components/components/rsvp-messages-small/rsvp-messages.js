import template from './rsvp-messages.tpl.html';
import emailModalTemplate from '../../../pages/guestlists/components/messages/show-email-modal.tpl.html';

class RsvpMessagesSmallCtrl {
    constructor(Alert, $http, $scope, $state, $stateParams, $uibModal, $rootScope, Acl, Messages) {
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
        this.modal = $uibModal;
        this.scope = $scope;
        this.params = _.cloneDeep($stateParams);
        this.acl = Acl;
        this.messagesStore = Messages;
        this.currentStore = null;
        this.rsvp = null;
        this.currentMessages = [];

        this.loading = true;
        this._initWatchers();
        // this._loadGuests();
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.rsvp;
        }, () => {
            if (this.rsvp) {
                this._loadMessages();
            }
        })
    }

    _loadMessages() {
        this.loading = true;
        this.currentGuests = [];
        this.currentStore = this.messagesStore.reset({
            persist: false,
            listview: 'Rsvp' + this.rsvp.id + 'Messages'
        });

        this.currentStore.commit('setPermanentFilters', {
            recipient_id: this.rsvp.id,
            recipient_type: 'rsvp',
        });
        this.currentStore.commit('setVisible', [
            'subject',
            'status',
            'created_at'
        ]);
        this.currentStore.commit('addAction', {
            key: 'details',
            text: 'Details',
            class: 'btn btn-info btn-simple btn-xs',
            icon: 'fa fa-search',
            level: 'row',
            action: this.showMessage
        });

        this.currentStore.commit('setVm', this);

        this.currentStore.dispatch('getDefinitions').then(() => {
                this.currentStore.dispatch('getData').then(() => {
                    this.currentMessages = this.currentStore.state.data;
                    this.loading = false;
                })
            });
    }

    showMessage(message) {
        this.modal.open({
            animation: true,
            size: 'lg',
            templateUrl: emailModalTemplate,
            controller: ['$sce', '$uibModalInstance', 'email', 'Message', function ($sce, $uibModalInstance, email, Message) {
                var vm = this;
                vm.message = email;
                Message.one(email.id).get({include: 'recipient,template'}).then(function (message) {
                    vm.message = message;
                    vm.content = $sce.trustAsHtml(vm.message.content);
                }, function (error) {
                });

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                }
            }],
            resolve: {
                email: function () {
                    return message;
                }
            },
            controllerAs: 'email'
        });
    }
}

RsvpMessagesSmallCtrl.$inject = [
    'Alert',
    '$http',
    '$scope',
    '$state',
    '$stateParams',
    '$uibModal',
    '$rootScope',
    'Acl',
    'Messages'
];

angular
    .module('airlst.components')
    .component('rsvpMessagesSmall', {
        bindings: {
            rsvp: '<',
            store: '=',
            reloadAction: '&'
        },
        controller: RsvpMessagesSmallCtrl,
        controllerAs: 'vm',
        templateUrl: template
    });
