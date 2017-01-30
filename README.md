[![CircleCI](https://circleci.com/gh/Deutsche-Boerse-Risk/DAVe-UI.svg?style=shield)](https://circleci.com/gh/Deutsche-Boerse-Risk/DAVe-UI)
[![codebeat badge](https://codebeat.co/badges/00b6a48f-2424-4a89-a3bb-6c37495fe1df)](https://codebeat.co/projects/github-com-deutsche-boerse-risk-dave-ui)

# DAVe - Front-end

**DAVe** is **D**ata **A**nalytics and **V**isualisation S**e**rvice. It is free open source client which connects to [Eurex Clearing Enhanced Risk Interface](http://www.eurexclearing.com/clearing-en/risk-management/system-based-risk-controls/post-trade-risk-control/enhanced-risk-interface) AMQP interface (ERS). It provides a UI and REST interface to access latest as well as historical data data received over ERS.

![DAVe - Dashboard](https://github.com/Deutsche-Boerse-Risk/DAVe-UI/blob/master/doc/dave-screenshots.gif "DAVe - Dashboard")

## Prerequisites (For the first time only)
 
 - Install [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) first.
 - Install Grunt CLI using `npm install -g grunt-cli`. Use `sudo` on Linux or Mac if necessary. You may need to setup http(s) proxy using:
   - `npm config set proxy http://proxy.company.com:8080`
   - `npm config set https-proxy http://proxy.company.com:8080`
 - Install TypeScript compiler using `npm install -g typescript`. Use `sudo` on Linux or Mac if necessary. TypeScript compiler is required to install project dependencies.
 - Run `npm install` to download necessary packages.

## Build distribution package

Update `npm` dependencies every time you are going to build the UI.
```
npm update
```
Then build the UI using:
```
grunt dist
``` 
or 
```
npm run dist
```
 Both are equivalent.

## Run in development

 - Install [prerequisites](#build).
 - Point your UI to the host, where the back-end for DAVe is running
   - see `app/http.service.ts` file, section `export const defaultURL`.
 - Update development and runtime dependencies by calling `npm update`.
 - Run `grunt run` or `npm start` to start the simple web server. A Chrome browser will be started automatically. If you don't want to use Chrome for whatever reason you need to modify `gruntfile.js` and following section: 
 
 ```
 browserSync: { 
    options: {
        browser: ['firefox'] 
    } 
 }
 ```
 - Whenever there is a change to the files related to the UI, the server gets notified immediately - no restart is needed.
