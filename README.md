[![CircleCI](https://circleci.com/gh/Deutsche-Boerse-Risk/DAVe-UI.svg?style=shield)](https://circleci.com/gh/Deutsche-Boerse-Risk/DAVe-UI)
[![codebeat badge](https://codebeat.co/badges/00b6a48f-2424-4a89-a3bb-6c37495fe1df)](https://codebeat.co/projects/github-com-deutsche-boerse-risk-dave-ui)
[![Dependency Status](https://dependencyci.com/github/Deutsche-Boerse-Risk/DAVe-UI/badge)](https://dependencyci.com/github/Deutsche-Boerse-Risk/DAVe-UI)
[![Coverage Status](https://coveralls.io/repos/github/Deutsche-Boerse-Risk/DAVe-UI/badge.svg)](https://coveralls.io/github/Deutsche-Boerse-Risk/DAVe-UI)

# DAVe - Front-end

**DAVe** is **D**ata **A**nalytics and **V**isualisation S**e**rvice. It is free open source client which connects to [Eurex Clearing Enhanced Risk Interface](http://www.eurexclearing.com/clearing-en/risk-management/system-based-risk-controls/post-trade-risk-control/enhanced-risk-interface) AMQP interface (ERS). It provides a UI and REST interface to access latest as well as historical data data received over ERS.

![DAVe - Dashboard](https://github.com/Deutsche-Boerse-Risk/DAVe-UI/blob/master/doc/dave-screenshots.gif "DAVe - Dashboard")

## Browser support (tested via [BrowserStack](https://www.browserstack.com))
| ![Chrome](https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/32/chrome.png) Chrome | ![Firefox](https://cdn2.iconfinder.com/data/icons/humano2/32x32/apps/firefox-icon.png) Firefox | ![Edge](https://cdn4.iconfinder.com/data/icons/picons-social/57/56-edge-2-32.png) Edge | ![IE](https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/internet_explorer-32.png) IE | ![Safari](https://cdn1.iconfinder.com/data/icons/logotypes/32/safari-32.png) Safari | ![iOS](https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/iOS-32.png) iOS |
|:------:|:-------:|:----:|:------:|:------:|:-------:|
| Latest |  Latest |  15  |   11   |   10   |  9.1+\* |
|  50    |   50    |  14  |   10\*   |   9.1  |         |

\* In IE 10 and iOS the application is working, but with layout issues. 

## Prerequisites (For the first time only)
 
 - Install [npm@5](http://blog.npmjs.org/post/85484771375/how-to-install-npm) first.
 - If you already have NPM update to latest version using `npm i -g npm@5`. Use `sudo` if necessary.
 - You may need to setup http(s) proxy using:
      - `npm config set proxy http://proxy.company.com:8080`
      - `npm config set https-proxy http://proxy.company.com:8080`
 - Run `npm i` to download necessary packages.
 - Run commands in the following section.

## Before each build
To ensure you have always up-to-date dependecies run following commands:

 - Install Grunt CLI using `npm i -g grunt-cli`. Use `sudo` if necessary. 
 - Run `npm up` to update already downloaded packages.

## Build distribution package

Build the UI using:
```bash
grunt dist
``` 
This will generate a new folder `dist` that contains all files needed for distribution.

## Testing distribution package
You can test distribution package using the following command:
```bash
grunt dist-run
```
This will start a simple web server. A Chrome browser will be started automatically. If you don't want to use Chrome 
for whatever reason you need to modify `gruntfile.js`. Add the following lines: 
```javascript
var browsers = require('@dbg-riskit/dave-ui-common/tools/browser-providers.conf');
grunt.config.set('browserSync.options.browser', 
    browsers.BrowserSyncBorwsers.FIREFOX);
```
  
## Run in development mode
 - Point your UI to the host, where the back-end for DAVe is running
   - see `restUrl.js` file
 - Update development and runtime dependencies by calling `npm up`.
 - Run `grunt run` to start the simple web server. A Chrome browser will be started automatically. If you don't want to 
 use Chrome for whatever reason you need to modify `gruntfile.js`. Add the following lines:  
 
```javascript
var browsers = require('@dbg-riskit/dave-ui-common/tools/browser-providers.conf');
grunt.config.set('browserSync.options.browser', 
    browsers.BrowserSyncBorwsers.FIREFOX);
```
 - Whenever there is a change to the files related to the UI, the server gets notified immediately - no restart is needed.

## Executing tests
To execute all test suites locally you can run one of the following commands:
 - `grunt test` - To run Karma tests in locally installed IE, Chrome, Safari and Firefox
 - `grunt testIE` - To run Karma tests in locally installed IE
 - `grunt testChrome` - To run Karma tests in locally installed Chrome
 - `grunt testFirefox` - To run Karma tests in locally installed Firefox
 - `grunt testSafari` - To run Karma tests in locally installed Safari
 
To execute Karma runner in debug mode use one of the following commands:
```bash
grunt testDebug
grunt testIEDebug
grunt testChromeDebug
grunt testFirefoxDebug
grunt testSafariDebug
```

You can run also tests using [BrowserStack](https://www.browserstack.com) cloud provider. To run these tests you need
to define following environment variables first:
```bash
export BROWSER_STACK_USERNAME=...
export BROWSER_STACK_ACCESS_KEY=...
```
Then you can run:
```bash
grunt testBrowserStack
```

If you are located behind a company proxy you will need to export also `HTTP_PROXY` variable.

Then run `grunt testBrowserStackProxy` instead.

There are also tasks to run BrowserStack based tests only for a selected browser:
```bash
# BrowserStack test tasks
grunt testBrowserStackChrome
grunt testBrowserStackFirefox
grunt testBrowserStackEdge
grunt testBrowserStackIE
grunt testBrowserStackSafari
grunt testBrowserStackIOS

# BrowserStack (behind proxy) test tasks
grunt testBrowserStackProxyChrome
grunt testBrowserStackProxyFirefox
grunt testBrowserStackProxyEdge
grunt testBrowserStackProxyIE
grunt testBrowserStackProxySafari
grunt testBrowserStackProxyIOS

# BrowserStack test tasks (in debug mode)
grunt testBrowserStackChromeDebug
grunt testBrowserStackFirefoxDebug
grunt testBrowserStackEdgeDebug
grunt testBrowserStackIEDebug
grunt testBrowserStackSafariDebug
grunt testBrowserStackIOSDebug

# BrowserStack (behind proxy) test tasks (in debug mode)
grunt testBrowserStackProxyChromeDebug
grunt testBrowserStackProxyFirefoxDebug
grunt testBrowserStackProxyEdgeDebug
grunt testBrowserStackProxyIEDebug
grunt testBrowserStackProxySafariDebug
grunt testBrowserStackProxyIOSDebug
```

# Docker image to run standalone UI
[DAVe-UI Docker image](dockerfile)
