const pa11y = require('./pa11y_cmd')
const lighthouse = require('./lighthouse_cmd')
const axe = require('./axe_cmd')
const spinner = require('./spinner')
const inSequence = require('./insequence')
const chalk = require('chalk')
const fs = require('fs')
const { table, getBorderCharacters } = require ('table')
  
// importing the urls to check list
const urlsObj = require('./urls')
const bar = spinner('fish')
const output = './output'

const {
  log,
  clear
} = console

clear()
const paxeLogo=[
' __            ___ ',
'|__)  /\\  \\_/ |__  ',
'|    /~~\\ / \\ |___    v.0.1',
'-----------------------------'
]

paxeLogo.forEach(line => log(chalk.green(line)))

const pa_Results = []
const lh_Results = []
const ax_Results = []

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
const tests = keys.map((name, i) => testUrl.bind(null, name, i+1, keys.length, urlsObj[name].options))
const start = Date.now()

inSequence(tests).then(() => {
  log()
  log(`🕑 Completed in ${chalk.green((Date.now() - start) / 1000)}s.`)
  log()

  log(chalk.bgBlackBright.black(' Lighthouse: '))
  log(formatAsTable(lh_Results))
  log()

  log(chalk.bgBlackBright.black(' Pa11y: '))
  log(formatAsTable(pa_Results))

  log(chalk.bgBlackBright.black(' Axe: '))
  log(formatAsTable(ax_Results))
})

async function testUrl (name, i, length, options) {
  const url = urlsObj[name].url
  log(`${chalk.grey('testing:')} ${chalk.white.bold(name)} (${i}/${length})`)

  let start = Date.now()
  bar.start(chalk.green('Lighthouse '))
  const lhResults = await lighthouse.test({ url, name }, lighthouseOpts)
  fs.writeFileSync(lhResults.summary.Report, lhResults.report)
  bar.success(`Lighthouse: ${(Date.now()- start)/1000}s.`)

  start = Date.now()
  bar.start(chalk.green('Pa11y '))
  const paResults = await pa11y.test({ url, name }, {...pa11yOptions(name), ...options})
  fs.writeFileSync(paResults.summary.Report, paResults.report)
  bar.success(`Pa11y: ${(Date.now()- start)/1000}s.`)

  start = Date.now()
  bar.start(chalk.green('Axe '))
  const axResults = await axe.test({ url, name }, options)
  // fs.writeFileSync(axResults.summary.Report, axResults.report)
  bar.success(`Axe: ${(Date.now()- start)/1000}s.`)

  lh_Results.push(lhResults)
  pa_Results.push(paResults)
  ax_Results.push(axResults)
}


function formatAsTable(results){
  const config = {
    border: getBorderCharacters(`norc`)
  };

  const data=results.map(item => {
    const {
      'Issues count': Issues,
      Page,
      Report,
    } = item.summary
    
    return [
      Issues,
      Page,
      `🔗 ${chalk.blue(Report)}`
    ]
  })

  return table([
    ['Issues count', 'Page', 'Report'],
    ...data
    ],
    config
  )  
}