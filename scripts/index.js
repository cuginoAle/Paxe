#! /usr/bin/env node
'use strict'

const axe = require('./axe_cmd')
const spinner = require('./spinner')
const inSequence = require('./insequence')
const chalk = require('chalk')

const packageJson = require('../package.json')
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
        describe: 'Comma separated list of URLs'
      })
      .argv

const {
  table,
  getBorderCharacters
} = require('table')

const getConfig = require('./getConfig')

const progressBar = spinner()
const destFolder = './output'
const ver = packageJson.version

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
const runOnly = process.env.npm_config_runOnly ? process.env.npm_config_runOnly.split(',') : argv.runOnly ? argv.runOnly.split(','): []

;(async ()=>{
  const config = await getConfig()  
  const urlsObj = config.urls
  const ax_Results = []
  const keys = Object.keys(urlsObj).filter(k => runOnly.length ? runOnly.includes(k) : true)
  
  const tests = keys.map((name, i) => testUrl.bind(
      null,
      name,
      i + 1,
      keys.length,
      {
        ...config.default,
        ...urlsObj[name].options,
        logo: reportLogo
      }
    )
  )
  const start = Date.now()
  
  inSequence(tests).then(() => {
    log()
    log(`🕑 Completed in ${chalk.green((Date.now() - start) / 1000)}s.`)
    log()
  
    log(chalk.bgBlackBright.black(' Report: '))
    log(formatAsTable(ax_Results))
  
    generateGlobalHtmlReport(ax_Results, `${destFolder}/globalReport.html`)
  
    log(`Global report available here: 🔗 ${chalk.blue(`${destFolder}/globalReport.html`)}`)
    log()
  })
  
  async function testUrl(name, i, length, options) {
    const url = urlsObj[name].url
    log()
    log(`Test ${i}/${length} => ${chalk.bold(name)} `)
  
    let start = Date.now()
  
    const opts = {
      ...options,
      destFolder,
      events: {
        onSuccess: (msg, icon) => progressBar.success(msg, icon),
        onAttempt: (msg, theme='dots2', trackTime) => {
          progressBar.start({
            label: msg,
            theme,
            trackTime
          })
        },
        onTest: (msg) => {
          progressBar.start({
            label: `Testing ${msg} `,
            theme: 'fish'
          })
        },
        onError: (err) => progressBar.fail(err)
      }
    }
  
    const axResults = await axe.test({
      url,
      name
    }, opts)
    
    progressBar.success(`done: ${(Date.now()- start)/1000}s.`)
    ax_Results.push(...axResults)
  }
  
  function formatAsTable(results) {
    const config = {
      border: getBorderCharacters(`norc`)
    };
  
    const data = results.map(item => {
      const {
        Critical,
        Serious,
        Moderate,
        Minor,
        Page,
        Url,
        Report,
      } = item.summary
  
      return [
        `${Critical?chalk.yellow.bgRed(Critical):chalk.green('-')}`,
        `${Serious?chalk.red(Serious):chalk.green('-')}`,
        `${Moderate?chalk.yellowBright(Moderate):chalk.green('-')}`,
        `${Minor?chalk.yellow(Minor):chalk.grey('-')}`,
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
