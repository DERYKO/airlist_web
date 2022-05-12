/**
 * @ngdoc object
 * @name airlst.controller:ContactsImportCtrlCtrl
 *
 * @description
 *
 */

class ContactsImportCtrl {
    constructor(Contacts, locale, Alert, $state) {
        this.locale = locale;
        this.alert = Alert;
        this.state = $state;
        const store = Contacts;
        store.dispatch('getDefinitions')
            .then(() => {
                this.fields = _.keyBy(store.state.columns, 'key');
            });
    }

    onSuccess() {
        this.state.go('app.contacts.index');
    }

    onFailure(response) {
        this.alert.error(this.locale.getString('sweetalerts.import_unsuccessful_title'), response.message);
    }
}

angular
    .module('airlst.contacts')
    .controller('ContactsImportCtrl', [
        'Contacts',
        'locale',
        'Alert',
        '$state',
        ContactsImportCtrl
    ]);

