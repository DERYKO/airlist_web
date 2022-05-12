export default (store, mode) => {
    store.commit('setCheckinMode', mode);

    const handler = mode ? 'bind' : 'unbind';

    if(store.state.pusher[handler]) {
        return store.state.pusher[handler]('nfc-tag-read', data => {
            const $state = store.ng.injector.get('$state');
            if (store.state.loggedin.checkin) {
                $state.go('app.contacts.details', {id: data.contact_id});
            }
        });
    } else {
        return null;
    }
}
