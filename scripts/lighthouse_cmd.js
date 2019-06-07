const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const chalk = require('chalk')

async function test ({ url, name }, opts, config = null) {
  const results = await launchChromeAndRunLighthouse(url, opts, config)

  const issues = Object.keys(results.js.audits).filter(key => results.js.audits[key].score === 0)

  return {
    summary: {
      'Issues count': `${issues.length?chalk.red(issues.length):chalk.green(issues.length)}`,
      'Page': `${chalk.yellow(name)} -> ${chalk.blue(url)}`,
      'Report': `./output/${name}.html`
    },
    report: results.html
  }
}

function launchChromeAndRunLighthouse (url, opts, config) {
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

module.exports = { test }
