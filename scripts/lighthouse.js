const fs = require('fs')
const chalk = require('chalk')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const spinner = require('./spinner')
const inSequence = require('./insequence')
// importing the urls to check list
const urlsObj = require('./urls')

let errorsList = []
const {
  log,
  clear,
  table
} = console

const opts = {
  output: 'html',
  chromeFlags: ['--headless', '--disable-gpu'],
  onlyCategories: ['accessibility']
}
const start = Date.now()

clear()

const checks = Object.keys(urlsObj).map(name => processUrl.bind(null, name))
const bar = spinner('fish')

inSequence(checks).then(() => {
  log(`🕑 Completed in ${chalk.green((Date.now() - start) / 1000)}s.`)
  table(errorsList)
})

function launchChromeAndRunLighthouse (url, opts, config = null) {
  return chromeLauncher.launch({
    chromeFlags: opts.chromeFlags
  }).then(chrome => {
    opts.port = chrome.port
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => ({
        html: results.report,
        js: results.lhr
      }))
    })
  })
}

async function processUrl (name) {
  const url = urlsObj[name].url

  log()
  log(`Testing: ${name} (${url})`)

  bar.start()

  const results = await launchChromeAndRunLighthouse(url, opts)

  // Use results!
  fs.writeFileSync(`./output/${name}.html`, results.html)

  const issues = Object.keys(results.js.audits).filter(key => results.js.audits[key].score === 0)
  bar.stop()

  if (issues.length) {
    errorsList.push({
      'Issues count': issues.length,
      'Page': results.js.finalUrl,
      'Report': `./output/${name}.html`
    })
    log(chalk.white.bgRed(` Found: ${issues.length} errors, see report here => ${chalk.underline(`./output/${name}.html`)}`))
  } else {
    log(chalk.green('No errors...'))
  }
}
