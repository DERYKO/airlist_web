/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('ResourceCommon', function () {
  var service;

  beforeEach(module('airlst.components'));

  beforeEach(inject(function (ResourceCommon) {
    service = ResourceCommon;
  }));

});
