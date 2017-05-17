'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-p-5-webpack:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true});
  });

  it('creates files', () => {
    assert.file([
      'dummyfile.txt'
    ]);
  });
});
