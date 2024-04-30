const express = require('express');
const app = express();
const cors = require('cors')
require ('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors())
// const corsConfig = {
//   origin: '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
//   }
//   app.use(cors(corsConfig))

app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylmjbhk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(process.env.DB_USER, uri)

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
    // await client.connect();

    const database = client.db("spotstDB");
    const allSpotsCollection = database.collection("allSpots");
    const countryCollection = database.collection("countryName");

    
    app.get('/touristSpot', async(req, res) => {
        const cursor = allSpotsCollection.find( );
        const result = await cursor.toArray();
        res.send(result)
      });


// get data with country name 
// app.get('/countrySpot', async(req, res) => {
//   const cursor = countryCollection.find( );
//   const result = await cursor.toArray();
//   res.send(result)
// });

    // find with country name 
    app.get('/countries', async(req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })



    // update data 
    app.get('/touristSpot/:id', async(req, res) => {
      const id = req.params.id ;
      const query = {_id : new ObjectId(id)};
      const result = await allSpotsCollection.findOne(query);
      res.send(result)
    })
    app.put('/touristSpot/:id', async(req, res) => {
      const id = req.params.id ;
      console.log(id);
      const filter = {_id : new ObjectId (id)} ;
      const options = {upsert : true} ;
      const updateSpotDetails = req.body;

      //{countryName, spotName, location, cost, seasonality, traveTime, photoTitle, visitor, photoUrl,details}

      const updateDoc = {
        $set : {
          countryName : updateSpotDetails.countryName,
          spotName : updateSpotDetails.spotName,
          location : updateSpotDetails.location,
          cost : updateSpotDetails.cost,
          seasonality : updateSpotDetails.seasonality,
          traveTime : updateSpotDetails.traveTime,
          photoTitle : updateSpotDetails.photoTitle,
          visitor : updateSpotDetails.visitor,
          photoUrl : updateSpotDetails.photoUrl,
          details : updateSpotDetails.details,
        }
      }
      const result = await allSpotsCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })



    app.post('/touristSpot', async(req, res) => {
        const allSpot = req.body ;
        console.log(allSpot);
        const result = await allSpotsCollection.insertOne(allSpot);
        res.send(result)
    } )


    // send data by country name 
    app.post('/countries', async(req, res) => {
      const countryName = req.body ;
      const result = await countryCollection.insertMany(countryName);
      res.send(result)
  } )

    // data delete 
    app.delete('/touristSpot/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id, 'dynamic id');
      const query = { _id : new ObjectId(id) };
      const result = await allSpotsCollection.deleteOne(query);
      res.send(result)
    })


    app.get('/health', (req, res) => {
      res.send('Travelling server has been coming health soon!')
    })

    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Travelling server has been coming soon!')
})

app.listen(port, () => {
  console.log(`Travelling server is listening on port ${port}`)
})