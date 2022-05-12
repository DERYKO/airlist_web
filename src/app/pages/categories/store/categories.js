

import Categories from '../../../store/categories';

angular
    .module('airlst.categories')
    .factory('Categories', [
        '$injector',
        'Category',
        ($injector, Category) => new Categories(Category, {
            injector: $injector
        })
    ]);