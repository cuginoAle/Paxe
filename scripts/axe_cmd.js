const inSequence = require('./insequence')

const {
  AxePuppeteer
} = require('axe-puppeteer')
const puppeteer = require('puppeteer');
const chalk = require('chalk')

async function test({ name,url }, opts = {}) {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const results = []
  await page.setBypassCSP(true)

  const {viewports, runOnly, resultTypes, events = ()=>{}, ...optRest} = opts

  await page.goto(url)
  events.onLoad()

  const options = {
    runOnly: ['wcag2a', 'wcag2aa'],
    resultTypes: ["violations"],
    ...runOnly,
    ...resultTypes,
  }

  const mergedOptions = {...options, ...optRest}

  if (viewports) {
    const vpTests = opts.viewports.map( vp => prepare.bind(null, {vp, name, url, page, mergedOptions, results, events}))

    await inSequence(vpTests)    
    await page.close()
    await browser.close()

    return results
  }
  //running a single test
  results.push(await runTest(name, url, page, mergedOptions))

  await page.close()
  await browser.close()
  return results

}

async function prepare({vp, name, url, page, options, results, events }){
  
  events.onResize(`${vp.width} x ${vp.height}`)
  await page.setViewport(vp)

  events.onTest(`${vp.width} x ${vp.height}`)
  results.push(await runTest({name, url, page, options}))
}

async function runTest({
  name,
  url,
  page,
  options
}) {

  const results = await new AxePuppeteer(page)
    .options(options)
    .analyze()

  await page.screenshot({
    path: `./output/${name}.png`,
    fullPage: true
  });

  return {
    summary: {
      'Issues count': `${results.violations.length?chalk.red(results.violations.length):chalk.green(results.violations.length)}`,
      'Page': `${name} -> ${chalk.blue(url)}`,
      'Report': `./output/${name}.html`
    },
    report: null
  }
}

module.exports = {
  test
}