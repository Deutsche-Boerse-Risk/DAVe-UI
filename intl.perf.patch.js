if (Intl && Intl.DateTimeFormat && !window.originalDateTimeFormatPerfPatch) {
    window.originalDateTimeFormatPerfPatch = Intl.DateTimeFormat;

    var dateTimeFormatCache = new Map();
    Intl.DateTimeFormat = function (locale, options) {
        var key = locale + JSON.stringify(options);
        var formatter = dateTimeFormatCache.get(key);
        if (!formatter) {
            formatter = new window.originalDateTimeFormatPerfPatch(locale, options);
            dateTimeFormatCache.set(key, formatter);
        }
        return formatter;
    }
}

if (Intl && Intl.NumberFormat && !window.originalNumberFormatPerfPatch) {
    window.originalNumberFormatPerfPatch = Intl.NumberFormat;

    var numberFormatCache = new Map();
    Intl.NumberFormat = function (locale, options) {
        var key = locale + JSON.stringify(options);
        var formatter = numberFormatCache.get(key);
        if (!formatter) {
            formatter = new window.originalNumberFormatPerfPatch(locale, options);
            numberFormatCache.set(key, formatter);
        }
        return formatter;
    }
}