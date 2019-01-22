#!/usr/bin/env node
'use strict';

const commander = require('commander');
const pkg = require('../package');

commander
  .version(pkg.version, '-v, --version')
  .description('Command line utilities for working with dbsolve files.')
  .command('clear <inputFile>', 'Display cleared .SLV')
  .command('parse <inputFile>', 'Parse .SLV file')

  .command('dat-parse <inputFile>', 'Parse .DAT file')
  .command('dat-serialize <inputFile>', 'Serialize .DAT file')
  .command('json2excel <inputFile>', 'Convert .DATJS to .XLSX')
  .command('excel2json <inputFile>', 'Convert .XLSX files to .DATJS')
  .command('excel2dat <inputFile>', 'Convert .XLSX files to .DAT')

  .command('rct-parse <inputFile>', 'Parse .RCT file')
  .command('rct-serialize <inputFile>', 'Serialize .RCT file')
  .parse(process.argv);
