export default (context, col) => {
    var sort = {};
    if (col.sortable) {
        var dir = col.sort === 'asc' ? 'desc' : 'asc';
        context.dispatch('resetSort');
        sort[col.key] = dir;
        col.sort = dir;
        context.commit('setSort', sort);
        context.commit('updateColumn', col);
        context.dispatch('getData');
        context.dispatch('saveState');
    }
}