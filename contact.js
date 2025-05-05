// server.js

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

// ----- Configuration Firebase ADMIN (backend seulement) -----
const serviceAccount = require('./serviceAccountKey.json'); // <-- adapte le chemin à la réalité

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mcs-transitions-default-rtdb.europe-west1.firebasedatabase.app"
});
const db = admin.database();

// ----- App Setup -----
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// -----------------------------------------------------
//                  SEUL ENDPOINT
// -----------------------------------------------------
app.post('/api/contacts', async (req, res) => {
  try {
    // Vérif CSRF basique
    const csrfToken = req.get('X-CSRF-Token');
    if (!csrfToken || csrfToken.length < 3) {
      return res.status(403).json({ success: false, message: 'Token CSRF manquant.' });
    }

    const formData = req.body;
    let errors = [];

    // Validation (identique à celle du frontend)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email || '')) errors.push('Veuillez entrer une adresse email valide.');

    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    if (!phoneRegex.test((formData.telephone || '').replace(/\s/g, ''))) errors.push('Veuillez entrer un numéro de téléphone valide.');

    if (!formData.collectivite || !formData.collectivite.trim()) errors.push('Le nom de la collectivité est requis.');
    if (!formData.taille) errors.push('La taille de la collectivité est requise.');
    if (!formData.service) errors.push('Le service demandé est requis.');
    if (!formData.besoin || !formData.besoin.trim()) errors.push('La description du besoin est requise.');
    if (!formData.nom || !formData.nom.trim()) errors.push('Votre nom est requis.');

    if (errors.length) return res.status(400).json({ success: false, message: errors.join(' ') });

    // Enregistrement de la date
    const pushData = {
      ...formData,
      date: new Date().toISOString()
    };

    // Enregistrement Firebase
    await db.ref('contact-form').push(pushData);
    res.json({ success: true, message: 'Enregistré avec succès.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur. Contact non enregistré.' });
  }
});

app.get('/', (req, res) => { res.send('Contact API en ligne'); });

app.listen(PORT, () => {
  console.log('Contact API server running on port', PORT);
});