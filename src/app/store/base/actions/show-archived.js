export default (context) => {
    context.commit('setArchived', true);
    context.dispatch('saveState');
    context.dispatch('getData')
}