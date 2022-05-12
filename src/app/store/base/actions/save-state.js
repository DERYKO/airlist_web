export default (store) => {
    if (store.state.persist) {
        localStorage.setItem(store.getters.listview, JSON.stringify({
            archived: store.state.archived,
            sort: store.state.sort,
            keyword: store.state.keyword,
            view: store.state.view,
            filters: store.state.filters,
            showFilters: store.state.showFilters,
            visible: store.state.visible,
            addedFields: store.state.addedFields,
            pagination: {
                perPage: store.state.pagination.perPage
            },
        }))
    }
}
