export default (store) => {
    store.state.pusher.unsubscribe('user-id-' + store.state.loggedin.profile.id);
    store.state.pusher.unsubscribe('company-id-' + store.state.company.id);
    store.state.pusher = {};
    store.state.getLoggedInPromise = null;
    store.state.loggedin.status = false;
    store.state.loggedin.profile = {};
    store.state.company = {};
};
