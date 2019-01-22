#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
// const path = require('path');
const {excel2json} = require('../src');

commander
  .description('Conver .XLSX files to .DATJS')
  .usage('[inputFile]')
  .option('-o, --output <path>', 'save result to file')
  .option('-t, --table <number>', 'number of parsing excel table')
  .action((input, cmd) => {
    let numTable = cmd && cmd.table || 1;
    excel2json(input, numTable).then((result) => {
      if (cmd.output) {
        fs.writeFile(cmd.output, JSON.stringify(result, null, 2), (err) => {
          if (err) throw err;
          process.stdout.write(`Result successfully written to file: ${cmd.output}.`);
        });
      } else {
        process.stdout.write(JSON.stringify(result, null, 2));
      }
    }).catch((reason) => {
      process.stderr.write(reason);
    });
  })
  .parse(process.argv);
