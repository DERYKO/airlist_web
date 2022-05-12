import templateUrl from '../../views/workflows/add-nfc-tag.tpl.html';

/**
 * @ngdoc service
 * @name addTags.factory:addNfcTag
 *
 * @description
 *
 */

class addTagCtrl {
    constructor(Alert, contact, $http, $scope, $uibModalInstance, Users) {
        this.alert = Alert;
        this.contact = contact;
        this.api = $http;
        this.modal = $uibModalInstance;
        this.listenForTagRead($scope, Users);
    }

    listenForTagRead($scope, Users) {
        if (Users.state.pusher) {
            Users.state.pusher.bind('nfc-tag-read', data => {
                this.nfc_key = data.uid;
                console.log(this.nfc_key)
                $scope.$apply()
            });
        }
        else {
            console.error('Pusher not initialized');
        }
    }

    save() {
        this.api.put(`contacts/${ this.contact.id }`, {nfc_key: this.nfc_key})
            .then(() => {
                this.alert.success('Member card added');
                this.modal.close();
            }, response => this.alert.handle(response));
    }

    cancel() {
        this.modal.dismiss('cancel');
    }
}


function addNfcTag($uibModal) {
    return {
        key: 'add-nfc-tag',
        title: 'Add Member Card',
        icon: 'id-card',
        level: 'highlight',
        order: 100,
        action(contact) {
            $uibModal
                .open({
                    templateUrl,
                    controllerAs: 'vm',
                    bindToController: true,
                    size: 'sm',
                    resolve: {
                        contact
                    },
                    controller: [
                        'Alert',
                        'contact',
                        '$http',
                        '$scope',
                        '$uibModalInstance',
                        'Users',
                        addTagCtrl
                    ]
                })
                .result.then(null, () => {
            });
        }

    }
}

angular
    .module('airlst.contacts')
    .factory('addNfcTag', [
        '$uibModal',
        addNfcTag
    ]);
