const EventEmitter = require('events').EventEmitter;

class HistoryStorage {
    constructor() {
        this.history = null;   
        this.emitter = new EventEmitter();     
        this.load();
    }

    load() {
        this.history = store.get('challengesHistory') || {};        
        this.emitter.emit('historyChanged');
    }

    save() {
        store.set('challengesHistory', this.history);
        this.emitter.emit('historyChanged');
    }

    add(history) {
        this.history = Object.assign(history, this.history);
        this.save();        
    }

    clear() {        
        this.history = {};
        this.save();
        
    }
}

module.exports = HistoryStorage;