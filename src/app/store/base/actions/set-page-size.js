export default (context, size) => {
    var pagination = context.state.pagination;
    pagination.perPage = size;
    context.commit('setPagination', pagination);
    context.dispatch('saveState');
    context.dispatch('getData');
}