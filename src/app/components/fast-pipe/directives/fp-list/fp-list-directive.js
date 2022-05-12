(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name airlst.fast-pipe.directive:fpList
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
     <example module="airlst.fast-pipe">
       <file name="index.html">
        <fp-list></fp-list>
       </file>
     </example>
   *
   */
  angular
    .module('airlst.fast-pipe')
    .directive('fpList', fpListDirective);

  function fpListDirective() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'fast-pipe/directives/fp-list/views/base.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: 'FpListDirectiveController',
      bindToController: {
        fpRepository: '='
      },
      link: function (scope, element, attrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */
      }
    };
  }
}());
