const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
const res = require('express/lib/response');
const fileUpload = require('express-fileupload');


app.use(cors());
app.use(express.json());
app.use(fileUpload()) ;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shqkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // All DB Collections
     client.connect();
    const database = client.db('IT-Essentials');
    const ordersCollection = database.collection('orders');
    const usersCollection = database.collection('users');
    const servicesCollection = database.collection('services');


    // GET ( services ) show to the UI
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({}) ;
      const services = await cursor.toArray();
      res.send(services)
    })
  
    // GET Single Services
    app.get('/services/:id', async (req,res)=> {
      const id = req.params.id;
      console.log('goth the id', id);
      const query = {_id: ObjectId(id)} ;
      const service = await servicesCollection.findOne(query) ;
      res.json(service) ;

    })

    // POST ( services ) send services to DB
    app.post ('/services', async (req, res) => {
      const service = req.body ;
      console.log('hit the post api', service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result) ;
    });

    // GET ( Orders ) show to the UI
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      const query = { email: email}
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });



    //POST ( Orders ) send to the DB
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order)
      res.json(result)
    });



    // GET ( Order by ID ) for payment
    app.get('/orders/:id', async(req, res) => {
      const id = req.params.id ;
      const query = {_id: ObjectId(id)} ;
      const result = await ordersCollection.findOne(query);
      res.json(result);
    })


    // save user in DB
    app.post('/users', async(req,res)=> {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });



    // Delete ( services )
    app.delete('/services/:id', async (req, res)=>{
      const id = req.params.id ;
      const query = {_id : ObjectId(id) } ;
      const result = await servicesCollection.deleteOne(query) ;
      res.json(result);
    } );

    // Delete (Orders)
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id ;
      const query = {_id : ObjectId(id)} ;
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    }) ;



    // for Admin
    app.put('/users/admin', async(req, res) =>{
      const user = req.body;
      console.log('put', user);
      const filter = {email: user.email};
      const updateDoc = {$set:{role:'admin'}};
      const result = await usersCollection.updateOne(filter , updateDoc) ;
      res.json(result);
    });


    // send or cheak admin info
    app.get('/users/:email', async(req, res) => {
      const email = req.params.email ;
      const query = {email: email} ;
      const user = await usersCollection.findOne(query) ;
      let isAdmin = false ;
      if (user?.role === 'admin') {
        isAdmin = true ;
      }
      res.json( {admin: isAdmin} ) ;
    })


  }
  finally {
    await client.close() ; 
  }

}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello from IT Essentials')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})