/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('localeFallbacks', function () {
  var value;

  beforeEach(module('airlst.components'));

  beforeEach(inject(function (localeFallbacks) {
    value = localeFallbacks;
  }));

  //it('should equal list of added fallback locales', function () {
  //  expect(value).to.equal({
  //    en: 'en-US',
  //    de: 'de-DE'
  //  });
  //});
});
