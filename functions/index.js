const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')

const app = express()
admin.initializeApp({
    credential: admin.credential.cert('./permissions.json')
})
const db = admin.firestore();

app.post('/api/usuarios', async (req, res) => {
    try {
        await db.collection("users")
        .doc("/" + req.body.cui + "/")
        .create({
            name: req.body.name,
            last_name: req.body.last_name,
            email: req.body.email
        })
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const query = db.collection("users");
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            cui: doc.id,
            name: doc.data().name,
            last_name: doc.data().last_name,
            email: doc.data().email,
        }))

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get('/api/usuarios/:cui', async (req, res) => {
    try {
        const doc = db.collection("users").doc(req.params.cui)
        const item = await doc.get()
        const response = item.data()
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.delete('/api/usuarios/:cui', async (req, res) => {
    try {
        const doc = db.collection("users").doc(req.params.cui)
        await doc.delete();
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.put('/api/usuarios/:cui', async (req, res) => {
    try {
        const doc = db.collection("users").doc(req.params.cui)
        await doc.update({
            name: req.body.name,
            last_name: req.body.last_name,
            email: req.body.email
        });
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});


exports.app = functions.https.onRequest(app);