export default (store, key) => {

    store.commit('setWorkflowKey', key);
    const workflows = store.ng.injector.get('Workflows').getWorkflows(key)

    _.each(workflows, workflow => {
        store.commit('addAction', workflow);
    });
    store.dispatch('publishHighlightActions');
}
