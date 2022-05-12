(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name theme.base.directive:locale
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
     <example module="theme.base">
       <file name="index.html">
        <locale></locale>
       </file>
     </example>
   *
   */
  angular
    .module('airlst.theme.base')
    .directive('locale', locale);

  function locale() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'theme/base/directives/locale-directive.tpl.html',
      replace: false,
      controllerAs: 'locale',
      controller: 'LocaleCtrl',
      link: function (scope, element, attrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */
      }
    };
  }
}());
