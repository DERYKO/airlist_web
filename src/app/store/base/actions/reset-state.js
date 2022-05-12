export default (store) => {
    return store
        .resetState()
        .resetGetters()
        .dispatch('getDefinitions')
        .then(() => {
            return store.dispatch('getData');
        })
        .finally(() => {
            store.dispatch('saveState')
        });
}