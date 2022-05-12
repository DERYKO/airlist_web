/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('Rsvp', function () {
  var factory;

  beforeEach(module('airlst.guestlists'));

  beforeEach(inject(function (Rsvp) {
    factory = Rsvp;
  }));

});
