export default (store, payload) => {
    if (payload.action.manager) {
        return store.dispatch(payload.action.manager)
    }

    if (payload.action.vm && _.hasIn(store.state.vm, payload.action.vm)) {
        return store.state.vm[payload.action.vm](payload, store);
    }
    if (payload.action.action) {
        return payload.action.action(payload, store)
    }
};
