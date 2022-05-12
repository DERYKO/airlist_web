(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name checkins.factory:sampleDropdownAction
   *
   * @description
   *
   */
  angular
    .module('airlst.contacts')
    .factory('sampleDropdownAction', sampleDropdownAction);

  function sampleDropdownAction(SweetAlert) {
    return {
      key: 'sample-dropdown-action',
      title: 'Sample Dropdown',
      level: 'settings',
      action: function () {
        console.log(arguments);
        SweetAlert.success('Clicked dropdown action');
      }
    }
  }
}());