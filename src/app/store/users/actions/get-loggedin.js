import Pusher from 'pusher-js';

function initiatePusher(Env, state) {
    const pusher = new Pusher(Env.pusher.key, {
        cluster: Env.pusher.cluster,
        encrypted: Env.pusher.encrypted
    });

    pusher.subscribe('user-id-' + state.loggedin.profile.id);
    pusher.subscribe('company-id-' + state.company.id);

    return pusher;
}


export default (store) => {
    if (!store.state.getLoggedInPromise) {
        const $http = store.ng.injector.get('$http');
        const Env = store.ng.injector.get('Env');
        const $auth = store.ng.injector.get('$auth');

        store.state.getLoggedInPromise = $auth.getUser().then((userData) => {
            store.commit('setLoggedInStatus', true);
            store.commit('setLoggedInProfile', userData);
            store.commit('setCompany', userData.company.data);
            store.commit('setPusher', initiatePusher(Env, store.state));
            store.dispatch('enableNotifications');
        }, () => {
            store.state.pusher.unsubscribe('ser-id-' + store.state.loggedin.profile.id);
            store.state.pusher.unsubscribe('company-id-' + store.state.company.id);
            store.commit('setLoggedInStatus', false);
            store.commit('setLoggedInProfile', {});
            store.commit('setCompany', {});
            store.commit('setPusher', {});
            store.dispatch('disableNotifications');
        });
    }

    return store.state.getLoggedInPromise;
};
