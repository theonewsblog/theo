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
// Route pour stocker le consentement cookies
app.post('/api/cookies', async (req, res) => {
    try {
        const data = req.body; // { consent: 'accepted'/'rejected', date: ... }
        // Option 1 : enregistrer dans Firestore "consents"
        await db.collection('consents').add(data);

        res.status(200).send({ message: 'Consentement pris en compte !' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Erreur d'enregistrement consentement" });
    }
});
