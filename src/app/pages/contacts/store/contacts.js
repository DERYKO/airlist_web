import Contacts from '../../../store/contacts';

angular
    .module('airlst.contacts')
    .factory('Contacts', [
        '$injector',
        'Contact',
        ($injector, Contact) => new Contacts(Contact, {
            injector: $injector
        })
    ]);
