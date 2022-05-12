

export default (store, {col, value}) => {
    if (col.filterable) {
        if (!_.isUndefined(value) || !_.isUndefined(store.state.filters[col.key])) {
            store.commit('setFilter', {key: col.key, value});
            store.dispatch('saveState');
            store.dispatch('getData');
        }
    }
}