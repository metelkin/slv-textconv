#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
// const path = require('path');
const {rctTemplate} = require('../src');

commander
  .description('Serialize .RCT file')
  .usage('[inputPath]')
  .option('-o, --output <path>', 'save result to file')
  .action((input, cmd) => {
    fs.readFile(input, 'utf8', (err, content) => {
      if (err) {
        process.stderr.write(err.message);
      } else {
        let result = rctTemplate(JSON.parse(content));

        if (cmd.output) {
          fs.writeFile(cmd.output, result, (err) => {
            if (err) throw err;
            process.stdout.write(`Result successfully written to file: ${cmd.output}.`);
          });
        } else {
          process.stdout.write(result);
        }
      }
    });
  })
  .parse(process.argv);
