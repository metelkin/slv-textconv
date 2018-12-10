#!/usr/bin/env node
'use strict';

const commander = require('commander')
const pkg = require('../package')

commander
  .version(pkg.version, '-v, --version')
  .description('Command line utilities for working with dbsolve files.')
  .command('parse [inputPath]', 'parse slv file')
  .command('clear [inputPath]', 'Convert slv file')
  .command('dat-parse [inputPath]', 'Parsing dat file')
  .command('rct-parse [inputPath]', 'Parsing rct file')
  .command('rct-serialize [inputPath]', 'Template rct file')
  .command('excel2json [inputPath]', 'Conver excel files to json')
  .parse(process.argv)
