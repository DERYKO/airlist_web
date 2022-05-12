angular
    .module('airlst.contacts')
    .factory('toGridView', () => new ToGridView());


class ToGridView {
    constructor() {
        this.key = 'adapter';
        this.title = 'To Grid View';
        this.level = 'global';
        this.icon = 'fal fa-th';
    }

    action(action, store) {
        if (store.state.view.mode === 'tableview') {
            const missing = _.difference(_.get(this._getGridViewFields(), store.state.slug, []), store.getters.fields);
            if (missing.length) {
                store.commit('setAddedFields', missing);
                store.commit('setVisible', store.state.visible.concat(missing));
                store.dispatch('getDefinitions')
                    .then(() => {
                        store.dispatch('getData');
                    });
            }
            store.commit('setViewMode', 'gridview')
        }
        else {
            if (store.state.addedFields.length) {
                store.commit('setVisible', _.difference(store.state.visible, store.state.addedFields));
                store.commit('setAddedFields', []);
                store.dispatch('getDefinitions')
                    .then(() => {
                        store.dispatch('getData');
                    });
            }

            store.commit('setViewMode', 'tableview')
        }
        this.initializeForState(store.state);
        store.dispatch('saveState')
    }

    initializeForState(state) {
        if (state.view.mode === 'tableview') {
            state.actions['adapter'].icon = 'fal fa-th';
            state.actions['adapter'].title = 'To Grid View';
        } else {
            state.actions['adapter'].icon = 'fal fa-th-list';
            state.actions['adapter'].title = 'To Table View';

        }
    }

    _getGridViewFields() {
        return {
            contacts: [
                'profile_image',
                'first_name',
                'last_name',
                'sex',
                'company_name',
                'business_email',
                'email',
            ],
            rsvps: [
                'contact.profile_image',
                'contact.first_name',
                'contact.last_name',
                'contact.sex',
                'contact.company_name',
                'contact.business_email',
                'contact.email',
            ],
        };
    }
}
