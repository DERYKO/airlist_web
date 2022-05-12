/**
 * @ngdoc service
 * @name queue.factory:JobLog
 *
 * @description
 *
 */
angular
    .module('airlst.queue')
    .factory('JobLog', [
        'locale',
        'Resource',
        JobLog
    ]);

function JobLog(locale, Resource) {
    const $model = Resource.make('templates');

    $model.title = ' JobLog';

    $model.locales = ['templates', 'common'];

    return $model;
}
