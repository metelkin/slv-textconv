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
        if (cmd.output) {
          fs.writeFile(cmd.output, result, (err) => {
            console.log('Result successfully written to file');
          });
        }
        else {
          process.stdout.write(result);
        }
      });

  })
  .parse(process.argv);
