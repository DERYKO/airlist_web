/**
 * @ngdoc service
 * @name checkins.factory:sendRsvpSms
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('sendRsvpSms', [
        'Error',
        'locale',
        'SweetAlert',
        'ResourceCommon',
        sendRsvpSms
    ]);

function sendRsvpSms(Error, locale, SweetAlert, ResourceCommon) {
    return {
        key: 'send-rsvp-sms',
        title: locale.getString('common.send_sms'),
        level: 'selected',
        action: function (keys, manager) {
            keys['type'] = 'Rsvps';

            return ResourceCommon.sendSms(keys).then(function (response) {
                SweetAlert.swal(locale.getString('sweetalerts.sms_report'), response.message, 'info');
            }, function (response) {
                if (response !== 'cancel')
                    Error.default(response);
            });
        }
    };
}