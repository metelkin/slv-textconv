#!/usr/bin/env node
'use strict';

const commander = require('commander');

commander
  .version('1.0.0', '-v, --version')
  .description('Command line utilities for working with dbsolve files.')
  .command('parse [inputPath]', 'parse slv file')
  .parse(process.argv)
