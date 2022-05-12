import templateUrl from './listview.tpl.html';
import './table/listview-table';
import './grid/listview-grid';
import './pagination/listview-pagination';
import './filters/listview-filters';
import './keyword-search/keyword-search';

angular
    .module('airlst.components')
    .component('listview', {
        bindings: {
            store: '=',
            parent: '='
        },
        controller() {
            this.$onInit = () => {
                this.lodash = _;
                this.store.commit('setBusy', true);
                this.store.dispatch('getDefinitions').then(() => {
                    this.store.dispatch('getData')
                });
                this.store.dispatch('publishHighlightActions');
            }

            this.search = (keyword) => {
                this.store.dispatch('searchKeyword', keyword)
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });
