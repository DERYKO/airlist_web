/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('category', function () {
  var scope
    , element;

  beforeEach(module('airlst.categories', 'cachedTemplates'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<category></category>'))(scope);
  }));

});
