import ContactExtendedListViewCtrl from '../../../../store/contacts/controllers/extended-list-view';

angular
    .module('airlst.contacts')
    .controller('ContactExtendedListViewCtrl', [
        'Contact',
        '$injector',
        '$scope',
        (Contact, $injector, $scope) => {
            return new ContactExtendedListViewCtrl(Contact, $injector, $scope)
        }
    ]);
