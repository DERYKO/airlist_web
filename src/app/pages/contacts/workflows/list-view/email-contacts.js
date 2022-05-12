/**
 * @ngdoc service
 * @name checkins.factory:emailContacts
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('emailContacts', [
        'locale',
        '$state',
        emailContacts
    ]);

function emailContacts(locale, $state) {
    return {
        key: 'email-contacts',
        title: 'Send Email',
        level: 'selected',
        action({}, store) {
            $state.go('app.messages.create', {
                recipients: store,
                store,
                back: 'app.contacts.index',
            });

        }
    }
}