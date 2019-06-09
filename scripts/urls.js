// channels_mobile:{
//   url:'http://telus.com/en/shop/home/pik/channels',
//   options:{
//     rootElement: 'main>section',
//     viewport: { "width": 480, "height": 600 }
//   }
// },
// channels_desktop:{
//   url:'http://telus.com/en/shop/home/pik/channels',
//   options:{
//     rootElement: 'main>section',
//     viewport: { "width": 1280, "height": 1024 }
//   }
// }

module.exports = {
  channels:{
    url:'http://telus.com/en/shop/home/pik/channels',
    options:{
      viewports: [
        { "width": 320, "height": 568 },
        { "width": 800, "height": 600 },
        { "width": 1280, "height": 1024 }
      ]
    }
  },
  panels:{
    url:'http://telus.com/en/shop/home/pik/panels',
    options:{
      viewports: [
        { "width": 320, "height": 568 },
        { "width": 800, "height": 600 },
        { "width": 1280, "height": 1024 }
      ]
    }
  },
  addons:{
    url:'http://telus.com/en/shop/home/pik/addons',
    options:{
      viewports: [
        { "width": 320, "height": 568 },
        { "width": 800, "height": 600 },
        { "width": 1280, "height": 1024 }
      ]
    }
  }
}
