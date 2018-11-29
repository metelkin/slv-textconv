const assert = require('assert');
const slvUtils = require('../src');
const cases = require('./cases/cases.json')

describe('Base tests', function() {
  cases.forEach((test) => {
    it(test.name, function() {
      assert.deepEqual(
        slvUtils.slvParse.parse(test.input),
        test.expected
      )
    })
  })
})
