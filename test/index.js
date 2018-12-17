'use strict';

const assert = require('assert');
const slvUtils = require('../src');
const cases = require('./cases/cases.json')

for (var nameGroupTest in cases) {
  switch(nameGroupTest) {
    case 'slv-parse':
      runSlvParseTests(cases[nameGroupTest]);
      break;
    case 'dat-serialize':
      runDatSerializeTests(cases[nameGroupTest]);
      break;
    case 'rct-serialize':
      runRctSerializeTests(cases[nameGroupTest]);
      break;
  }
}

function runSlvParseTests(listTests) {
  describe(nameGroupTest, () => {
    listTests.forEach((test) => {
      it(test.name, function() {
        assert.deepEqual(
          slvUtils.slvParse.parse(test.input),
          test.expected
        )
      })
    })
  });
}

function runDatSerializeTests(listTests) {
  describe(nameGroupTest, () => {
    listTests.forEach((test) => {
      it(test.name, function() {
        assert.equal(
          slvUtils.datTemplate(test.input),
          test.expected
        )
      })
    })
  });
}

function runRctSerializeTests(listTests) {
  describe(nameGroupTest, () => {
    listTests.forEach((test) => {
      it(test.name, function() {
        assert.equal(
          slvUtils.rctTemplate(test.input).trim(),
          test.expected.trim()
        )
      })
    })
  });
}
