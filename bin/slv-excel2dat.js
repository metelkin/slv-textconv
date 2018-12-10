#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const path = require('path');
const excel2dat = require('../src').excel2dat;

commander
  .description('parse slv file')
  .usage("[inputPath]")
  .option('-o, --output <path>', 'output file after parse')
  .action((input, cmd) => {
    let output = cmd.output;
    let result = excel2dat(input)
      .then((result) => {
        fs.writeFile(output, result);
      });

  })
  .parse(process.argv);
