const fs = require('fs')
const inSequence = require('./insequence')
const htmlReport = require('axe_html_report')

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

  const {viewports, runOnly, resultTypes, events = ()=>{}, destFolder, ...optRest} = opts

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
    const vpTests = opts.viewports.map( vp => prepare.bind(null, {vp, name, url, page, mergedOptions, results, events, destFolder}))

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

async function prepare({vp, name, url, page, options, results, events, destFolder }){
  
  events.onResize(`${vp.width} x ${vp.height}`)
  await page.setViewport(vp)

  events.onTest(`${vp.width} x ${vp.height}`)
  results.push(await runTest({name:`${name}_${vp.width}x${vp.height}`, url, page, options, destFolder}))
}

async function runTest({
  name,
  url,
  page,
  options,
  destFolder
}) {

  const results = await new AxePuppeteer(page)
    .options(options)
    .analyze()

  await page.screenshot({
    path: `${destFolder}/${name}.png`,
    fullPage: true
  });

  const critical = results.violations.filter(v => v.impact==='critical')
  const serious = results.violations.filter(v => v.impact==='serious')
  const moderate = results.violations.filter(v => v.impact==='moderate')
  const minor = results.violations.filter(v => v.impact==='minor')

  const targetElements = []
  const screenshotName = `marked_${name}.png`

  results.violations.forEach(v => {
    v.nodes.forEach(node => {
      node.target.forEach(target => {
        targetElements.push(target)        
      })
    })
  })
  
  await page.addStyleTag({content:`
    ${targetElements.join(',')}{
      box-shadow: 0px 0px 5px 1px red;
    }
  `})

  await page.screenshot({
    path: `${destFolder}/${screenshotName}`,
    fullPage: true
  })  

  const html = htmlReport({
    title: name,
    url,
    issues: results.violations,
    screenshot: screenshotName
  })

  const fileName = `${destFolder}/${name}.html`

  fs.writeFileSync(fileName, html)

  return {
    summary: {
      'Critical': `${critical.length?chalk.yellow.bgRed(critical.length):chalk.green(0)}`,
      'Serious': `${serious.length?chalk.red(serious.length):chalk.green(0)}`,
      'Moderate': `${moderate.length?chalk.yellowBright(moderate.length):chalk.green(0)}`,
      'Minor': `${minor.length?chalk.yellow(minor.length):chalk.green(0)}`,
      'Page': `${name} -> ${chalk.blue(url)}`,
      'Report': fileName
    },
    report: null
  }
}

module.exports = {
  test
}