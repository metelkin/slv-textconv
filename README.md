# slv-textconv

Utility for git to compare two SLV files.

Command line function to produce text file from SLV: RHS + IV + Comments text.

## Installation

Required `npm` and `nodejs` installed.
```
npm install slv-textconv --global
```
Gives the ability to start function.
```shell
slv-textconv model.slv >> out.txt
```

## Usage for git

For implementation in all git repositories use
```shell
git config --global diff.slv.textconv slv-textconv
```
In particular project include lines in .gitattributes
```
*.slv diff=slv
```

## See also

- [config gist](https://gist.github.com/metelkin/c9999257e75fabf75058b930f1859337)
- [.gitattributes gist](https://gist.github.com/metelkin/abbec1201627084da2950a7b16ca4469)

## Author

Evgeny Metelkin @metelkin
