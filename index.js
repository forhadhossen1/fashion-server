const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yktx4zp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


        const usersCollection = client.db('fashionDB').collection('users');
        const productCollection = client.db('fashionDB').collection('product');
        const bannerColllection = client.db('fashionDB').collection('banner');
        const cartColllection = client.db('fashionDB').collection('cart');



        // usersCollection related api code 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


        // productCollection related code ... 
        app.get('/product', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        })

        // bannerColllection related code ...  
        app.get('/banner', async (req, res) => {
            const result = await bannerColllection.find().toArray();
            res.send(result);
        })

        //  cartColllection related code ...... 
        app.get('/cart', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await cartColllection.find(query).toArray();
            res.send(result);
        })

        app.post('/cart', async (req, res) => {
            const cartProduct = req.body;
            const result = await cartColllection.insertOne(cartProduct);
            res.send(result);
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartColllection.deleteOne(query);
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
    res.send('Fashion server Conected');
})

app.listen(port, () => {
    console.log(`Fashion Server is running on port ${port}`);
})