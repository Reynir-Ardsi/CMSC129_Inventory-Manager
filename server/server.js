const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const primaryApp = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PRIMARY_PROJECT_ID,
        clientEmail: process.env.PRIMARY_CLIENT_EMAIL,
        privateKey: process.env.PRIMARY_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
}, 'primary');

const secondaryApp = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.SECONDARY_PROJECT_ID,
        clientEmail: process.env.SECONDARY_CLIENT_EMAIL,
        privateKey: process.env.SECONDARY_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
}, 'secondary');

const primaryDb = primaryApp.firestore();
const secondaryDb = secondaryApp.firestore();

app.post('/api/users', async (req, res) => {
    try {
        const { uid, email, username } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ error: 'Missing required user fields' });
        }

        const newUser = {
            uid,
            email,
            username: username || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const writeResults = await Promise.allSettled([
            primaryDb.collection('users').doc(uid).set(newUser),
            secondaryDb.collection('users').doc(uid).set(newUser)
        ]);

        writeResults.forEach((result, index) => {
            if (result.status === 'rejected') {
                const dbName = index === 0 ? 'Primary' : 'Secondary';
                console.error(`🚨 ${dbName} DB User Write Failed:`, result.reason);
            }
        });

        res.status(201).json({ message: 'User redundant backup successful', user: newUser });
    } catch (error) {
        console.error("Critical Server Error in POST /api/users:", error);
        res.status(500).json({ error: 'Failed to create redundant user data' });
    }
});

app.post('/api/inventory', async (req, res) => {
    try {
        const { name, category, quantity, price } = req.body;
        const newItem = {
            name, category, quantity, price,
            isDeleted: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docId = primaryDb.collection('inventory').doc().id;

        const writeResults = await Promise.allSettled([
            primaryDb.collection('inventory').doc(docId).set(newItem),
            secondaryDb.collection('inventory').doc(docId).set(newItem)
        ]);

        writeResults.forEach((result, index) => {
            if (result.status === 'rejected') {
                const dbName = index === 0 ? 'Primary' : 'Secondary';
                console.error(`🚨 ${dbName} DB Write Failed:`, result.reason);
            }
        });

        res.status(201).json({ id: docId, ...newItem });
    } catch (error) {
        console.error("Critical Server Error in POST:", error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

app.get('/api/inventory', async (req, res) => {
    try {
        const isDeleted = req.query.deleted === 'true';
        let snapshot;

        try {
            snapshot = await primaryDb.collection('inventory').where('isDeleted', '==', isDeleted).get();
            console.log("Data retrieved from Primary Database");
        } catch (primaryError) {
            console.warn("Primary DB failed. Falling back to Secondary DB...");
            snapshot = await secondaryDb.collection('inventory').where('isDeleted', '==', isDeleted).get();
            console.log("Data retrieved from Secondary Database");
        }

        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(items);
    } catch (error) {
        console.error("Critical Server Error in GET:", error);
        res.status(500).json({ error: 'Failed to fetch items from both databases' });
    }
});

app.put('/api/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        await Promise.allSettled([
            primaryDb.collection('inventory').doc(id).update(updateData),
            secondaryDb.collection('inventory').doc(id).update(updateData)
        ]);

        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

app.put('/api/inventory/:id/restore', async (req, res) => {
    try {
        const { id } = req.params;
        await Promise.allSettled([
            primaryDb.collection('inventory').doc(id).update({ isDeleted: false }),
            secondaryDb.collection('inventory').doc(id).update({ isDeleted: false })
        ]);
        res.status(200).json({ message: 'Item restored successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to restore item' });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Promise.allSettled([
            primaryDb.collection('inventory').doc(id).update({ isDeleted: true }),
            secondaryDb.collection('inventory').doc(id).update({ isDeleted: true })
        ]);
        res.status(200).json({ message: 'Item soft-deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to soft delete item' });
    }
});

app.delete('/api/inventory/:id/hard', async (req, res) => {
    try {
        const { id } = req.params;
        await Promise.allSettled([
            primaryDb.collection('inventory').doc(id).delete(),
            secondaryDb.collection('inventory').doc(id).delete()
        ]);
        res.status(200).json({ message: 'Item permanently deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to hard delete item' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));