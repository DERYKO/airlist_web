angular
    .module('airlst.contacts')
    .factory('addToGuestlist', addToGuestlist);

addToGuestlist.$inject = ['Alert', 'Guestlists', 'SelectBox', 'locale', '$state'];

function addToGuestlist(Alert, Guestlists, SelectBox, locale, $state) {
    return {
        key: 'add-to-guestlist',
        title: 'Add to Guestlist',
        level: 'selected',
        action(payload, store) {

            return locale.ready(['sweetalerts', 'guestlists'])
                .then(() => {
                    SelectBox
                        .single(Guestlists.reset({persist: false}))
                        .then(result => {
                            $state.go('app.guestlists.rsvps.create', {
                                gid: result.data,
                                contacts: store,
                                store,
                                back: payload.back || 'app.contacts.index',
                                backParams: payload.backParams || {},
                            })
                        }, response => Alert.handle(response));
                })
        }
    }
}

