const admin = require("firebase-admin");

const serviceAccount = require('../secretAccessKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const ref = db.collection('User');

module.exports = ref