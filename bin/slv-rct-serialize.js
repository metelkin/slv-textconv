#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const path = require('path');
const rctTemplate = require('../src').rctTemplate;

commander
  .description('template rct file')
  .usage("[inputPath]")
  .option('-o, --output <path>', 'output file after template')
  .action((input, cmd) => {
    fs.readFile(input, 'utf8', (err, contents) => {
      if (err) throw err;
      let result = rctTemplate((JSON.parse(contents)));

      if (cmd.output) {
        fs.writeFile(cmd.output, result, (err) => {
          if (err) throw err;
          console.log('Result successfully written to file');
        });
      }
      else {
        process.stdout.write(result);
      }
    })
  })
  .parse(process.argv);
