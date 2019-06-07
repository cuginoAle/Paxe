const html = require('@cuginoale/pa11y-report-html')
const pa11y = require('pa11y')
const chalk = require('chalk')

// see docs here: https://github.com/pa11y/pa11y

async function test ({ url, name }, opts, config = null) {
  const results = await processUrl(url, name, opts)

  return {
    summary: {
      'Issues count': `${results.issues.length?chalk.red(results.issues.length):chalk.green(results.issues.length)}`,
      'Page': `${chalk.yellow(name)} -> ${chalk.blue(url)}`,
      'Report': `./output/pa_${name}.html`
    },
    report: results.htmlReport
  }
}

function processUrl (url, name, opts) {
  return pa11y(
    url,
    opts
  ).then(async results => {
    const htmlReport = await html.results(results, `${name}.png`)
    return {
      ...results,
      htmlReport
    }
  })
}

module.exports = { test }
