const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;
const port =process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvker.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
   try{
    await client.connect();
    console.log('connected to database');
    const database = client.db('carMechanic');
    const serviceCollection = database.collection('services');

    
    //Get ALL services
    app.get('/services', async (req, res)=>{
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    });

    //Get single service

    app.get('/services/:id', async (req, res)=>{
        const id = req.params.id;
        console.log('hiiting specific id', id);
        const query ={_id:ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.json(service);
    });
    app.post('/services', async (req,res)=>{ 
        const service = req.body;
        console.log('hit the post api', service);
        const result = await serviceCollection.insertOne(service);
        console.log(result)
        res.json(result);
    });

    //delete api
    app.delete('/services/:id', async (req, res)=>{
        const id= req.params.id;
        const query={_id:ObjectId(id)};
        const result = await serviceCollection.deleteOne(query);
        res.json(result);

    })
    
   }finally{
    // await client.close();
   }
}
run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('running genious server');
})

app.listen(port, ()=>{
    console.log('running genious server on port:', port);
})