#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const path = require('path');
const excel2json = require('../src').excel2json;

commander
  .description('parse slv file')
  .usage("[inputPath]")
  .option('-o, --output <path>', 'output file after parse')
  .action((input, cmd) => {
    let output = cmd.output;
    console.log(excel2json)
    let result = excel2json(input)
      .then((result) => {
        fs.writeFile(output, JSON.stringify(result, null, 2));
      });

  })
  .parse(process.argv);
