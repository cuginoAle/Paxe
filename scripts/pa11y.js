const fs = require('fs')
const chalk = require('chalk')

const html = require('@cuginoale/pa11y-report-html')
const pa11y = require('pa11y')
const spinner = require('./spinner')
const inSequence = require('./insequence')

// importing the urls to check list
const urlsObj = require('./urls')
const errorsList = []

const {
  log,
  clear,
  table
} = console
const output = './output'
const bar = spinner('fish')

// clearing the terminal
clear()

// see docs here: https://github.com/pa11y/pa11y
const defaultOptions = (name) => {
  return {
    screenCapture: `${output}/${name}.png`,
    timeout: 40000
  }
}

const checks = Object.keys(urlsObj).map(name => processUrl.bind(null, name))

inSequence(checks).then(() => {
  log('-----------------')

  table(errorsList.map(item => {
    return {
      'Issues Count': item.issues.length,
      'Page': item.documentTitle,
      'Report': item.htmlReport
    }
  }))
})

async function processUrl (name) {
  const url = urlsObj[name].url
  const start = Date.now()

  let urlOpts = {
    ...defaultOptions(name),
    ...urlsObj[name].options
  }

  log()
  log(`Testing: ${name} (${url})`)

  bar.start()

  try {
    return pa11y(
      url,
      urlOpts
    ).then(async results => {
      bar.stop()
      await processResults({
        results,
        url,
        name
      })
      log(`🕑 Completed in ${chalk.green((Date.now() - start) / 1000)}s.`)
    })
  } catch (error) {
    log('')
    log('*** *** ***')
    log(chalk.white.underline(`${name} (${url}) `))
    log(chalk.bgRed.yellow(` ${error} `))
    log('*** *** ***')
    log('')
  }
}

async function processResults ({ results, name }) {
  const fileName = `${output}/${name}.html`
  const htmlResults = await html.results(results, `${name}.png`)

  fs.writeFileSync(fileName, htmlResults)

  if (results.issues.length) {
    errorsList.push({ ...results, htmlReport: fileName })
    log(chalk.white.bgRed(` Found: ${results.issues.length} errors, see report here => ${chalk.underline(fileName)}`))
  } else {
    log(chalk.green('No errors...'))
  }
}
