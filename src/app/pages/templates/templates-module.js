import './main/main-module';
import './types/types-module';

/**
 * @ngdoc object
 * @name templates
 * @description
 *
 */
angular
    .module('airlst.templates', [
        'ui.router',
        'airlst.components',
        'airlst.templates.main',
        'airlst.templates.types'
    ]);

require('./templates-routes');