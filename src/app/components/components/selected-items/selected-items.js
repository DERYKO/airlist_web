import templateUrl from './selected-items.tpl.html';


angular
    .module('airlst.components')
    .component('selectedItems', {
        bindings: {
            store: '<',
            tagField: '@'
        },
        controller() {
            this.showTag = (row) => {
                const  col = _.find(this.store.state.columns, {key: this.tagField});
                return this.store.helpers.getCell(row, col, this.store);
            }

        },
        controllerAs: 'vm',
        templateUrl
    });
