#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
// const path = require('path');
const {excel2dat} = require('../src');

commander
  .description('Convert .XLSX files to .DAT')
  .usage('[inputPath]')
  .option('-o, --output <path>', 'save result to file')
  .option('-t, --table <number>', 'number of parsing excel table')
  .action((input, cmd) => {
    let numTable = cmd && cmd.table || 1;
    excel2dat(input, numTable).then((result) => {
      if (cmd.output) {
        fs.writeFile(cmd.output, result, (err) => {
          if(err) throw err;
          process.stdout.write(`Result successfully written to file: ${cmd.output}.`);
        });
      } else {
        process.stdout.write(result);
      }
    }).catch((reason) => {
      process.stderr.write(reason);
    });
  })
  .parse(process.argv);
