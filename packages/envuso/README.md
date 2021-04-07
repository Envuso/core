envuso
======

Envuso CLI, make a project, generate framework files etc

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/envuso.svg)](https://npmjs.org/package/envuso)
[![Downloads/week](https://img.shields.io/npm/dw/envuso.svg)](https://npmjs.org/package/envuso)
[![License](https://img.shields.io/npm/l/envuso.svg)](https://github.com/envuso/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @envuso/cli
$ envuso COMMAND
running command...
$ envuso (-v|--version|version)
@envuso/cli/0.0.01 darwin-arm64 node-v15.8.0
$ envuso --help [COMMAND]
USAGE
  $ envuso COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`envuso autocomplete [SHELL]`](#envuso-autocomplete-shell)
* [`envuso commands`](#envuso-commands)
* [`envuso help [COMMAND]`](#envuso-help-command)
* [`envuso new`](#envuso-new)

## `envuso autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ envuso autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ envuso autocomplete
  $ envuso autocomplete bash
  $ envuso autocomplete zsh
  $ envuso autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `envuso commands`

list all the commands

```
USAGE
  $ envuso commands

OPTIONS
  -h, --help              show CLI help
  -j, --json              display unfiltered api data in json format
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --hidden                show hidden commands
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v1.3.0/src/commands/commands.ts)_

## `envuso help [COMMAND]`

display help for envuso

```
USAGE
  $ envuso help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `envuso new`

Create a new project

```
USAGE
  $ envuso new

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ envuso new
```

_See code: [src/commands/new.ts](https://github.com/envuso/cli/blob/v0.0.01/src/commands/new.ts)_
<!-- commandsstop -->
