#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const path = require('path');
const excel2json = require('../src').excel2json;

commander
  .description('parse slv file')
  .usage("[inputPath]")
  .option('-o, --output <path>', 'output file after parse')
  .option('-t, --table <number>', 'number of parsing excel table')
  .action((input, cmd) => {
    let numTable = cmd.table || 1;
    let result = excel2json(input, numTable)
      .then((result) => {
        if (cmd.output) {
          fs.writeFile(cmd.output, JSON.stringify(result, null, 2), (err) => {
            if (err) throw err;
            console.log('Result successfully written to file');
          });
        }
        else {
          process.stdout.write(JSON.stringify(result, null, 2));
        }
      });

  })
  .parse(process.argv);
