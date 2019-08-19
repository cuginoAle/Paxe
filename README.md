``` 
___           ___
|__)  /\  \_/ |__
|    /--\ / \ |___            
-----------------------------------
Puppeteer & Axe ♿ testing framework
```
Paxe is an automated accessibility testing tool based on [Puppeteer](https://github.com/GoogleChrome/puppeteer) and [Axe](https://github.com/dequelabs/axe-core).
It runs from the command line and generates HTML reports for each page and each viewport analysed.

**It is still a WIP, feedbacks and contributions are highly appreciated!**

# Get started
For a quick test you can run:
```shell
- $> npx @cuginoale/paxe
```


If you plan to use it frequently or if it's going to be part of your workflow:
```shell
- $> npm i -g @cuginoale/paxe
- $> cd path/to/your/project/folder
- $> paxe
```

On first run Paxe will look for the `.paxerc` in the current folder. If it can't find it, Paxe wizard will guide you through the steps to create a basic configuration file (still w.i.p.)

The `.paxerc` file is basically a JSON object, structured as follows:
```jsonc
{
  "default": {
    "viewports": [
      {
        "width": "xx",
        "height": "yy"
      },
      ...
    ],
    "outputFolder": "output",
    "authenticate": {
      "username": "user",
      "password": "pwd"
    }
  },
  "urls": {
    "friendly_name":{
      "url":"http://my_target_website",
      "options":{
        "actions":[
          {"click":"button.sc-fONwsr.dRSxZO"},
          {"waitFor": 1000}
        ],
        "viewports": [
          {
            "width": "xx",
            "height": "yy"
          },
          ...
        ],
        "authenticate": {
          "username": "user",
          "password": "pwd"
        }
      }
    },
    ...
}
```

`default` contains the settings applied to all the urls to test.
Url specific settings can be defined in the url `options` section.

The `options` section for each `url` is optional and can contain:
- `actions` to perform before the test is run
- specific `vieports`
- basic HTTP authentication settings

The `actions` available are all the actions Puppeteer is capable to run on the `page` object [see relevant doc](https://github.com/GoogleChrome/puppeteer/blob/v1.18.1/docs/api.md)

## Cli
```shell
$> paxe --help

Usage: paxe [<option>]

Options:
  --help         Show help                                             [boolean]
  --version      Show version number                                   [boolean]
  --runOnly, -o  Comma separated list of URLs (friendly names)
```
To test only some of the URLs listed in the `.paxerc` file use `--runOnly` or `-o` followed by the `friendly name` of the urls to test:

```shell
$> paxe -o site1,site2,site3
```

---

## Report example:

![](https://i.imgur.com/lmATBiI.png)
