let SimpleCorrector = require('./simpleCorrector');

class CorrectorFactory {
    static getCorrectorByType(type) {
        if (type == 'simple') return new SimpleCorrector();
    }
}

module.exports = CorrectorFactory;