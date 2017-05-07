class HistoryStorage {
    load() {
        var challengesHistory = store.get('challengesHistory') || {}
        return challengesHistory;
    }

    add(history) {
        store.set('challengesHistory', Object.assign(this.load(), history));
    }
}

module.exports = HistoryStorage;