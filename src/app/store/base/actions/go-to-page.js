export default (context) => {
    var pagination = context.state.pagination;
    pagination.page = context.state.pagination.current;
    context.commit('setPagination', pagination);
    context.dispatch('getData');
}