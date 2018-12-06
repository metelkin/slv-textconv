#!/usr/bin/env node
'use strict';

const commander = require('commander')
const pkg = require('../package')

commander
  .version(pkg.version, '-v, --version')
  .description('Command line utilities for working with dbsolve files.')
  .command('parse [inputPath]', 'parse slv file')
  .command('clear [inputPath]', 'Convert slv file')
  .parse(process.argv)
