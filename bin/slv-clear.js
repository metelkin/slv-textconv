#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const path = require('path');
const slvClear = require('../src').slvClear;

commander
  .description('Clear slv file')
  .usage("[inputPath]")
  .action((input) => {
    fs.readFile(input, 'utf8', (err, contents) => {
      if (err) throw err;
      let result = slvClear(contents);
      process.stdout.write(result);
    })
  })
  .parse(process.argv);
