import MODULE_NAME from './app.js';
import './pages/users/store/users';

/**
 * @ngdoc object
 * @name airlst
 * @description
 *
 */
angular.module(MODULE_NAME)
    .config([
        '$uibModalProvider',
        config
    ]);

function config($uibModalProvider) {
    $uibModalProvider.backdrop = 'static';
}
