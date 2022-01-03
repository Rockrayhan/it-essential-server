const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shqkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // All DB Collections
    await client.connect();
    const database = client.db('IT-Essentials');
    const ordersCollection = database.collection('orders');


    //POST ( Orders ) send to the DB
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order)
      console.log(result);
      res.json(result)
    });

  }
  finally {
    // await client.close() ; 
  }

}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello IT Essentials')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})