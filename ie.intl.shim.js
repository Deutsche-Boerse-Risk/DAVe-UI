function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

if (detectIE() && Intl && Intl.DateTimeFormat && !Intl.OriginalDateTimeFormat) {
    Intl.OriginalDateTimeFormat = Intl.DateTimeFormat;

    Intl.DateTimeFormat = function (locale, options) {
        var opts = JSON.parse(JSON.stringify(options));
        var lookupIndex = -1;

        if (opts.second && !opts.minute && !opts.hour) {
            opts.minute = '2-digit';
            opts.hour = '2-digit';
            lookupIndex = 2;
        }
        if (opts.minute && !opts.second && !opts.hour) {
            opts.second = '2-digit';
            opts.hour = '2-digit';
            lookupIndex = 1;
        }

        if (opts.hour && !opts.second && !opts.minute) {
            opts.second = '2-digit';
            opts.minute = '2-digit';
            lookupIndex = 0;
        }

        var formatter = new Intl.OriginalDateTimeFormat(locale, opts);
        var originalFormat = formatter.format;

        Object.defineProperty(formatter, "format", {
            get: function () {
                return function () {
                    var result = originalFormat.apply(formatter, arguments);
                    if (lookupIndex >= 0) {
                        result = result.split(':')[lookupIndex].split(' ')[0];
                    }
                    return result;
                };
            },
            enumerable: true,
            configurable: true
        });
        return formatter;
    }
}