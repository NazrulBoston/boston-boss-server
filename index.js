const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 500


// middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.it2xzvi.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const userCollection = client.db("bostonDb").collection("users");
    const menuCollection = client.db("bostonDb").collection("menu");
    const reviewCollection = client.db("bostonDb").collection("reviews");
    const cartCollection = client.db("bostonDb").collection("carts");

    // users related api

    app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      //insert email if user does not exists:
      //you can do many ways (1. email uniqe, 2. upsert, 3. simple checking )
      const query = {email: user.email}
      const existingUser = await userCollection.findOne(query)
      if(existingUser){
        return res.send({ message: 'user already exists', insertedId: null})
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.get('/menu', async(req, res) => {
        const result = await menuCollection.find().toArray()
        res.send(result);
    })
    app.get('/reviews', async(req, res) => {
        const result = await reviewCollection.find().toArray()
        res.send(result);
    })

    //carts collection
    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const result = await cartCollection.find(query).toArray();
      res.send(result)
    })


    app.post('/carts', async(req, res) => {
      const cartItem = req.body;
      console.log(cartItem)
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);

    })


    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
 res.send('Boss is sitting')
}) 

app.listen(port, () => {
    console.log(`Boston Boss is sitting on port ${port}`);
})




 


/**
 *                  NAMING CONVENTION
 * ---------------------------------------------------
 * 
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users') 
 * app.put('/user/:id')
 * app.patch('/users/:id')
 * app.delete('/users/:id')
 */ 