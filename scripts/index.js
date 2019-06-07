const pa11y = require('./pa11y_cmd')
const lighthouse = require('./lighthouse_cmd')
const spinner = require('./spinner')
const inSequence = require('./insequence')
const chalk = require('chalk')
const fs = require('fs')
const { table } = require ('table')
  
// importing the urls to check list
const urlsObj = require('./urls')
const bar = spinner('fish')
const output = './output'

const {
  log,
  clear
} = console

const pa_Results = []
const lh_Results = []

const lighthouseOpts = {
  output: 'html',
  chromeFlags: ['--headless', '--disable-gpu'],
  onlyCategories: ['accessibility']
}

const pa11yOptions = (name) => {
  return {
    screenCapture: `${output}/${name}.png`,
    timeout: 40000
  }
}
const keys=Object.keys(urlsObj)
const tests = keys.map((name, i) => testUrl.bind(null, name, i+1, keys.length))
const start = Date.now()
clear()

inSequence(tests).then(() => {
  log()
  log(`🕑 Completed in ${chalk.green((Date.now() - start) / 1000)}s.`)
  log()

  log(chalk.bgBlackBright.black(' Lighthouse: '))
  log(table(lh_Results.map(item => {
    return Object.values(item.summary)
  })))
  log()

  log(chalk.bgBlackBright.black(' Pa11y: '))
  log(table(pa_Results.map(item => {
    return Object.values(item.summary)
  })))
})

async function testUrl (name, i, length) {
  const url = urlsObj[name].url
  log(`${chalk.grey('testing:')} ${chalk.white.bold(name)} (${i}/${length})`)

  bar.start(chalk.green('Lighthouse '))
  const lhResults = await lighthouse.test({ url, name }, lighthouseOpts)
  fs.writeFileSync(lhResults.summary.Report, lhResults.report)

  bar.update({ label: chalk.green('Pa11y ') })

  const paResults = await pa11y.test({ url, name }, pa11yOptions(name))
  fs.writeFileSync(paResults.summary.Report, paResults.report)

  bar.stop()

  lh_Results.push(lhResults)
  pa_Results.push(paResults)
}
