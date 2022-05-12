/* @ngdoc object
 * @name components
 * @description
 *
 */
angular
    .module('airlst.components').config([
    'growlProvider',
    growlConfig
]);

function growlConfig(growlProvider) {
    growlProvider.onlyUniqueMessages(true);
    growlProvider.globalReversedOrder(true);
    growlProvider.globalTimeToLive(5000);
    growlProvider.globalDisableCountDown(true);
    growlProvider.globalDisableIcons(true);
}