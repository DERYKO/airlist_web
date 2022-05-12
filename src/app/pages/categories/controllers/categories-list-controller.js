import '../store/categories';
import './categories-details-controller';

/**
 * @ngdoc object
 * @name categories.controller:CategoriesCtrl
 *
 * @description
 *
 */

class CategoriesListCtrl {
    constructor(Categories) {
        this.store = Categories;
        this.store.commit('setVm', this);
        this.store.dispatch('loadWorkflows', 'addressbook_categories::list')
    }
}

CategoriesListCtrl.$inject = ['Categories'];


angular
    .module('airlst.categories')
    .controller('CategoriesListCtrl',
        CategoriesListCtrl);
