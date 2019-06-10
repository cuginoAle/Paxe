const viewports = [
  { "width": 360, "height": 640 },
  { "width": 768, "height": 1024 },
  { "width": 1440, "height": 900 }
]

module.exports = {
  channels:{
    url:'http://telus.com/en/shop/home/pik/channels',
    options:{
      viewports
    }
  },
  plans:{
    url:'http://telus.com/en/shop/home/pik/plans',
    options:{
      viewports
    }
  },
  addons:{
    url:'http://telus.com/en/shop/home/pik/addons',
    options:{
      viewports
    }
  },
  BBC:{
    url:'http://bbc.com',
    options:{
      viewports
    }
  }
}
