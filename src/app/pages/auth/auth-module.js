/* @ngdoc object
 * @name auth
 * @description
 *
 */
angular
    .module('airlst.auth', [
        'airlst.components',
        'ui.router'
    ]);

angular.module('airlst.auth').run([
    '$rootScope',
    '$state',
    run
]);

function run($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event) {
        if (event.currentScope) {
            $state.go('app.dashboard');
        }
    });
}

require('./auth-intercepts');
require('./auth-provider');
require('./auth-routes');
require('./version-conflict-intercepts');

// Controllers
require('./controllers/activation-controller');
require('./controllers/auth-controller');
require('./controllers/auth-logout-controller');
require('./controllers/base-controller');
require('./controllers/reset-controller');
require('./controllers/modals/select-company-modal-controller');

// Decorators
require('./decorators/auth-decorator');

// Services
require('./services/auth-service');
