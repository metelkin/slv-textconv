'use strict';

const fs = require('fs');
const extensionOutputFiles = {
  'slv-parse': 'json',
  'dat-serialize': 'dat',
  'rct-serialize': 'rct',
  'rct-parse': 'json'
}
let casesDirs = fs.readdirSync("./test/cases");
delete casesDirs[casesDirs.indexOf('other')];
delete casesDirs[casesDirs.indexOf('cases.json')];
let tests = casesDirs.reduce((result, dir) => {
  let path = `./test/cases/${dir}/`;
  let files = fs.readdirSync(path+'input/');
  let cases = files.map((caseName) => {
    let input = fs.readFileSync(path+'input/'+caseName).toString();
    let name = getFileName(caseName);
    let expected = fs.readFileSync(path+'output\\'+name+'.'+extensionOutputFiles[dir]).toString();
    return makeCaseObj(dir, input, expected, name);
  });
  result[dir] = cases;
  return result;
}, {});

fs.writeFile("./test/cases/cases.json", JSON.stringify(tests, null, 2), (err) => {
  if (err) throw err;
  console.log('Tests build');
})

function getFileName(filename) {
  return filename.match(/^([A-Za-z0-9\-]+).([A-Za-z]+)$/)[1]
}

function makeCaseObj(type, input, expected, name) {
  switch(type) {
    case 'slv-parse':
      // input no change
      expected = JSON.parse(expected);
      break;
    case 'rct-parse':
      // input no change
      expected = JSON.parse(expected);
      break;
    case 'dat-serialize':
      input = JSON.parse(input);
      //expected no change
      break;
    case 'rct-serialize':
      input = JSON.parse(input);
      //expected no change
      break;
  }
  return {
    name,
    input,
    expected
  }
}
