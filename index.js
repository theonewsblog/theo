const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// 1. Lancer la config Firebase (avec ton fichier de clé)
const serviceAccount = require('./mcs-transitions-firebase-adminsdk-fbsvc-0e946cf8ba.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Si tu utilises Firestore
// const db = admin.database(); // Si tu utilises le RTDB

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// 2. API : route POST pour recevoir le formulaire
app.post('/api/contact', async (req, res) => {
  try {
    // Récupère les données envoyées par le client
    const data = req.body;

    // Enregistre dans Firestore (ou RTDB)
    await db.collection('contacts').add(data);

    res.status(200).send({message: 'Données reçues'});
  } catch (error) {
    console.error(error);
    res.status(500).send({error: 'Erreur lors de la sauvegarde'});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
