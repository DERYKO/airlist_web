/**
 * @ngdoc service
 * @name checkins.factory:archiveSelectedRsvps
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('archiveSelectedRsvps',[
        'locale',
        'SweetAlert',
        archiveSelectedRsvps
    ]);

function archiveSelectedRsvps(locale, SweetAlert) {
    return {
        key: 'archive-selected-rsvps',
        title: 'Delete Bookings',
        level: 'selected',
        action: function (keys, manager) {
            return SweetAlert.swal({
                    title: locale.getString('sweetalerts.are_you_sure'),
                    text: locale.getString('sweetalerts.archiving_records_confirmation_message'),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ed5565',
                    confirmButtonText: locale.getString('sweetalerts.yes_archive_selected'),
                    showLoaderOnConfirm: true,
                    closeOnConfirm: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        manager.getModel().archiveMany(keys).then(function () {
                            manager.refresh();
                            SweetAlert.swal(locale.getString('sweetalerts.archive_successful'), locale.getString('sweetalerts.records_archived_message'), 'success');
                        }, function (response) {
                            SweetAlert.swal(locale.getString('sweetalerts.archive_not_successful'), response.data.message, 'error');
                        });
                    }
                });
        }
    };
}
