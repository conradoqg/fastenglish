let SimpleCorrector = require('./simpleCorrector');

class CorrectorFactory {
    static getCorrectorByType(type) {
        if (type == 'simple' || type == 'choice') return new SimpleCorrector();
    }
}

module.exports = CorrectorFactory;