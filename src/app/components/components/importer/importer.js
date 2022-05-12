import templateUrl from './importer.tpl.html';
import ImporterCtrl from  './importer-controller';

/**
 * @ngdoc directive
 * @name components.directive:importer
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="components">
 <file name="index.html">
 <importer></importer>
 </file>
 </example>
 *
 */
angular
    .module('airlst.components')
    .component('importer', {
        templateUrl,
        controllerAs: 'vm',
        controller: ['Alert', 'Categories', '$http', '$state', ImporterCtrl],
        bindings: {
            importUrl: '@',
            type: '@',
            fields: '=',
            onSuccess: '&',
            onFailure: '&'
        }
    });
