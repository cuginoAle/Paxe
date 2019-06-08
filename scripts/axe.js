
const { AxePuppeteer } = require('axe-puppeteer')
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setBypassCSP(true)
 
    await page.goto('https://bbc.com')
    const options = {
      runOnly: ['wcag2a', 'wcag2aa']
    }
    
    await page.setViewport({
      width: 1280,
      height: 1000
    })

    const results = await new AxePuppeteer(page).options(options).analyze()
    console.log(results.violations.length)
    results.violations.forEach(v => console.log(v.description))
    

    await page.screenshot({
      path: 'bbc.com.png',
      fullPage: true
    });

    await page.close()
    await browser.close()
})()




// let chrome = require('selenium-webdriver/chrome');
// let chromedriver = require('chromedriver');


// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// var selenium = require('selenium-webdriver'),
//   By = selenium.By,
//   util = selenium.util,
//   AxeBuilder = require('axe-webdriverjs'),
//   fs = require('fs');


// chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

// const options = new chrome.Options();
// options.addArguments('headless');
// options.addArguments('disable-gpu')

// const {
//   log,
//   table
// } = console

// const driver = new selenium.Builder()
//   .forBrowser('chrome')
//   .setChromeOptions(options)
//   .build();


// driver.get('http://bbc.com').then(async () => {
//   const html = await driver.getPageSource()
//   log('got the html...')
//   const { window } = new JSDOM(html);

//   global.document = window.document;
// 	global.window = window;

// 	// needed by axios lib/helpers/isURLSameOrigin.js
// 	global.navigator = window.navigator;

// 	// needed by axe /lib/core/public/run.js
// 	global.Node = window.Node;
// 	global.NodeList = window.NodeList;

// 	// needed by axe /lib/core/base/context.js
// 	global.Element = window.Element;
//   global.Document = window.Document;

//   const axeCore = require('axe-core')

//   // const axeContainer = document.createElement('div');
//   //   axeContainer.innerHTML = html

//   //   // aXe requires real Nodes so we need to inject into Jests' jsdom document.
//   //   document.body.appendChild(axeContainer)
//   var n = window.document.getElementById('main');
  
//   axeCore.run(n,{},((err, res) => {
//     res.violations.forEach(v => log(v.description))
//     driver.quit()
//   }))

//   // promo.getAttribute("outerHTML").then(data => {
//   //   log(data)
//   // })
//   // const data = await promo.takeScreenshot()
  
//   // fs.writeFileSync('bbc.png', data, 'base64')

//   // axeCore.run()
//   // AxeBuilder(driver)
//   //   .analyze(function(err, results) {
//   //       log(err)      
//   //       console.log('Accessibility Violations: ', results.violations.length);
//   //       if (results.violations.length > 0) {
//   //           log(results.violations.length);
//   //       }
//   //       // expect(results.violations.length).toBe(0);
//   //       // done();
//   //       driver.quit()
//   //   })
  
// })