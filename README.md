# slv-utils

Utilities for working with SLV and DAT files.

[![Build Status](https://travis-ci.org/insysbio/slv-utils.svg?branch=master)](https://travis-ci.org/insysbio/slv-utils)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/github/insysbio/slv-utils?svg=true&branch=master&passingText=master)](https://ci.appveyor.com/project/metelkin/slv-utils/branch/master)
[![GitHub issues](https://img.shields.io/github/issues/insysbio/slv-utils.svg)](https://GitHub.com/insysbio/slv-utils/issues/)
[![GitHub release](https://img.shields.io/github/release/insysbio/slv-utils.svg)](https://github.com/insysbio/slv-utils/releases/)
[![GitHub npm](https://img.shields.io/npm/v/slv-utils/latest.svg)](https://www.npmjs.com/package/slv-utils)
[![GitHub license](https://img.shields.io/github/license/insysbio/slv-utils.svg)](https://github.com/insysbio/slv-utils/blob/master/LICENSE)

## Installation

Required `npm` and `nodejs` installed.
```
npm install --global slv-utils
```

```shell
slv clear model.slv >> out.txt
```

## Usage for git

For implementation in all git repositories use
```shell
git config --global diff.slv.textconv "slv clear"
```
In particular project include lines in .gitattributes
```
*.slv diff=slv
```

## See also

- [config gist](https://gist.github.com/metelkin/c9999257e75fabf75058b930f1859337)
- [.gitattributes gist](https://gist.github.com/metelkin/abbec1201627084da2950a7b16ca4469)

## Developers

- Evgeny Metelkin @metelkin
- Viktoria Tkachenko @vetedde
