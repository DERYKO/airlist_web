/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('localeSupported', function () {
  var value;

  beforeEach(module('airlst.components'));

  beforeEach(inject(function (localeSupported) {
    value = localeSupported;
  }));

  //it('should equal list of locale supported', function () {
  //  expect(value).to.equal([
  //    'en-US',
  //    'de-DE'
  //  ]);
  //});
});
