const fs = require('fs')
const inquirer = require('inquirer');
var path = require('path');

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

const configPath = path.resolve(__dirname, '../.paxerc')
const {
  log
} = console

module.exports = async ()=>{
  
  if (fs.existsSync(configPath)){
    const c = JSON.parse(fs.readFileSync(configPath))
    return c
  }else{    
    log("No config file found, let's create one!")
    log("")
    log("Default settings:")
    
    const defaultSettings = await inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select the viewports to test (multiple-choice)',
          name: 'viewports',
          choices: [
            { name: '360 x 640', value:{"width": 360, "height": 640 }},
            { name: '768 x 1024', value:{"width": 768, "height": 1024 }},
            { name: '1440 x 900', value:{"width": 1440, "height": 900 }}            
          ],
          validate: function(answer) {
            if (answer.length < 1) {
              return 'You must choose at least one size.';
            }
    
            return true;
          }
        },
        {
          type: 'fuzzypath',
          message: 'Select a folder to save the reports in',
          name: 'outputFolder',
          excludePath: nodePath => {
            return nodePath.startsWith('.git') ||
            nodePath.startsWith('node_modules')
          },
          rootPath: './',
          default:'output',
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
    
    if(basicAuthentication.required){
      const authName = await inquirer.prompt({
        type: 'input',
        name: 'username',
        message: "Username: ",
        validate: function(answer) {
          if (answer.length < 1) {
            return 'Invalid username';
          }
  
          return true;
        }
      })

      const authPwd = await inquirer.prompt({
        type: 'password',
        name: 'password',
        message: "Password: ",
        validate: function(answer) {
          if (answer.length < 1) {
            return 'Invalid password';
          }
  
          return true;
        }
      })

      defaultSettings.authenticate = {
        username: authName.username,
        password: authPwd.password
      }
    }

      log()
      log("==== Pages to analyse ====")

      const urlsObj = {}
      const urlsToAnalyse = [
        {
          type: 'input',
          name: 'url',
          message: "What URL do you want to test? (you can omit `http://`)",
          validate: function(answer) {
            if (answer.length < 3) {
              return 'Invalid url';
            }
    
            return true;
          }
        },
        {
          type: 'input',
          name: 'name',
          message: "Let's give it a friendly name",
          validate: function(answer) {
            if (answer.length < 1) {
              return 'Please type at least 1 char.';
            }
    
            return true;
          }
        },
        {
          type: 'confirm',
          name: 'askAgain',
          message: 'Want to enter another URL (just hit enter for YES)?',
          default: true
        }
      ];

      async function ask() {
        const answers = await inquirer.prompt(urlsToAnalyse)
        const url = answers.url.indexOf('http://') === 0 ? answers.url : `http://${answers.url}`
        
        urlsObj[answers.name]={ url };
        
        if (answers.askAgain) {
          await ask();
        }
      }

      await ask()

      const config = {
        default: defaultSettings,
        urls: urlsObj
      }

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      log("Wrote: ", configPath)

      return config
  }

}