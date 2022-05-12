/* @ngdoc object
 * @name components
 * @description
 *
 */
angular
    .module('airlst.components')
    .config([
        'Env',
        'RestangularProvider',
        restangular
    ]);

function restangular(Env, RestangularProvider) {
    RestangularProvider
        .setBaseUrl(Env.apiUrl)
        .setRestangularFields({
            selfLink: 'self.link'
        })
        .setDefaultHeaders({'Content-Type': 'application/json'})
        .setParentless(['guestlists']);
}