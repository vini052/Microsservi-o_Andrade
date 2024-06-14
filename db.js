const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const config = require('./config');

class FirestoreSingleton {
    constructor() {
        if (!FirestoreSingleton.instance) {
            const app = initializeApp(config.firebaseConfig);
            this.db = getFirestore(app);
            FirestoreSingleton.instance = this;
        }

        return FirestoreSingleton.instance;
    }

    getDb() {
        return this.db;
    }
}

const instance = new FirestoreSingleton();
Object.freeze(instance);

module.exports = instance.getDb();
