'use strict';
/*
  manually written combinarion of raw parser and value parser
*/
const SRP = require('./slv-raw-parser.js');
const SVP = require('./slv-value-parser.js');
//const fs = require('fs');

function parse(slv) {
  let SLV = SRP.parse(slv); //parse slv files, values is raw
  //console.log('!!!ROW-VALUE TO PARSED-VALUE!!!');
  let countValues = SLV.content.map.length;
  SLV.content.map.forEach((item, index) => {
    let rawValue = item.rawValue;
    let value = rawValue.map((x, i) => {
      //console.log(`Key: ${item.key};`);
      //console.log(`Now parse: ${x.trim()};`);
      // check that item is not last comment, last comment parsed with itself rule
      if (index != countValues - 1) {
        return SVP.parse(x.trim());
      }
      else {
        return lastCommentParse(x);
      }
    });
    item['parsedValue'] = value;
    //console.log('__________________________________');
  });

  return SLV;
}

function lastCommentParse(inputComment) {
  //console.log('Start last comment');
  let xmlStart = inputComment.match(/<[a-zA-Z]+>/).index;
  let xml = inputComment.substring(xmlStart);
  let comment = inputComment
    .substring(0,xmlStart)
    .trim()
    .split(/\r*\n/);

  let result = [];
  let i = 1;
  while(i < comment.length) {
    let j = parseInt(comment[i].trim());
    //console.log(`j is ${j}`);
    let cell = [];
    for(let k = 0; k < j; k++) {
      //console.log(` value is ${comment[i+k+1]}`);
      cell.push(comment[i+k+1]);
    }
    result.push(cell);
    i += j + 1;
  }
  result.push(
    {
      type: 'string',
      value: xml
    }
  );
  return result;
}

module.exports = {
  parse
};
