export default (context) => {
    context.commit('setArchived', false);
    context.dispatch('saveState');
    context.dispatch('getData')
}