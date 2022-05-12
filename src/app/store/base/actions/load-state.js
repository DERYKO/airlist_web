export default (store) => {
    if (store.state.persist && localStorage.getItem(store.state.listview)) {
        const state = JSON.parse(localStorage.getItem(store.state.listview));
        store.resetState();
        store.commit('mergeState', state)
    }
    return store;
}
