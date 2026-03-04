// server/server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin securely using environment variables
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
});

const db = admin.firestore();
const inventoryRef = db.collection('inventory');

// 1. CREATE: Add new item
app.post('/api/inventory', async (req, res) => {
    try {
        const { name, category, quantity, price } = req.body;
        const newItem = {
            name, category, quantity, price,
            isDeleted: false, // Default to false for new items
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await inventoryRef.add(newItem);
        res.status(201).json({ id: docRef.id, ...newItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// 2. READ: Get items (Filter by active or soft-deleted status)
app.get('/api/inventory', async (req, res) => {
    try {
        const isDeleted = req.query.deleted === 'true'; // Check if we are requesting the recycle bin
        const snapshot = await inventoryRef.where('isDeleted', '==', isDeleted).get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// 3. UPDATE: Modify an item
app.put('/api/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        await inventoryRef.doc(id).update(updateData);
        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// 4. RESTORE: Recover a soft-deleted item
app.put('/api/inventory/:id/restore', async (req, res) => {
    try {
        const { id } = req.params;
        await inventoryRef.doc(id).update({ isDeleted: false });
        res.status(200).json({ message: 'Item restored successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to restore item' });
    }
});

// 5. SOFT DELETE: Mark item as deleted without removing from DB
app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Update `isDeleted` to true instead of actually deleting the document
        await inventoryRef.doc(id).update({ isDeleted: true });
        res.status(200).json({ message: 'Item soft-deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to soft delete item' });
    }
});

// 6. HARD DELETE: Purge item completely from the database
app.delete('/api/inventory/:id/hard', async (req, res) => {
    try {
        const { id } = req.params;
        // Use .delete() to permanently remove the document from Firestore
        await inventoryRef.doc(id).delete();
        res.status(200).json({ message: 'Item permanently deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to hard delete item' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));