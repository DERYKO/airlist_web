import templateUrl from './select.tpl.html';

angular
    .module('airlst.components')
    .component('filterSelect', {
        bindings: {
            store: '<',
            col: '<',
        },
        controllerAs: 'vm',
        controller() {
            this.$onInit = () => {
                this.items = _.map(this.col.filter_information.data, (label, value) => {
                    if (_.isObject(label)) {
                        return {
                            label: _.get(label, 'label', ''),
                            value: value
                        };
                    } else {
                        return {
                            label,
                            value
                        };
                    }
                });
            };

            this.select = (val) => {
                this.store.dispatch('filterCol', {col: this.col, value: val})
            }
        },
        templateUrl: templateUrl
    });
