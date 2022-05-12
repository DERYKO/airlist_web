/**
 * @ngdoc service
 * @name checkins.factory:emailRsvps
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('emailRsvps', [
        'locale',
        '$state',
        emailRsvps
    ]);

function emailRsvps(locale, $state) {
    return {
        key: 'email-rsvps',
        title: 'Send email',
        level: 'selected',
        action(payload, store) {
            console.log(store);
            $state.go('app.messages.create', {type: 'rsvp', recipients: store});
        }
    }
}
