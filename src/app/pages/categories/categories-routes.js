import mainTemplate from './views/categories.tpl.html';
import listTemplate from './views/categories-list.tpl.html';

angular
    .module('airlst.categories')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.categories', {
            abstract: true,
            templateUrl: mainTemplate,
            reloadOnSearch: false,
            data: {
                pageTitle: 'Categories'
            }
        })
        .state('app.categories.index', {
            url: '/categories',
            sticky: true,
            data: {
                rights: 'addressbook_categories::list',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'CategoriesListCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
