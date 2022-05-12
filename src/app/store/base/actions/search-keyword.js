export default (context, keyword) => {
    context.commit('setKeyword', keyword);
    context.dispatch('saveState');
    context.dispatch('getData');
}
