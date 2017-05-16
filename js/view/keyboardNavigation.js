class KeyboardNavigation {
    static createKeyDownHandler(keyDestinationPairs) {
        return (event) => {
            for (var key in keyDestinationPairs) {
                if (keyDestinationPairs.hasOwnProperty(key)) {
                    var destination = keyDestinationPairs[key];
                    if (event.key == key) {
                        if (typeof destination == 'function') {
                            event.preventDefault();
                            return destination();
                        } else {
                            event.preventDefault();
                            $(`#${destination}`).first().focus();                            
                        }
                    }
                }
            }
        };
    }
}

module.exports = KeyboardNavigation;