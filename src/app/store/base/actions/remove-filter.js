export default (store, col) => {
    if (col.filterable) {
        store.commit('unsetFilter', {key: col.key});
        store.dispatch('saveState');
        store.dispatch('getData');
    }
}