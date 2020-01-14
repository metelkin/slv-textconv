/*global describe it*/
'use strict';

const { slvParse, slvjs2heta } = require('../src');
const { expect } = require('chai');
const cases = require('./slv-cases');
const fs = require('fs');
const path = require('path');

describe('SLV exports', () => {
  cases.forEach((x) => {
    describe('test ' + x.name, () => {
      // common obj
      let slv // SLV content
        , slvjs // slvjs to compare
        , slvjsActual // parsed SLV
        , hetajs // Heta JSON to compare
        , hetajsActual // conversion to Heta JSON
        , heta; // Heta to compare

      // read files
      slv = fs.readFileSync(
        path.resolve(__dirname, x.sourcePath),
        'utf8'
      );
      let slvjsStr = fs.readFileSync(
        path.resolve(__dirname, x.slvjsPath),
        'utf8'
      );
      slvjs = JSON.parse(slvjsStr);
      let hetajsStr = fs.readFileSync(
        path.resolve(__dirname, x.hetajsPath),
        'utf8'
      );
      hetajs = JSON.parse(hetajsStr);
      heta = fs.readFileSync(
        path.resolve(__dirname, x.hetaPath),
        'utf8'
      );

      it('parsing to slvjs', () => {
        slvjsActual = slvParse.parse(slv);
        expect(slvjsActual).to.be.deep.equal(slvjs);
      });

      it('convert to Heta JSON module', () => {
        let hetajsActualString = slvjs2heta(slvjsActual, true);
        hetajsActual = JSON.parse(hetajsActualString);
        expect(hetajsActual).to.be.deep.equal(hetajs);
      });
      
      it('convert to Heta module', () => {
        let hetaActual = slvjs2heta(slvjsActual, false);
        expect(hetaActual).to.be.equal(heta);
      });
    });
  });
});