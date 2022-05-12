import templateUrl from './contact-extended-info.tpl.html';

class ContactExtendedCtrl {
    constructor(Contact, Acl, $sce) {
        this.contact = Contact;
        this.acl = Acl;
        this.sce = $sce;
        Contact.getSchema().then((schema) => {
            this.schema = schema;
        });
    }
}

angular
    .module('airlst.contacts')
    .component('contactExtendedInfo', {
        bindings: {
            contact: '='
        },
        controller: ['Contact', 'Acl', '$sce', ContactExtendedCtrl],
        controllerAs: 'vm',
        templateUrl: templateUrl
    });
