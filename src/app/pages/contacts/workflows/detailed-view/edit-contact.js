/**
 * @ngdoc service
 * @name checkins.factory:editContact
 *
 * @description
 *
 */



function editContact($state, $stateParams) {
    return {
        key: 'edit-contact',
        title: 'Edit',
        icon: 'pencil',
        order: 10,
        level: 'highlight',
        action(contact, vm) {
            $state.go('app.contacts.edit', {
                id: contact.id,
                contact: contact,
                store: vm.store,
                back: 'app.contacts.details',
                backParams: {
                    id: contact.id,
                    back: $stateParams.back,
                    backParams: _.cloneDeep($stateParams.backParams),
                }
            })
        }
    }
}

angular
    .module('airlst.contacts')
    .factory('editContact', [
        '$state',
        '$stateParams',
        editContact
    ]);
