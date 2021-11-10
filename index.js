const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const { MongoClient } = require('mongodb');
const { json } = require('express');
const port = process.env.PORT || 5000


//middleWare
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
        const reviewCollection = database.collection('review')

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
            console.log(bike);
            res.json(result);
        })
        //get single api
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bikesCollection.findOne(query)
            console.log(result);
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