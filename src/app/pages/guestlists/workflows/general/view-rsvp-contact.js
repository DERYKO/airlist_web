class viewRsvpContact {
    constructor($state) {

        this.key = 'view-rsvp-contact';
        this.title = 'Details';
        this.level = 'row';
        this.icon = '';
        this.state = $state;
    }

    action(payload, store) {
        return this.state.go('app.contacts.details', {id: payload.row.contact.id, contact: payload.row.contact, store: store});
    }

}

angular
    .module('airlst.contacts')
    .factory('viewRsvpContact', [
        '$state',
        $state => new viewRsvpContact($state)
    ]);
