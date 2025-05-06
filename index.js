const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// 1. Lancer la config Firebase (avec ton fichier de clé)
const serviceAccount = require('./mcs-transitions-firebase-adminsdk-fbsvc-afe1494a57');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore(); // Si tu utilises Firestore
//const db = admin.database(); // Si tu utilises le RTDB

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
});
