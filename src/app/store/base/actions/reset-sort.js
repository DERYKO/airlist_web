export default (context) => {
    context.commit('setColumns', _.map(context.state.columns, col => {
        col.sort = undefined;
        return col;
    }));
}