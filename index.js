#!/usr/bin/env node

'use strict';
var fs = require('fs');

var userArgs = process.argv.slice(2);
var slvFile = process.argv[2];

var slvText = fs.readFileSync(slvFile, 'utf8');
var rhsText = slvText.match(/<RHS 1\r\n#\r\n((?:.*\r\n?)*)#\r\n\r\n<RHS 2/m);
var ivText = slvText.match(/<INI 1\r\n#\r\n((?:.*\r\n?)*)#\r\n\r\n<INI 2/m);
var commentsText = slvText.match(/<COMMENTS 1\r\n#\r\n((?:.*\r\n?)*)#dbs#\r\n\r\n<COMMENTS 2/m);

var slvOut = [
  '=== RHS ===',
  rhsText[1].replace(/\r+\n?/g, '\n'),
  '=== Initial values ===',
  ivText[1].replace(/\r+\n?/g, '\n'),
  '=== Comments ===',
  commentsText[1].replace(/\r+\n?/g, '\n')
].join('\n');

process.stdout.write(slvOut);

process.stdout.on('error', function (err) {
    // been piped to a process that has closed stdout. e.g. more
    if (err.code === 'EPIPE') {
        process.exit(0);
    }

    // something else, don't mask error
    process.stderr.write(JSON.stringify(err) + '\n');
    process.exit(1);
});
