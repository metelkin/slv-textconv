'use strict';
/*
  manually written combinarion of raw parser and value parser
*/
// const { writeFileSync } = require('fs'); 
const SRP = require('./slv-raw-parser');
const SVP = require('./slv-value-parser');
//const fs = require('fs');
const _ = require('lodash');
const slvStructure = require('./slv-structure');

function parse(slv) {
  let SLV = SRP.parse(slv); //parse slv files, values is raw
  // let output = JSON.stringify(SLV, null, 2); // debug
  // writeFileSync('raw.json', output); // debug

  let mapLength = SLV.content.map.length;
  // parse all values except the last one
  SLV.content.map.forEach((item, index) => {
    if (index !== mapLength - 1){
      item.parsedValue = item.rawValue
        .map((x) => SVP.parse(x.trim()));
    }
  });
  // parse last
  SLV.content.map[mapLength-1].parsedValue 
    = lastCommentParse(SLV.content.map[mapLength-1].rawValue[0]);

  return SLV;
}

function lastCommentParse(inputComment) {
  // xml analysis
  let xmlStart = inputComment.match(/<[a-zA-Z]+>/).index;
  let xml = inputComment.substring(xmlStart);
  
  // other parts
  let comment = inputComment
    .substring(0, xmlStart)
    .split(/\r*\n/)
    .slice(3)
    .map((x) => x.trim());

  let result = {};
  let pointer = 0;
  slvStructure.extra.forEach((prop) => {
    if (prop.func === 'readList') {
      let size = parseInt(comment[pointer]); 
      let len = prop.len || 1; // length of subArray
      let raw = comment.slice(pointer + 1, pointer + size*len + 1)
      result[prop.name] = len === 1
        ? raw
        : _.chunk(raw, len); // split
      pointer += size*len + 1;
    } else if (prop.func === 'readSimple'){
      result[prop.name] = comment[pointer]; 
      pointer++;
    } else {
      throw new Error('Unknown parsing func for slv extra');
    }
  });

  result['xml'] = xml;

  return result;
}

module.exports = {
  parse
};
