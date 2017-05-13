function getColors(prefix) {
    let styleSheets = window.document.styleSheets;
    let styleSheetsLength = styleSheets.length;
    let colors = [];

    for (var i = 0; i < styleSheetsLength; i++) {
        let classes = null;
        try {
            // In Chrome, if stylesheet originates from a different domain,
            // ss.cssRules simply won't exist. I believe the same is true for IE, but
            // I haven't tested it.
            //
            // In Firefox, if stylesheet originates from a different domain, trying
            // to access ss.cssRules will throw a SecurityError. Hence, we must use
            // try/catch to detect this condition in Firefox.
            classes = styleSheets[i].rules || styleSheets[i].cssRules;
        } catch (e) {
            // Rethrow exception if it's not a SecurityError. Note that SecurityError
            // exception is specific to Firefox.
            if (e.name !== 'SecurityError')
                throw e;
            return;
        }

        if (!classes)
            continue;
        let classesLength = classes.length;
        for (var x = 0; x < classesLength; x++) {
            if (classes[x].selectorText && classes[x].selectorText.startsWith(prefix)) {
                if (classes[x].style && classes[x].style.color) {
                    colors[classes[x].selectorText.substr(prefix.length + 1)] = classes[x].style.color;
                }
            }
        }
    }
    return colors;
}

let colors = [];
let sounds = {};

class Theming {
    static load(prefix) {
        colors = getColors(prefix);
        sounds['success'] = new Howl({
            urls: ['media/success.mp3'],
            volume: 0.2
        });

        sounds['fail'] = new Howl({
            urls: ['media/fail.mp3'],
            volume: 0.2
        });
    }

    static getColor(colorName) {
        return colors[colorName];
    }

    static getSound(soundName) {
        return sounds[soundName];
    }

    static rgbToHex(a) {
        a = a.replace(/[^\d,]/g, '').split(',');
        return '#' + ((1 << 24) + (+a[0] << 16) + (+a[1] << 8) + +a[2]).toString(16).slice(1);
    }
}

module.exports = Theming;