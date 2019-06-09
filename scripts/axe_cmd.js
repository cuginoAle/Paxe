const { AxePuppeteer } = require('axe-puppeteer')
const puppeteer = require('puppeteer');
const chalk = require('chalk')

 async function test ({name, url},opts={}) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setBypassCSP(true)
 
    await page.goto(url)
    const options = {      
      runOnly: ['wcag2a', 'wcag2aa'],
      resultTypes: ["violations"],
      ...opts.runOnly,
      ...opts.resultTypes,
    }
    
    if(opts.viewport){
      await page.setViewport(opts.viewport)
    }

    const results = await new AxePuppeteer(page)
      .options(options)
      .analyze()

    await page.screenshot({
      path: `./output/${name}.png`,
      fullPage: true
    });

    await page.close()
    await browser.close()

    return {
      summary: {
        'Issues count': `${results.violations.length?chalk.red(results.violations.length):chalk.green(results.violations.length)}`,
        'Page': `${name} -> ${chalk.blue(url)}`,
        'Report': `./output/${name}.html`
      },
      report: null
    }
}
module.exports = {test}