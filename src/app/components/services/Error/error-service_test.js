/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('Error', function () {
  var service;

  beforeEach(module('airlst.components'));

  beforeEach(inject(function (Error) {
    service = Error;
  }));

});
