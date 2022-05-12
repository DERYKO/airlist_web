/**
 * @ngdoc service
 * @name passbooks.factory:Passbook
 *
 * @description
 *
 */
angular
    .module('airlst.passbooks')
    .factory('Passbook', [
        'locale',
        'Resource',
        Passbook
    ]);

function Passbook(locale, Resource) {
    var $model = Resource.make('passbooks');

    $model.title = ' Passbooks';

    $model.locales = ['passbooks'];


    return $model;
}