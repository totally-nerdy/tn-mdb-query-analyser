/**
 * Copyright 2024 Totally Nerdy Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the “Software”), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * MongoDB Query Analyser
 *
 * This little JavaScript file, which is executed on the mongo shell (mongo/mongosh) takes in a query, explains it and
 * prints the results in a nice understandable way.
 *
 * How to use:
 * - Have a look at setup.js
 * - Change the constants in that file to your liking
 * - Change QUERY to the query you want to analyse. This is required
 * - Save the file and transfer it to a MongoDB server together with the query_analyser.js
 * - Connect to the node by using mongo or mongosh [connection string] setup.js query_analyser.js
 * - The order of the JavaScript files does matter, setup.js must be first to declare the constants
 *
 * Notes: developed on MongoDB v6.0.0.
 */

print()
print()
print()
print('██████   ██████                                       ██████████   ███████████')
print('░░██████ ██████                                       ░░███░░░░███ ░░███░░░░░███')
print('░███░█████░███   ██████  ████████    ███████  ██████  ░███   ░░███ ░███    ░███')
print('░███░░███ ░███  ███░░███░░███░░███  ███░░███ ███░░███ ░███    ░███ ░██████████')
print('░███ ░░░  ░███ ░███ ░███ ░███ ░███ ░███ ░███░███ ░███ ░███    ░███ ░███░░░░░███')
print('░███      ░███ ░███ ░███ ░███ ░███ ░███ ░███░███ ░███ ░███    ███  ░███    ░███')
print('█████     █████░░██████  ████ █████░░███████░░██████  ██████████   ███████████')
print('░░░░░     ░░░░░  ░░░░░░  ░░░░ ░░░░░  ░░░░░███ ░░░░░░  ░░░░░░░░░░   ░░░░░░░░░░░')
print()
print()
print()
print('           ██████')
print('           ███░░░░███')
print('           ███    ░░███ █████ ████  ██████  ████████  █████ ████')
print('           ░███     ░███░░███ ░███  ███░░███░░███░░███░░███ ░███')
print('           ░███   ██░███ ░███ ░███ ░███████  ░███ ░░░  ░███ ░███')
print('           ░░███ ░░████  ░███ ░███ ░███░░░   ░███      ░███ ░███')
print('           ░░░██████░██ ░░████████░░██████  █████     ░░███████')
print('           ░░░░░░ ░░   ░░░░░░░░  ░░░░░░  ░░░░░       ░░░░░███')
print()
print()
print()
print('█████████                        ████')
print('███░░░░░███                      ░░███')
print('░███    ░███  ████████    ██████   ░███  █████ ████  █████   ██████  ████████')
print('░███████████ ░░███░░███  ░░░░░███  ░███ ░░███ ░███  ███░░   ███░░███░░███░░███')
print('░███░░░░░███  ░███ ░███   ███████  ░███  ░███ ░███ ░░█████ ░███████  ░███ ░░░')
print('░███    ░███  ░███ ░███  ███░░███  ░███  ░███ ░███  ░░░░███░███░░░   ░███')
print('█████   █████ ████ █████░░████████ █████ ░░███████  ██████ ░░██████  █████')
print('░░░░░   ░░░░░ ░░░░ ░░░░░  ░░░░░░░░ ░░░░░   ░░░░░███ ░░░░░░   ░░░░░░  ░░░░░')
print()
print()
print()
print('                            by Totally Nerdy Ltd.')
print()
print()
print()

const round = number => {
  return Math.round((number + Number.EPSILON) * 100) / 100
}
const colorize = (text, color, style) => {
  // color: "red", "green", "blue"... (see below)
  // styles: "normal" or undefined, "bright", "highlight"

  if (!style) {
    style = 'normal'
  }

  const _ansi = {
    csi: String.fromCharCode(0x1B) + '[',
    reset: '0',
    text_prop: 'm',

    styles: {
      normal: '3',
      bright: '9',
      highlight: '4'
    },

    colors: {
      black: '0',
      red: '1',
      green: '2',
      yellow: '3',
      blue: '4',
      magenta: '5',
      cyan: '6',
      gray: '7'
    }
  }

  const beginColor = _ansi.csi + _ansi.styles[style] + _ansi.colors[color] + _ansi.text_prop
  const endColor = _ansi.csi + _ansi.reset + _ansi.text_prop

  return beginColor + text + endColor
}
const red = text => colorize(text, 'red')
const green = text => colorize(text, 'green')
const yellow = text => colorize(text, 'yellow')
const blue = text => colorize(text, 'blue')
const magenta = text => colorize(text, 'magenta')
const cyan = text => colorize(text, 'cyan')
const gray = text => colorize(text, 'gray')
const printStages = (stages, indent = '') => {
  stages.forEach(stage => {
    const operation = Object.keys(stage)[0]
    if (stage[operation].queryPlanner && stage[operation].queryPlanner.parsedQuery) {
      if (indent === '') {
        print(`${indent}Parsed query: ${JSON.stringify(stage[operation].queryPlanner.parsedQuery, null, 4)}`)
      } else {
        print(`${indent}Parsed query: ${JSON.stringify(stage[operation].queryPlanner.parsedQuery)}`)
      }
      print()
    }
    print(`${indent}## ${paintOperation(operation)} STAGE ##`)
    if (stage[operation].queryPlanner && stage[operation].queryPlanner.namespace) {
      print(`${indent}ns: ${stage[operation].queryPlanner.namespace}`)
    } else if (stage[operation].coll) {
      print(`${indent}ns: ${stage[operation].coll}`)
    }

    if (stage[operation].executionStats) {
      print()
      printExecutionStats(stage[operation].executionStats, indent)
    } else if (stage[operation].pipeline) {
      // Some more recursive fun
      print(`${indent}${green(`total returned documents: ${stage.nReturned}`)}`)
      print()
      printStages(stage[operation].pipeline, `${indent}\t`)
    } else {
      print(`${indent}returned documents: ${stage.nReturned}`)
    }
    print()
  })
}
const printExecutionStage = (executionStage, indent) => {
  // print(executionStage)

  print(`${indent}>>> ${paintOperation(executionStage.stage)}`)
  print(`${indent}returned documents: ${executionStage.nReturned}`)

  if (executionStage.filter) {
    print(`${indent}filter: ${JSON.stringify(executionStage.filter)}`)
  }
  /** Projection related **/
  if (executionStage.transformBy) {
    print(`${indent}projection: ${JSON.stringify(executionStage.transformBy)}`)
  }
  /** Sort related **/
  if (executionStage.sortPattern) {
    print(`${indent}sort pattern: ${JSON.stringify(executionStage.sortPattern)}`)
  }
  if (executionStage.type) {
    print(`${indent}sorting type: ${executionStage.type}`)
  }
  if (executionStage.memLimit) {
    print(`${indent}memory limit: ${executionStage.memLimit}`)
  }
  if (executionStage.totalDataSizeSorted) {
    print(`${indent}data size sorted: ${executionStage.totalDataSizeSorted}`)
  }
  if (typeof executionStage.usedDisk === 'boolean') {
    print(`${indent}sorting used disk: ${executionStage.usedDisk}`)
  }
  /** Index related **/
  if (executionStage.keyPattern) {
    print(`${indent}index pattern: ${JSON.stringify(executionStage.keyPattern)}`)
  }
  if (executionStage.indexName) {
    print(`${indent}index name: ${executionStage.indexName}`)
  }
  if (PRINT_INDEX_BOUNDS && executionStage.indexBounds) {
    print(`${indent}index bounds: ${JSON.stringify(executionStage.indexBounds)}`)
  }
  if (executionStage.direction) {
    print(`${indent}direction: ${executionStage.direction}`)
  }
  if (executionStage.isMultiKey) {
    print(`${indent}index contains multiple keys (array)`)
  }
  if (executionStage.keysExamined) {
    print(`${indent}index entries looked at: ${executionStage.keysExamined}`)
  }
  if (executionStage.docsExamined) {
    print(`${indent}documents looked at: ${executionStage.docsExamined}`)
  }
  if (executionStage.seeks) {
    print(`${indent}seeks: ${executionStage.seeks}`)
  }

  print()

  if (executionStage.inputStage) {
    // Some recursive fun
    indent += '\t'
    printExecutionStage(executionStage.inputStage, indent)
  } else if (executionStage.inputStages) {
    indent += '\t'
    for (const inputStage of executionStage.inputStages) {
      // Some recursive fun
      printExecutionStage(inputStage, indent)
    }
  }
}
const printExecutionStats = (executionStats, indent = '') => {
  print(`${indent}returned documents: ${executionStats.nReturned}`)
  if (executionStats.executionTimeMillis > 1000) {
    print(`${indent}${red('total execution time: ' + executionStats.executionTimeMillis + ' ms')}`)
  } else {
    print(`${indent}${green('total execution time: ' + executionStats.executionTimeMillis + ' ms')}`)
  }
  print(`${indent}index entries looked at: ${executionStats.totalKeysExamined}`)
  print(`${indent}documents looked at: ${executionStats.totalDocsExamined}`)
  print()
  print(`${indent}> Query targeting:`)
  const nReturned = parseInt(executionStats.nReturned)
  let scannedReturned = 0
  let scannedDocsReturned = 0
  if (nReturned > 0) {
    scannedReturned = round(parseInt(executionStats.totalKeysExamined) / nReturned)
    scannedDocsReturned = round(parseInt(executionStats.totalDocsExamined) / nReturned)
  }
  print(`${indent}scanned/returned: ${scannedReturned}`)
  print(`${indent}scanned docs/returned: ${scannedDocsReturned}`)
  print()

  if (PRINT_EXECUTION_STAGES) {
    print(`${indent}\t${cyan('>> Execution stages')}`)
    print()
    indent += '\t'
    printExecutionStage(executionStats.executionStages, indent)
    print()
  }
}
const paintOperation = operation => {
  if (operation === 'COLLSCAN') {
    return red(operation)
  } else if (operation === 'IXSCAN') {
    return operation
  } else if (operation === 'SORT') {
    return yellow(operation)
  }
  return operation
}

print()
print()

let test
try {
  test = QUERY
} catch (e) {
  throw new Error(red('No query given'))
}
try {
  test = PRINT_EXECUTION_STAGES
} catch (e) {
  PRINT_EXECUTION_STAGES = false
}
try {
  test = PRINT_INDEX_BOUNDS
} catch (e) {
  PRINT_INDEX_BOUNDS = false
}

const result = QUERY.explain('executionStats')

// print(result)

if (result.executionStats) {
  print('# Execution stats of single-stage query')
  print()
  print(`Parsed query: ${JSON.stringify(result.queryPlanner.parsedQuery, null, 4)}`)
  print()
  printExecutionStats(result.executionStats)

} else if (result.stages) {
  print('# Execution stats of multi-stage query')
  print()
  printStages(result.stages)
}
