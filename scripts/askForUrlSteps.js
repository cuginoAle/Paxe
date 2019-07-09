module.exports = [
  {
    type: 'input',
    name: 'url',
    message: 'What URL do you want to test? (you can omit `http://`)',
    validate: function (answer) {
      if (answer.length < 3) {
        return 'Invalid url'
      }

      return true
    }
  },
  {
    type: 'input',
    name: 'name',
    message: "Let's give it a friendly name",
    validate: function (answer) {
      if (answer.length < 1) {
        return 'Please type at least 1 char.'
      }

      return true
    }
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: 'Want to enter another URL (just hit enter for YES)?',
    default: true
  }
]
