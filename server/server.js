const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (assuming you already have this setup)
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// CREATE
app.post('/api/inventory', async (req, res) => {
    try {
        const { name, category, quantity, price } = req.body;
        const newItem = {
            name, category, quantity, price,
            isDeleted: false, // Default to false
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('inventory').add(newItem);
        res.status(201).json({ id: docRef.id, ...newItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// READ (Filter by active or deleted status)
app.get('/api/inventory', async (req, res) => {
    try {
        const isDeleted = req.query.deleted === 'true'; // Check if we are requesting the recycle bin
        const snapshot = await db.collection('inventory').where('isDeleted', '==', isDeleted).get();
        
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// UPDATE
app.put('/api/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        await db.collection('inventory').doc(id).update(updateData);
        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// RESTORE (Recover a soft-deleted item)
app.put('/api/inventory/:id/restore', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('inventory').doc(id).update({ isDeleted: false });
        res.status(200).json({ message: 'Item restored successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to restore item' });
    }
});

// SOFT DELETE (Mark item as deleted instead of removing it)
app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('inventory').doc(id).update({ isDeleted: true });
        res.status(200).json({ message: 'Item soft-deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));