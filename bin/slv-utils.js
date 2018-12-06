#!/usr/bin/env node
'use strict';

const commander = require('commander');

const SLVParse = require('./slv-utils-slv-parse').default

commander
  .version('1.0.0', '-v, --version')
  .description('Command line utilities for working with qs3p')

commander
  .command('slv-parse')
  .description('parse slv file')
  .option('-i, --input <path>', 'input file parse')
  .option('-o, --output <path>', 'output file after parse')
  .action((cmd) => {
    SLVParse(cmd.input, cmd.output)
  })
commander.parse(process.argv)
