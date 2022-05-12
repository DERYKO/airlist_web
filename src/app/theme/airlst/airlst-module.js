/* @ngdoc object
 * @name themeBase
 * @description
 *
 */
angular
    .module('airlst.theme.airlst', []);

// Components
require('./components/header/component');
require('./components/al-pagination/component');
require('./components/al-top-search/component');

// Directives
require('./directives/al-dropdown/al-dropdown-directive');

// Factories
require('./factories/pager');