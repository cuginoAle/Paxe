const viewports = [
  { "width": 320, "height": 568 },
  { "width": 800, "height": 600 },
  { "width": 1280, "height": 1024 }
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
  }
}
