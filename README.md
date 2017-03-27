[![CircleCI](https://circleci.com/gh/Deutsche-Boerse-Risk/DAVe-UI.svg?style=shield)](https://circleci.com/gh/Deutsche-Boerse-Risk/DAVe-UI)
[![codebeat badge](https://codebeat.co/badges/00b6a48f-2424-4a89-a3bb-6c37495fe1df)](https://codebeat.co/projects/github-com-deutsche-boerse-risk-dave-ui)
[![Dependency Status](https://dependencyci.com/github/Deutsche-Boerse-Risk/DAVe-UI/badge)](https://dependencyci.com/github/Deutsche-Boerse-Risk/DAVe-UI)
[![Coverage Status](https://coveralls.io/repos/github/Deutsche-Boerse-Risk/DAVe-UI/badge.svg)](https://coveralls.io/github/Deutsche-Boerse-Risk/DAVe-UI)

# DAVe - Front-end

**DAVe** is **D**ata **A**nalytics and **V**isualisation S**e**rvice. It is free open source client which connects to [Eurex Clearing Enhanced Risk Interface](http://www.eurexclearing.com/clearing-en/risk-management/system-based-risk-controls/post-trade-risk-control/enhanced-risk-interface) AMQP interface (ERS). It provides a UI and REST interface to access latest as well as historical data data received over ERS.

![DAVe - Dashboard](https://github.com/Deutsche-Boerse-Risk/DAVe-UI/blob/master/doc/dave-screenshots.gif "DAVe - Dashboard")

## Browser support (tested via [BrowserStack](https://www.browserstack.com))
| ![Chrome](https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/32/chrome.png) Chrome | ![Firefox](https://cdn2.iconfinder.com/data/icons/humano2/32x32/apps/firefox-icon.png) Firefox | ![Edge](https://cdn4.iconfinder.com/data/icons/picons-social/57/56-edge-2-32.png) Edge | ![IE](https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/internet_explorer-32.png) IE | ![Safari](https://cdn1.iconfinder.com/data/icons/logotypes/32/safari-32.png) Safari |
|:------:|:-------:|:----:|:--:|:------:|
| Latest |  Latest |  14  | 11 |   10   |
|  50    |   50    |  13  | 10 |   9.1  |
|        |         |      |    |   8    |
|        |         |      |    |   7.1  |

## Prerequisites (For the first time only)
 
 - Install [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) first.
 - You may need to setup http(s) proxy using:
      - `npm config set proxy http://proxy.company.com:8080`
      - `npm config set https-proxy http://proxy.company.com:8080`
 - Run commands in the following section.

## Before each build
To ensure you have always up-to-date dependecies run following commands:

**On Linux or Mac environment you can simply run:**
 - Install all dependencies by running `./update-dev.sh`. Use `sudo` if necessary.
 
**On Windows you need to follow these steps:**
 - Install Grunt CLI using `npm install -g grunt-cli`. 
 - Install `npm install -g typescript`. TypeScript compiler is required to install project dependencies.
 - Run `npm install` to download necessary packages.
 - Run `npm update` to update already downloaded packages.
 - Run `npm prune` to remove old or no more used dependencies.

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
for whatever reason you need to modify `gruntfile.js` and check for the following section: 
```javascript
browserSync: { 
 options: {
     browser: ['firefox'] 
 } 
}
```
  
## Run in development mode
 - Point your UI to the host, where the back-end for DAVe is running
   - see `restUrl.js` file
 - Update development and runtime dependencies by calling `npm update`.
 - Run `grunt run` or `npm start` to start the simple web server. A Chrome browser will be started automatically. 
 If you don't want to use Chrome for whatever reason you need to modify `gruntfile.js` and check for the following section: 
 
 ```javascript
 browserSync: { 
    options: {
        browser: ['firefox'] 
    } 
 }
 ```
 - Whenever there is a change to the files related to the UI, the server gets notified immediately - no restart is needed.

## Executing tests
To execute all test suites locally you can run one of the following commands:
 - `grunt test` - To run Karma tests in locally installed IE, Chrome and Firefox
 - `grunt testIE` - To run Karma tests in locally installed IE
 - `grunt testChrome` - To run Karma tests in locally installed Chrome
 - `grunt testFirefox` - To run Karma tests in locally installed IE, Chrome and Firefox

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

If you are located behind a company proxy you will need to export also `HTTP_PROXY` variable. You need to download 
[BrowserStack tunel binary](https://www.browserstack.com/local-testing#command-line) manualy. Store it under:
```
<project_root>/browserStackBin/BrowserStackLocal(.exe)
```
Then run `grunt testBrowserStackProxy` instead.

# Docker image to run standalone UI
[DAVe-UI Docker image](dockerfile)
