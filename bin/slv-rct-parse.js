#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
// const path = require('path');
const {rctParse} = require('../src');

commander
  .description('Parse .RCT file')
  .usage('[inputFile]')
  .option('-o, --output <path>', 'save result to file')
  .action((input, cmd) => {
    fs.readFile(input, 'utf8', (err, content) => {
      if (err) {
        process.stderr.write(err.message);
      } else {
        let result = rctParse.parse(content);

        if (cmd.output) {
          fs.writeFile(cmd.output, JSON.stringify(result, null, 2), (err) => {
            if (err) throw err;
            process.stdout.write(`Result successfully written to file: ${cmd.output}.`);
          });
        } else {
          process.stdout.write(JSON.stringify(result, null, 2));
        }
      }
    });
  })
  .parse(process.argv);
