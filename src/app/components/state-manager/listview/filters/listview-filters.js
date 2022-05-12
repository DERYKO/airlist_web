import templateUrl from './listview-filters.tpl.html';

import '../../filter-field/filter-field'

angular
    .module('airlst.components')
    .component('listviewFilters', {
        bindings: {
            store: '=',
        },
        controller() {
            this.isEmpty = (obj) => {
                let empty = true;
                for(let key in obj) {
                    if(obj.hasOwnProperty(key) && obj[key] && obj[key].length)
                        empty =  false;
                }
                return empty;
            }

            this.showFilterTag = (col) => {
                return col.filterable
                        && col.type
                        && ((typeof(this.store.state.filters[col.key]) === 'object' && this.store.state.filters[col.key] !== null && !this.isEmpty(this.store.state.filters[col.key]))
                            || (this.store.state.filters[col.key] && this.store.state.filters[col.key].length)
                            || (col.type === 'boolean' && (this.store.state.filters[col.key] === true || this.store.state.filters[col.key] === false))
                            );
            }

            this.displayFilter = (val) => {
                if (!val) {
                    return val;
                }
                if (_.isArray(val)) {
                    return val.join(', ');
                }

                if (val.min || val.max) {
                    let date = '';
                    if (val.min) {
                        date = date.concat(' From: ', val.min);
                    }

                    if (val.max) {
                        date = date.concat(' To: ', val.max);
                    }
                    return date;
                }

                if(_.isBoolean(val)) {
                    return val ? 'Yes' : 'No';
                }
                return val;
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });