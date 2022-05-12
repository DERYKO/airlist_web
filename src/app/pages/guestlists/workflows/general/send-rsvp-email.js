/**
 * @ngdoc service
 * @name checkins.factory:sendRsvpEmail
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('sendRsvpEmail', [
        'Error',
        'locale',
        'SweetAlert',
        'ResourceCommon',
        sendRsvpEmail
    ]);

function sendRsvpEmail(Error, locale, SweetAlert, ResourceCommon) {
    return {
        key: 'send-rsvp-email',
        title: locale.getString('common.send_email'),
        level: 'selected',
        action: function (keys, manager) {
            keys['type'] = 'Rsvps';

            return ResourceCommon.sendEmail(keys).then(function (response) {
                SweetAlert.swal(locale.getString('sweetalerts.email_report'), response.message, 'info');
            }, function (response) {
                if (response !== 'cancel')
                    Error.default(response);
            });
        }
    };
}