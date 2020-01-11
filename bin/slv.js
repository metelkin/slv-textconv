#!/usr/bin/env node
'use strict';

const commander = require('commander');
const pkg = require('../package');

commander
  .version(pkg.version, '-v, --version')
  .description('Command line utilities for working with dbsolve files.')
  
  // converters and utilities
  .command('slv2heta <inputFile>', 'Convert .SLV to Heta code.')
  .command('excel2dat <inputFile>', 'Convert .XLSX files to .DAT')
  .command('excel2json <inputFile>', 'Convert .XLSX files to .DATJS')
  .command('clear <inputFile>', 'Display cleared .SLV')
  // parsers
  .command('parse <inputFile>', 'Parse .SLV file')
  .command('dat-parse <inputFile>', 'Parse .DAT file')
  .command('rct-parse <inputFile>', 'Parse .RCT file')
  // serializers
  .command('dat-serialize <inputFile>', 'Serialize .DAT file')
  .command('rct-serialize <inputFile>', 'Serialize .RCT file')
  .command('json2excel <inputFile>', 'Convert .DATJS to .XLSX')

  .parse(process.argv);
