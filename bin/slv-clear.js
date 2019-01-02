#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
// const path = require('path');
const {slvClear} = require('../src');

commander
  .description('Display "RHS", "Initial values" and "Comments" part of .SLV')
  .usage('[inputFile]')
  .action((input) => {
    fs.readFile(input, 'utf8', (err, content) => {
      if (err) {
        process.stderr.write(err.message);
      } else {
        let result = slvClear(content);
        process.stdout.write(result);
      }
    });
  })
  .parse(process.argv);
