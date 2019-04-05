#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
// const path = require('path');
const {json2excel} = require('../src');
const {datParse} = require('../src');

commander
  .description('Convert .DAT to .XLSX')
  .usage('[inputFile]')
  .option('-o, --output <path>', 'save result to file')
  .action((input, cmd) => {
    fs.readFile(input, 'utf8', (err, content) => {
      if (err) {
        process.stderr.write(err.message);
      } else {
        let json = datParse.parse(content);
        let result = json2excel(json.content);
        fs.writeFileSync(cmd.output, result, 'binary');
      }
    });
  })
  .parse(process.argv);
