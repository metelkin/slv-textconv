'use strict';

module.exports = function slvClear(slvText){
  let rhsText = slvText.match(/<RHS 1\r\n#\r\n((?:.*\r\n?)*)#\r\n\r\n<RHS 2/m);
  let ivText = slvText.match(/<INI 1\r\n#\r\n((?:.*\r\n?)*)#\r\n\r\n<INI 2/m);
  let commentsText = slvText.match(/<COMMENTS 1\r\n#\r\n((?:.*\r\n?)*)#dbs#\r\n\r\n<COMMENTS 2/m);

  let slvOut = [
    '=== RHS ===',
    rhsText[1].replace(/\r+\n?/g, '\n'),
    '=== Initial values ===',
    ivText[1].replace(/\r+\n?/g, '\n'),
    '=== Comments ===',
    commentsText[1].replace(/\r+\n?/g, '\n')
  ].join('\n');

  return slvOut;
};
