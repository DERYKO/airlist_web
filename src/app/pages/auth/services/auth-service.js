/**
 * @ngdoc service
 * @name checkins.factory:Workflows
 *
 * @description
 *
 */
angular
    .module('airlst.auth')
    .factory('Auth', [
        'Env',
        Auth
    ]);

function Auth(Env) {

    var service = {};

    service.baseUrl = function (path) {
        return Env.apiUrl + (path ? path : '');
    };

    return service;
}