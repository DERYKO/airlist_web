export default (store, definition) => {

    const columns = _.cloneDeep(definition)
        .map(col => {
            col.visible = _.includes(store.state.visible, col.key);
            col.sort = _.get(store.state.sort, col.key);
            col.template = _.get(store.state.templates, col.key);
            return col;
        });

    store.commit('setColumns', columns);
    return this;
}