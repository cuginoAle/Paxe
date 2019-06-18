const fs = require('fs')
const inSequence = require('./insequence')
const htmlReport = require('axe_html_report')

const {
  AxePuppeteer
} = require('axe-puppeteer')
const puppeteer = require('puppeteer')

async function test ({ name, url }, opts = {}) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const results = []
  await page.setBypassCSP(true)

  const { viewports, authenticate, actions, runOnly, resultTypes, events = () => {}, destFolder, logo, ...optRest } = opts

  if (authenticate) {
    events.onAttempt(`authenticating...`)
    await page.authenticate(authenticate)
    events.onSuccess('autenthicated', '🔓')
  }

  events.onAttempt('loading... ', 'earth', true)
  await page.goto(url)
  events.onSuccess('loaded')

  if (actions) {
    const actionsSet = actions.map(a => {
      const key = Object.keys(a)[0]
      return performAction.bind(null, page, key, a[key], events)
    })
    await inSequence(actionsSet)
  }

  const options = {
    runOnly: ['wcag2a', 'wcag2aa', 'best-practice'],
    resultTypes: ['violations', 'incomplete'],
    ...runOnly,
    ...resultTypes
  }

  const mergedOptions = { ...options, ...optRest }

  if (viewports) {
  // const {viewports, runOnly, resultTypes, events = ()=>{}, destFolder, logo, ...optRest} = opts
    const vpTests = opts.viewports.map(vp => prepare.bind(null, { vp, name, url, page, mergedOptions, results, events, destFolder, logo }))

    await inSequence(vpTests)
    await page.close()
    await browser.close()

    return results
  }
  // running a single test
  results.push(async () => {
    return runTest(name, url, page, mergedOptions)
  })

  await page.close()
  await browser.close()
  return results
}

async function performAction (page, key, value, events) {
  events.onAttempt(`Action: ${key} `)

  try {
    switch (key) {
      case 'click':
        await page.click(value)
        break

      case 'waitFor':
        await page.waitFor(value)
        break

      default:
        break
    }
  } catch (error) {
    events.onError(`action error: ${error}`)
    return
  }

  events.onSuccess(`${key}: ${value}`, '⚡')
}

async function prepare ({ vp, name, url, page, options, results, events, destFolder, logo }) {
  await page.setViewport(vp)
  events.onSuccess(`Resized to ${vp.width} x ${vp.height}`)

  events.onTest(`${vp.width} x ${vp.height}`)
  results.push(await runTest({ name: `${name}_${vp.width}x${vp.height}`, url, page, options, destFolder, logo }))
}

async function runTest ({
  name,
  url,
  page,
  options,
  destFolder,
  logo
}) {
  const results = await new AxePuppeteer(page)
    .options(options)
    .analyze()

  // await page.screenshot({
  //   path: `${destFolder}/${name}.png`,
  //   fullPage: true
  // });

  const critical = results.violations.filter(v => v.impact === 'critical')
  const serious = results.violations.filter(v => v.impact === 'serious')
  const moderate = results.violations.filter(v => v.impact === 'moderate')
  const minor = results.violations.filter(v => v.impact === 'minor')

  const targetElements = []
  const screenshotName = `marked_${name}.png`

  results.violations.forEach(v => {
    v.nodes.forEach(node => {
      node.target.forEach(target => {
        targetElements.push(target)
      })
    })
  })

  await page.addStyleTag({ content: `
    ${targetElements.join(',')}{
      box-shadow: 0px 0px 5px 1px red;
    }
  ` })

  await page.screenshot({
    path: `${destFolder}/${screenshotName}`,
    fullPage: true
  })

  const html = htmlReport({
    title: `${name}`,
    url,
    logo,
    issues: results.violations,
    incomplete: results.incomplete,
    screenshot: screenshotName
  })

  const fileName = `${destFolder}/${name}.html`

  fs.writeFileSync(fileName, html)

  return {
    summary: {
      'Critical': critical.length,
      'Serious': serious.length,
      'Moderate': moderate.length,
      'Minor': minor.length,
      'Page': name,
      'Url': url,
      'Report': fileName
    },
    report: null
  }
}

module.exports = {
  test
}
