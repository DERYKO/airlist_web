import templateUrl from '../templates/load-preset.tpl.html';

const translateOldFormat = (state) => {
    if (state.presets.title) {

        const preset = {};
        if (state.presets.sort.length) {
            const sort = {};
            let field = state.presets.sort[0];
            let direction = 'asc';

            if (_.startsWith(field, '-')) {
                field = field.substr(1);
                direction = 'desc';
            }

            sort[field] = direction;
            preset.sort = sort;
        }

        if (state.presets.columns.length) {
            preset.visible = _.filter(state.presets.columns, col => col.visible).map(col => col.field);
        }

        preset.archived = state.presets.data.archived;
        delete state.presets.filters.selectBoxes;

        preset.filters = state.presets.filters;

        state.presets = preset;
    }

    if (state.presets.filters.length === 0) {
        state.presets.filters = {};
    }

    return state;

}

export default (store) => {
    const $http = store.ng.injector.get('$http');
    const $uibModal = store.ng.injector.get('$uibModal');

    $uibModal.open({
        templateUrl,
        backdrop: 'static',
        controllerAs: 'vm',
        controller: ['Alert', '$http', 'states', '$uibModalInstance', function (Alert, $http, states, $uibModalInstance) {
            this.store = store;
            this.states = states;
            this.selected = '';
            this.options = {
                maxItems: 1,
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                sortField: 'name'
            };
            this.load = $uibModalInstance.close;
            this.select = (id) => {
                this.state = _.find(this.states, {id: parseInt(id)});
            };
            this.delete = () => {
                if (this.state) {
                    $http.delete(`presets/${this.state.id}`)
                        .then(() => {
                                Alert.success('Preset Successfully Deleted');
                                this.states.splice(_.findIndex(this.states, {id: this.state.id}), 1);
                                this.state = undefined;
                                this.selected = '';

                                this.close();
                            },
                            err => Alert.handle(err)
                        )
                }
            }
            this.close = $uibModalInstance.dismiss;
        }],
        resolve: {
            states() {
                return $http.get('presets?table=' + store.state.listview)
                    .then(response => _.map(response.data.data, translateOldFormat), (e) => {
                        console.log('error while loading presets', e);
                    });
            }
        }
    }).result.then(state => {
        const workflow = store.state.workflowKey,
            filters = store.state.permanentFilters,
            prefix = store.state.prefix,
            oldVm = store.state.vm;

        store.resetState();
        store.resetGetters();
        store.commit('mergeState', state.presets);
        store.commit('setPermanentFilters', filters);
        store.commit('setPrefix', prefix);
        store.commit('setVm', oldVm);

        if (workflow) {
            store.dispatch('loadWorkflows', workflow);
        }

        store.dispatch('getDefinitions').then(() => {
            store.dispatch('getData');
            store.dispatch('saveState');
        });
    }, (param) => {
        console.log('error in modal', param)
    })

}
