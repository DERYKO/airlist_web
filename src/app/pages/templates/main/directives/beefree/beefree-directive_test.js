/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('airlst.beefree', function () {
  var scope
    , element;

  beforeEach(module('templates', 'templates/directives/beefree-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<beefree></beefree>'))(scope);
  }));

});
