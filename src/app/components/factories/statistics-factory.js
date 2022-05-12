/**
 * @ngdoc service
 * @name checkins.factory:Workflows
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .factory('Statistics', [
        'Auth',
        '$http',
        '$q',
        Statistics
    ]);

function Statistics(Auth, $http, $q) {

    var cache = {};

    var service = {};

    service.getSex = function (force) {

        var deferred = $q.defer();

        if (cache.sex && !force) {
            deferred.resolve(cache.sex);
            return deferred.promise;
        }

        $http.post(Auth.baseUrl('/contacts/count-stats'), {groups: ['sex']}).then(function (response) {

            cache.sex = response.data;
            deferred.resolve(cache.sex);

        }, function (response) {

            deferred.reject(response);
        });

        return deferred.promise;

    };

    service.getCount = function (model, groups, filters, aggregation, force) {

        var deferred = $q.defer();

        // if (cache.heartContactCount && !force) {
        //     deferred.resolve(cache.heartContactCount);
        //     return deferred.promise;
        // }

        $http.post(Auth.baseUrl('/' + model + '/count-stats'), {
            groups: groups,
            filters: filters,
            aggregation: aggregation
        }).then(function (response) {

            // cache.sex = response.data;
            deferred.resolve(response.data);

        }, function (response) {

            deferred.reject(response);
        });

        return deferred.promise;

    }

    service.getDateAggregationCount = function (aggregationLevel, field, filters, force) {

        var deferred = $q.defer();

        // if (cache.heartContactCount && !force) {
        //     deferred.resolve(cache.heartContactCount);
        //     return deferred.promise;
        // }

        $http.post(Auth.baseUrl('/contacts/stats/count-date-aggregated'), {
            groups: groups,
            filters: filters
        }).then(function (response) {

            // cache.sex = response.data;
            deferred.resolve(response.data);

        }, function (response) {

            deferred.reject(response);
        });

        return deferred.promise;
    }

    return service;
}