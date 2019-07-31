const readline = require('readline')
const chalk = require('chalk')

const logger = (stackCount = 2, offsetTop = 8) => {
  let stack = []
  const print = () => {
    readline.cursorTo(process.stdout, 0, offsetTop)
    readline.clearScreenDown(process.stdout)
    const rows = Math.floor((process.stdout.rows - offsetTop - 1) / stackCount)
    process.stdout.write(`${stack.map(ctx => ctx.slice(-rows).join('\n')).join(`\n${chalk.green('---------------------------------')}\n`)}\n`)
  }

  return {
    newLine: (msg, stackIndex = 0) => {
      if (stack[stackIndex]) {
        stack[stackIndex].push(msg)
      } else {
        stack[stackIndex] = [msg]
      }
      print()
    },
    sameLine: (msg, stackIndex = 0) => {
      if (stack[stackIndex]) {
        stack[stackIndex].pop()
        stack[stackIndex].push(msg)
      } else {
        stack[stackIndex] = [msg]
      }
      print()
    },
    clear: () => {
      console.clear()
      stack = {}
    }
  }
}
module.exports = logger()
