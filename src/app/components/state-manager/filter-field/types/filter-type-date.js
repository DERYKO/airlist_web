import templateUrl from './date.tpl.html';

angular
    .module('airlst.components')
    .component('filterDate', {
        bindings: {
            store: '<',
            col: '<',
        },
        controller() {
            this.$onInit = () => {
                this.model = _.defaultsDeep(this.store.state.filters[this.col.key] || {}, {min: '', max: ''});

                this.options = {
                    type: 'date',
                    onChange: this.search
                }
            }

            this.search = (cur, prev) => {
                if (!_.isEqual(cur, prev)) {
                    return this.store.dispatch('filterCol', {col: this.col, value: this.model})
                }
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });