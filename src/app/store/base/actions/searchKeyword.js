export default (store, keyword) => {
    store.commit('setKeyword', keyword);
    store.dispatch('saveState');
    store.dispatch('getData');
}