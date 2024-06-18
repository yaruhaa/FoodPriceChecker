const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

app.get('/categories', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('shop');

        const collections = await db.listCollections().toArray();
        const categories = collections
            .map(collection => collection.name)
            .filter(name => name !== 'Історія');

        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/search', async (req, res) => {
    const query = req.query.query;

    try {
        await client.connect();
        const db = client.db('shop');

        const collections = await db.listCollections().toArray();
        let products = [];
        let categories = {};

        for (const collection of collections) {
            if (collection.name !== 'Історія') {
                const col = db.collection(collection.name);
                const foundProducts = await col.find({
                    $or: [
                        { type: new RegExp(query, 'i') },
                        { firm: new RegExp(query, 'i') },
                        { flavor: new RegExp(query, 'i') },
                        { weight: new RegExp(query, 'i') }
                    ]
                }).toArray();

                if (foundProducts.length > 0) {
                    categories[collection.name] = categories[collection.name] || new Set();
                    foundProducts.forEach(product => {
                        categories[collection.name].add(product.groupName);
                    });
                    products = products.concat(foundProducts);
                }
            }
        }

        // Convert Set to Array for easier handling in frontend
        for (const category in categories) {
            categories[category] = Array.from(categories[category]);
        }

        res.json({ products, categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/categories/:category', async (req, res) => {
    const category = decodeURIComponent(req.params.category);

    try {
        await client.connect();
        const db = client.db('shop');

        const collection = db.collection(category);
        const products = await collection.find().toArray();

        const subcategories = new Set();
        products.forEach(product => {
            if (product.groupName) {
                subcategories.add(product.groupName);
            }
        });

        res.json(Array.from(subcategories));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/categories/:category/:subcategory', async (req, res) => {
    const category = decodeURIComponent(req.params.category);
    const subcategory = decodeURIComponent(req.params.subcategory);

    try {
        await client.connect();
        const db = client.db('shop');

        const collection = db.collection(category);
        const products = await collection.find({ groupName: subcategory }).toArray();

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/categories/:category/:subcategory/:productId', async (req, res) => {
    const { category, subcategory, productId } = req.params;

    try {
        await client.connect();
        const db = client.db('shop');

        const collection = db.collection(category);
        const product = await collection.findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/history/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        await client.connect();
        const db = client.db('shop');

        const collection = db.collection('Історія');
        const history = await collection.find({ productId: new ObjectId(productId) }).toArray();

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
