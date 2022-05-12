export default (store) => {
    const NavService = store.ng.injector.get('NavService');

    if (store.state.overrideSideNavActions) {
        NavService.overrideMainSideNavActions(
            _.map(store.getters.highlightActions, (action, i) => {
                return {
                    label: action.title,
                    icon: action.icon,
                    primary: false,
                    order: action.order || i,
                    action() {
                        store.dispatch('clicked', {action: action});
                    }
                }
            })
        );
    }
}