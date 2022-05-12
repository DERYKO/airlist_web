export default (context, row) => {
    if (context.state.selection.selectedRows[row.id]) {
        return context.commit('unSelectRow', row.id);
    }
    return context.commit('selectRow', row.id);
}