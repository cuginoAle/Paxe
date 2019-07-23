#! /usr/bin/env node
'use strict'

const fs = require('fs')
const axe = require('./axe_cmd')
const spinner = require('./spinner')
const inSequence = require('./insequence')
const chalk = require('chalk')

const ver = require('../package.json').version
const generateGlobalHtmlReport = require('./globalHtmlReport')

const {
  log,
  clear
} = console

clear()

const argv = require('yargs')
  .usage('Usage: paxe [<option>]')
  .option('runOnly', {
    alias: 'o',
    describe: 'Comma separated list of URLs (friendly names)'
  })
  .argv

const {
  table,
  getBorderCharacters
} = require('table')

const getConfig = require('./getConfig')

let paxeLogo = [
  ' __            ___ ',
  '|__)  /\\  \\_/ |__  ',
  `|    /~~\\ / \\ |___            ${ver}`,
  '-----------------------------------',
  'Puppeteer & Axe ♿ testing framework',
  ''
]

const reportLogo = paxeLogo.map(l => `<p>${l.replace(/ /g, '\u00a0')}</p>`).join('')
paxeLogo.forEach(line => log(chalk.green(line)))

// getting settings from CLI
const runOnly = process.env.npm_config_runOnly ? process.env.npm_config_runOnly.split(',') : argv.runOnly ? argv.runOnly.split(',') : []

;(async () => {
  const config = await getConfig()
  const destFolder = config.default.outputFolder

  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder)
  }

  const urlsObj = config.urls
  const axResults = []
  const keys = Object.keys(urlsObj).filter(k => runOnly.length ? runOnly.includes(k) : true)

  const testData = keys.map((name, index) => ({
    name,
    url: urlsObj[name].url,
    i: index + 1,
    length: keys.length,
    options: {
      ...config.default,
      ...urlsObj[name].options,
      logo: reportLogo
    }
  }))

  const start = Date.now()
  const portion = Math.round(testData.length / 2)
  const firstPart = testData.slice(0, portion).map((data) => testUrl.bind(null, data, 0))
  const secondPart = testData.slice(portion).map((data) => testUrl.bind(null, data, 1))

  Promise.all([inSequence(firstPart), inSequence(secondPart)]).then(() => {
    log()
    log(`🕑 Completed in ${chalk.green((Date.now() - start) / 1000)}s.`)
    log()

    log(chalk.bgBlackBright.black(' Report: '))

    log(formatAsTable(axResults))

    generateGlobalHtmlReport(axResults, `${destFolder}/globalReport.html`)

    log(`Global report available here: 🔗 ${chalk.blue(`${destFolder}/globalReport.html`)}`)
    log()
    const CriticalCount = axResults.reduce((acc, value) => acc + value.summary.Critical.length, 0)
    process.exitCode = CriticalCount > 0 ? 1 : 0
  })

  async function testUrl ({ name, url, i, length, options }, processIndex) {
    let start = Date.now()
    const progressBar = spinner()

    progressBar.log(`Test ${i}/${length} => ${chalk.bold(name)} `, processIndex)

    const opts = {
      ...options,
      destFolder,
      events: {
        onSuccess: (msg, icon) => progressBar.success(msg, icon, processIndex),
        onAttempt: (msg, theme = 'dots2', trackTime) => {
          progressBar.start({
            label: msg,
            theme,
            trackTime
          }, processIndex)
        },
        onTest: (msg) => {
          progressBar.start({
            label: `Testing ${msg} `,
            theme: 'fish'
          }, processIndex)
        },
        onError: (err) => progressBar.fail(err, processIndex)
      }
    }

    const testResults = await axe.test({
      url,
      name
    }, opts)

    progressBar.success(`done: ${(Date.now() - start) / 1000}s.`, undefined, processIndex)
    axResults.push(...testResults)
    return testResults
  }

  function formatAsTable (results) {
    const config = {
      border: getBorderCharacters(`norc`)
    }

    const data = results.map(item => {
      const {
        Critical,
        Serious,
        Moderate,
        Minor,
        Page,
        Url,
        Report
      } = item.summary

      return [
        `${Critical ? chalk.yellow.bgRed(Critical) : chalk.green('-')}`,
        `${Serious ? chalk.red(Serious) : chalk.green('-')}`,
        `${Moderate ? chalk.yellowBright(Moderate) : chalk.green('-')}`,
        `${Minor ? chalk.yellow(Minor) : chalk.grey('-')}`,
        Page,
        `🔗 ${chalk.blue(Report)}`
      ]
    })

    return table([
      ['Critical', 'Serious', 'Moderate', 'Minor', 'Page', 'Report'],
      ...data
    ],
    config
    )
  }
})()
