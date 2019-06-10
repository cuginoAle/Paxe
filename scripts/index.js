const axe = require('./axe_cmd')
const spinner = require('./spinner')
const inSequence = require('./insequence')
const chalk = require('chalk')
const { table, getBorderCharacters } = require ('table')
  
// importing the urls to check list
const urlsObj = require('../config')
const bar = spinner('earth')
const destFolder = './output'

const {
  log,
  clear
} = console

clear()
const ver = process.argv[2]

let paxeLogo=[
' __             ___ ',
'|__)   /\\  \\_/ |__  ',
`|     /~~\\ / \\ |___            ${ver}`,
'------------------------------------',
'Puppeteer & Axe ♿ testing framework',
''
]

paxeLogo.forEach(line => log(chalk.green(line)))

const ax_Results = []

// getting settings from CLI
const runOnly = process.env.npm_config_runOnly ? process.env.npm_config_runOnly.split(',') : []
const keys=Object.keys(urlsObj).filter(k => runOnly.length ? runOnly.includes(k) : true )

const tests = keys.map((name, i) => testUrl.bind(null, name, i+1, keys.length, urlsObj[name].options))
const start = Date.now()

inSequence(tests).then(() => {
  log()
  log(`🕑 Completed in ${chalk.green((Date.now() - start) / 1000)}s.`)
  log()

  log(chalk.bgBlackBright.black(' Report: '))
  log(formatAsTable(ax_Results))
})

async function testUrl (name, i, length, options) {
  const url = urlsObj[name].url
  log()
  log(`Test ${i}/${length} => ${chalk.bold(name)} `)

  let start = Date.now()
  bar.start({label: "loading... "})

  const opts = {
    ...options,
    destFolder,
    events:{
      onLoad:()=> bar.success('loaded'),
      onResize:(size)=> bar.start({label:`Resizing: ${size}`, theme:'dots'}),
      onTest:(label)=> {
        bar.success(`Resized to ${label}`)
        bar.start({label:`Testing ${label} `, theme:'fish'})
      }
    }
  }
  
  const axResults = await axe.test({ url, name }, opts)
  // fs.writeFileSync(axResults.summary.Report, axResults.report)
  bar.success(`done: ${(Date.now()- start)/1000}s.`)
  ax_Results.push(...axResults)
}


function formatAsTable(results){
  const config = {
    border: getBorderCharacters(`norc`)
  };

  const data=results.map(item => {    
    const {
      Critical,
      Serious,
      Moderate,
      Minor,
      Page,
      Report,
    } = item.summary
    
    return [
      Critical,
      Serious,
      Moderate,
      Minor,
      Page,
      `🔗 ${chalk.blue(Report)}`
    ]
  })

  return table([
    ['Critical', 'Serious','Moderate','Minor', 'Page', 'Report'],
    ...data
    ],
    config
  )  
}