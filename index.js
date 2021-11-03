const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const cors = require('cors');
const ObjectID = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json());

// connect monoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apq2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("UmmahFoodDelivery");
        const foodsCollection = database.collection("foods");
        const ordersCollection = database.collection("orders");

        // GET API (All Food)
        app.get('/foods', async (req, res) => {
            // search query
            const query = {};
            // point cursor to colletion
            const cursor = foodsCollection.find(query);
            // tell cursor give data as array 
            const foods = await cursor.toArray();
            // get data to ui
            res.send(foods);
        })

        // GET API (Requested food)
        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) }
            const food = await foodsCollection.findOne(query);
            res.send(food);
        })

        // POST API (Order)
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            res.json(result);
        })

        // GET API (Order)
        app.get('/orders', async (req, res) => {
            const userId = req.query.userId;
            const query = { userId: userId };
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })

        // DELETE API (Order)
        app.delete('/orders/:orderId', async (req, res) => {
            const id = req.params.orderId;
            const query = { _id: ObjectID(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running from Ummah Food Delivery Server')
})

app.listen(port, (req, res) => {
    console.log('Server Runnig at Port', port);
})