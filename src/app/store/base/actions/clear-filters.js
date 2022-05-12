export default (context) => {
    context.commit('setFilters', {});
    if (context.state.showFilters) {
        context.commit('toggleFilters');
    }
    context.dispatch('saveState');
    context.dispatch('getData');
}