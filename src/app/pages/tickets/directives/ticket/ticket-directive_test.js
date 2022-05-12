/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('ticket', function () {
  var scope
    , element;

  beforeEach(module('airlst.tickets', 'cachedTemplates'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<ticket></ticket>'))(scope);
  }));

});
