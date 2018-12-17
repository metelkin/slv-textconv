const fs = require('fs');
const extensionOutputFiles = {
  'slv-parse': 'json'
}
let casesDirs = fs.readdirSync("./test/cases");
delete casesDirs[casesDirs.indexOf('other')];
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

fs.writeFile("./test/cases.json", JSON.stringify(tests, null, 2), (err) => {
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
    expected = JSON.parse(expected)
    break;
  }
  return {
    name,
    input,
    expected
  }
}
