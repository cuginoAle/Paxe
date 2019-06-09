const { AxePuppeteer } = require('axe-puppeteer')
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setBypassCSP(true)
 
    await page.goto('https://telus.com')
    const options = {
      runOnly: ['wcag2a', 'wcag2aa'],
      resultTypes: ["violations"]
    }
    
    await page.setViewport({
      width: 800,
      height: 1000
    })

    const results = await new AxePuppeteer(page)
    .options(options)
    .analyze()

    console.log(results.violations.length)
    results.violations.forEach(v => console.log(v.description))

    await page.screenshot({
      path: 'telus.com.png',
      fullPage: true
    });

    await page.close()
    await browser.close()
})()