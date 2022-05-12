(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name contacts.directive:contact
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example <contact model=''></contact>
   *
   */
  angular
    .module('airlst.modals')
    .directive('emailShow', emailShow);

  function emailShow() {
    
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'modals/email-show/email-show-directive.tpl.html',
      replace: false,
      controllerAs: 'contact',
      controller: EmailShowCtrl,
      bindToController: {
        email: '='
      }
    };
  }

  function EmailShowCtrl($q, $scope, locale, $uibModal) {
    
    var vm = this;
    
  }
  
}());
