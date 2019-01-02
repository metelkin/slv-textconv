#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
// const path = require('path');
const json2excel = require('../src').json2excel;

commander
  .description('create excel file from dat-object')
  .usage('[inputPath]')
  .option('-o, --output <path>', 'output file after parse')
  .action((input, cmd) => {
    fs.readFile(input, 'utf8', (err, contents) => {
      if (err) throw err;
      let result = json2excel(JSON.parse(contents).content);
      fs.writeFileSync(cmd.output, result, 'binary');
    });
  })
  .parse(process.argv);
