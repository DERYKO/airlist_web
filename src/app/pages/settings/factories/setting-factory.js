/**
 * @ngdoc service
 * @name plans.factory:Plan
 *
 * @description
 *
 */
angular
    .module('airlst.settings')
    .factory('Setting', [
        '$auth',
        'Env',
        '$http',
        '$templateCache',
        '$q',
        Setting
    ]);

function Setting($auth, Env, $http, $templateCache, $q) {
    var $model = {}, invalidates = {company: []};

    $model.updateCompany = updateCompany;

    return $model;

    function init() {
        invalidates.company = [
            // 'js/contacts/factories/contact-factory.js',
            // 'contacts/directives/contact/contact-directive.tpl.html',
            // 'js/guestlists/factories/rsvp-factory.js',
        ]
    }

    function updateCompany(company) {
        return $http.put(Env.apiUrl.concat('/company'), company).then(function (response) {
            $auth.updateUser();
            // invalidates.company.forEach(function (page) {
            //     $templateCache.remove(page);
            // });
            return response
        }, function (response) {
            return $q.reject(response);
        });
    }
}
