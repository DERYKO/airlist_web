angular
    .module('airlst.guestlists')
    .factory('bulkUpdateRsvpStatus', [
        '$state',
        'ResourceSelect',
        'Alert',
        '$http',
        ($state, ResourceSelect, Alert, $http) => new BulkUpdateRsvpStatus($state, ResourceSelect, Alert, $http)
    ]);

class BulkUpdateRsvpStatus {
    constructor($state, ResourceSelect, Alert, $http) {
        this.state = $state;
        this.resourceSelect = ResourceSelect;
        this.alert = Alert;
        this.api = $http;

        this.key = 'bulk-update-rsvp';
        this.title = 'Update Status';
        this.level = 'selected';
    }

    action(action, store) {
        this.resourceSelect.selectStatus().then((result) => {
            const selectedStatus = result.selectedStatus;

            this.api.put(`rsvps`, {
                fields: {
                    rsvp: {
                        status: selectedStatus
                    }
                },
                items: store.getters.selectedFilters
            }).then(() => {
                this.alert.success('Bookings Update', 'The status of the given rsvps has been updated');
                store.dispatch('getData');
            }, err => {
                this.alert.handle(err);
            });
        }, () => {

        });
    }
}
