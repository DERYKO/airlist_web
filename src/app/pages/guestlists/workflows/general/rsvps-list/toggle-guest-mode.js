angular
    .module('airlst.guestlists')
    .factory('toggleGuestMode', () => new ToggleGuestMode());

class ToggleGuestMode {
    constructor($scope) {
        this.scope = $scope;

        this.key = 'toggle-guest-mode';
        this.title = 'Show guests of guest in guestlist';
        this.level = 'special-filters';
        this.resetModelValue();
    }

    action(action, store, newValue) {
        store.state.view.hideGuests = !store.state.view.hideGuests;
        this.initializeForState(store.state);
        store.dispatch('saveState');
        store.dispatch('getData');
    }

    initializeForState(state) {
        this.modelValue = !state.view.hideGuests;
        if (state.view.hideGuests) {
            state.permanentFilters.has_parent = false;
        } else {
            if (_.get(state.permanentFilters, 'has_parent') !== undefined) {
                delete state.permanentFilters.has_parent;
            }
        }
    }

    resetModelValue() {
        this.modelValue = false;
    }
}
