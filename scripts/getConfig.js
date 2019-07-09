const fs = require('fs')
const inquirer = require('inquirer')
const askForUrlSteps = require('./askForUrlSteps')

var path = require('path')

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

var currentPath = process.cwd()
const configPath = path.resolve(currentPath, '.paxerc')
const {
  log
} = console

const defaultSettings = {
  viewports: [{ 'width': 1440, 'height': 900 }]
}

module.exports = async () => {
  log(`Looking for .paxerc in: ${configPath}`)
  if (fs.existsSync(configPath)) {
    const c = JSON.parse(fs.readFileSync(configPath))

    return { ...{ defaultSettings }, urls: {}, ...c }
  } else {
    log("No config file found, let's create one!")
    log('')
    log('Default settings:')

    const wizardSettings = await inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select the viewports to test (multiple-choice)',
          name: 'viewports',
          choices: [
            { name: '360 x 640', value: { 'width': 360, 'height': 640 } },
            { name: '768 x 1024', value: { 'width': 768, 'height': 1024 } },
            { name: '1440 x 900', value: { 'width': 1440, 'height': 900 } }
          ],
          validate: function (answer) {
            if (answer.length < 1) {
              return 'You must choose at least one size.'
            }

            return true
          }
        },
        {
          type: 'fuzzypath',
          message: 'Select a folder to save the reports in',
          name: 'outputFolder',
          excludePath: nodePath => {
            return nodePath.indexOf('.git') > -1 ||
            nodePath.indexOf('node_modules') > -1
          },
          rootPath: './',
          default: 'output',
          itemType: 'directory'
        }
      ])
    const basicAuthentication = await inquirer.prompt(
      {
        type: 'confirm',
        message: 'Is basic HTTP authentication required?',
        name: 'required',
        default: false
      }
    )

    if (basicAuthentication.required) {
      const authName = await inquirer.prompt({
        type: 'input',
        name: 'username',
        message: 'Username: ',
        validate: function (answer) {
          if (answer.length < 1) {
            return 'Invalid username'
          }

          return true
        }
      })

      const authPwd = await inquirer.prompt({
        type: 'password',
        name: 'password',
        message: 'Password: ',
        validate: function (answer) {
          if (answer.length < 1) {
            return 'Invalid password'
          }

          return true
        }
      })

      wizardSettings.authenticate = {
        username: authName.username,
        password: authPwd.password
      }
    }

    log()
    log('==== Pages to analyse ====')

    const urlsObj = {}

    await addUrl(urlsObj)

    const config = {
      default: { ...defaultSettings, ...wizardSettings },
      urls: urlsObj
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    log('Wrote: ', configPath)

    return config
  }
}

async function addUrl (urlsObj) {
  const answers = await inquirer.prompt(askForUrlSteps)
  const url = answers.url.indexOf('http://') === 0 ? answers.url : `http://${answers.url}`

  urlsObj[answers.name] = { url }

  if (answers.askAgain) {
    await addUrl(urlsObj)
  }
}
