var localBrowsers = {
    CHROME: 'Chrome',
    FIREFOX: 'Firefox',
    IE: 'IE',
    SAFARI: 'Safari'
};
var customLaunchers = {
    BS_CHROME_LATEST: {
        base: 'BrowserStack',
        browser: 'Chrome',
        os: 'Windows',
        os_version: '10'
    },
    BS_CHROME50: {
        base: 'BrowserStack',
        browser: 'Chrome',
        browser_version: '50.0',
        os: 'Windows',
        os_version: '10'
    },
    BS_FIREFOX_LATEST: {
        base: 'BrowserStack',
        browser: 'Firefox',
        os: 'Windows',
        os_version: '10'
    },
    BS_FIREFOX50: {
        base: 'BrowserStack',
        browser: 'Firefox',
        browser_version: '50.0',
        os: 'Windows',
        os_version: '10'
    },
    BS_IE9: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '9.0',
        os: 'Windows',
        os_version: '7'
    },
    BS_IE10: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '10.0',
        os: 'Windows',
        os_version: '7'
    },
    BS_IE11: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '7'
    },
    BS_EDGE13: {
        base: 'BrowserStack',
        browser: 'Edge',
        browser_version: '13.0',
        os: 'Windows',
        os_version: '10'
    },
    BS_EDGE14: {
        base: 'BrowserStack',
        browser: 'Edge',
        browser_version: '14.0',
        os: 'Windows',
        os_version: '10'
    },
    BS_SAFARI7: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '7.1',
        os: 'OS X',
        os_version: 'Mavericks'
    },
    BS_SAFARI8: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '8.0',
        os: 'OS X',
        os_version: 'Yosemite'
    },
    BS_SAFARI9: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '9.1',
        os: 'OS X',
        os_version: 'El Capitan'
    },
    BS_SAFARI10: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '10.0',
        os: 'OS X',
        os_version: 'Sierra'
    },
    BS_IOS7: {
        base: 'BrowserStack',
        device: 'iPhone 5S',
        os: 'ios',
        os_version: '7.0',
        browser_version: null,
        browser: 'Mobile Safari'
    }
};

var BrowserStack = {
    ALL: Object.keys(customLaunchers).filter(function (item) {
        if (customLaunchers[item].browser === 'IE') {
            switch (customLaunchers[item].browser_version) {
                case '9.0':
                case '10.0':   // TODO: optimze to test IE 10 and 9
                    return false;
            }
        }
        return customLaunchers[item].base === 'BrowserStack';
    }),
    MINIMAL: ['BS_IE11', 'BS_CHROME50', 'BS_FIREFOX50', 'BS_SAFARI7', 'BS_IOS7'],
    CHROME: ['BS_CHROME50', 'BS_CHROME_LATEST'],
    FIREFOX: ['BS_FIREFOX50', 'BS_FIREFOX_LATEST'],
    IE: [/*'BS_IE9', 'BS_IE10', */'BS_IE11'], // TODO: optimze to test IE 10 and 9
    EDGE: ['BS_EDGE13', 'BS_EDGE14'],
    IOS: ['BS_IOS7'],
    SAFARI: ['BS_SAFARI7', 'BS_SAFARI8', 'BS_SAFARI9', 'BS_SAFARI10']
};

var LOCAL = {
    ALL: Object.keys(localBrowsers).map(function (item) {
        return localBrowsers[item];
    }),
    CHROME: [localBrowsers.CHROME],
    FIREFOX: [localBrowsers.FIREFOX],
    SAFARI: [localBrowsers.SAFARI],
    IE: [localBrowsers.IE]
};

var BrowserSync = {
    CHROME: [localBrowsers.CHROME, 'google chrome'], // 'google chrome' has to be added so it will work in Mac OS as well
    FIREFOX: [localBrowsers.FIREFOX],
    SAFARI: [localBrowsers.SAFARI],
    IE: [localBrowsers.IE]
};

module.exports = {
    // Custom launchers for Karma
    customLaunchers: customLaunchers,
    // Remote browsers for Karma (using BrowserStack)
    BrowserStack: BrowserStack,
    // Local browsers for Karma
    Local: LOCAL,
    // Default browser for BrowserSync (local development)
    BrowserSync: BrowserSync.CHROME
};