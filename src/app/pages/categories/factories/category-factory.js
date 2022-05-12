/**
 * @ngdoc service
 * @name categories.factory:Category
 *
 * @description
 *
 */
angular
    .module('airlst.categories')
    .factory('Category', [
        'Resource',
        'Restangular',
        Category
    ]);

function Category(Resource, Restangular) {
    var $model = Resource.make('categories');
    $model.title = ' Categories';

    $model.addContacts = addContacts;

    $model.form = ['name'];

    Restangular.extendModel('categories', function (model) {
        model.addContacts = function (contacts) {
            return Restangular.all('categories/contacts').post({items: [this.id], contacts: contacts});
        };
        return model;
    });

    return $model;

    function addContacts(categories, contacts) {
        return Restangular.one('categories/contacts').doPOST({items: categories, contacts: contacts});
    }
}