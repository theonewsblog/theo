const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const axios     = require('axios');
const crypto    = require('crypto');
const path      = require('path');

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

// 2) Récup des vars Webhook
const WEBHOOK_URL    = process.env.WEBHOOK_URL || 'https://mcs-luxury.app.n8n.cloud/webhook/Formulaire';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'SocieteCommercialeOuestAfricain22011921TCArcelorF50/';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Fonction utilitaire pour générer une signature HMAC
function signPayload(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}



// Route pour stocker le consentement cookies
app.post('/api/cookies', async (req, res) => {
    try {
        const data = req.body; // { consent: 'accepted'/'rejected', date: ... }
      
        // Option 1 : enregistrer dans Firestore "consents"
        await db.collection('consents').add(data);

// Option 2 : enregistrer dans webhook
if (WEBHOOK_URL) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        // si on a un secret, on signe le payload
        if (WEBHOOK_SECRET) {
          headers['X-Signature'] = signPayload(data, WEBHOOK_SECRET);
        }
        await axios.post(WEBHOOK_URL, data, { headers });
      } catch (errHook) {
        console.error('[Webhook Error]', errHook.message);
        // on ne bloque pas la réponse principale, c'est un « soft fail »
      }
    }

      
        res.status(200).send({ message: 'Consentement pris en compte !' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Erreur d'enregistrement consentement" });
    }
});

app.listen(PORT, () => {
  console.log(`Server démarré sur le port ${PORT}`);
  if (WEBHOOK_URL) {
    console.log(`→ Webhook activé sur ${WEBHOOK_URL}`);
  }
});
