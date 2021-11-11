const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const { MongoClient } = require('mongodb');
const { json } = require('express');
const port = process.env.PORT || 5000


//middleWaree
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fj83e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('bike_DB');
        const bikesCollection = database.collection('bikes');
        const orderCollection = database.collection('order');
        const reviewCollection = database.collection('review');
        const usersCollection = database.collection('users');

        //Get bikes API
        app.get('/bikes', async (req, res) => {
            const cursor = bikesCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })
        //Post bikes API
        app.post('/bikes', async (req, res) => {

            const bike = req.body;
            const result = await bikesCollection.insertOne(bike);
            res.json(result);
        })
        //get single api
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bikesCollection.findOne(query)
            res.json(result)

        })
        //post api orders
        app.post('/orders', async (req, res) => {

            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })
        //get api orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const order = await cursor.toArray()
            res.json(order)
        })
        //delete order api
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })
        //post review api
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.json(result)
        })
        //get review api
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({})
            const review = await cursor.toArray()
            res.json(review)
        })
        //post user api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
        })
        // upsert user api
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const option = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, option);
            res.json(result)
        })
        //make admin api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })
        //get user api for admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        //delete product api
        app.delete('/products/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikesCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally {
        // await clientInformation.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello server!')
})

app.listen(port, () => {
    console.log(`listening : ${port}`)
})