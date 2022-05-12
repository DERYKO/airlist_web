/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('auth', function () {
  var decorator;

  beforeEach(module('airlst.auth'));

  beforeEach(inject(function ($auth) {
    decorator = $auth;
  }));

});
