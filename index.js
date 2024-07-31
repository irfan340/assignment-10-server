let express=require('express')
let cors=require('cors')
require('dotenv').config()
let app=express()
let port=process.env.PORT || 3000
// middleware 
app.use(cors())
app.use(express.json())

//Mongdb 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bspxqoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    
    const spotCollection=client.db('spotDB').collection('spot')
    const userCollection= client.db('spotDB').collection('user')

    // spot related apis
    app.post('/spots',async(req,res)=>{
      let newSpot=req.body
      console.log(newSpot)
      let result=await spotCollection.insertOne(newSpot)
      res.send(result)
    })

    app.get('/spots', async(req,res)=>{
      const cursor=spotCollection.find()
      const result= await cursor.toArray()
      res.send(result)
    })

    app.delete('/spots/:id', async(req,res)=>{
      let id=req.params.id
      let query={_id: new ObjectId(id)}
      let result= await spotCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/spots/:id', async(req,res)=>{
      let id=req.params.id
      const query={_id: new ObjectId(id)}
      let result= await spotCollection.findOne(query)
      res.send(result)
    })

    app.put('/spots/:id', async(req,res)=>{
      const id= req.params.id 
      let filter ={_id: new ObjectId(id)}
      let options={ upsert:true}
      let updatedSpot=req.body
      let spot={
        $set:{
          name :updatedSpot.name,
          email:updatedSpot.email,
          country:updatedSpot.country,
          spotName:updatedSpot.spotName,
          location:updatedSpot.location,
          cost:updatedSpot.cost,
          time:updatedSpot.time,
          seasonality:updatedSpot.seasonality,
          visitors:updatedSpot.visitors,
          description:updatedSpot.description,
          photo:updatedSpot.photo
        }
      }
      let result=await spotCollection.updateOne(filter, spot, options)
      res.send(result)
    })
    
    // user related apis
    app.post('/user',  async(req,res)=>{
      const user=req.body
      console.log(user)
      const result =await userCollection.insertOne(user)
      res.send(result)
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


app.get('/', (req,res)=>{
    res.send('Tourify making server is running')
})
app.listen(port,()=>{
    console.log(`Tourify Server is running on port:${port}`)
})