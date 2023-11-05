const express =  require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();

require('dotenv').config()
const port = process.env.PORT || 5000;


console.log(process.env.DB_PASS);

// midleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d33r4qq.mongodb.net/?retryWrites=true&w=majority`;

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


    const sevice = client.db("carMech");
    const seviceCollection = sevice.collection("carService");
    const bookColection = sevice.collection("book");


 app.get('/services', async(req, res) =>{
    const cursor = seviceCollection.find();
    const result = await cursor.toArray();
    res.send(result)
 })

 app.get('/services/:id', async(req, res) =>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await seviceCollection.findOne(query)
  res.send(result)
 })



 app.get('/checkout', async(req, res) =>{
  const cursor = seviceCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})

app.get('/checkout/:id', async(req, res) =>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const options = {
    projection: {title: 1, price: 1, img: 1},
  };
  const result = await seviceCollection.findOne(query, options)
  res.send(result)
 })

//  orderBook data colect from mongobd 

app.get('/orderBook' , async(req, res) =>{
  console.log(req.query);
  let query = {}
  if (req.query?.email) {
    query = {email: req.query.email}
  }
  const cursor = bookColection.find(query);
  const result = await cursor.toArray();
  res.send(result)
})

 app.post('/orderBook', async(req, res) =>{
  const order = req.body;
  console.log(order);
  const result = await bookColection.insertOne(order)
  res.send(result)
 })


 app.patch('/orderBook/:id', async(req,res) =>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const updateOrder = req.body;
  console.log(updateOrder);
  const updateDoc = {
    $set: {
      status: updateOrder.status
    }
  }

  const result = await bookColection.updateOne(filter, updateDoc)
  res.send(result)
 })


 app.delete('/orderBook/:id', async(req, res) =>{
  const id = req.params.id;
  const query ={_id : new ObjectId(id)}
  const result = await bookColection.deleteOne(query)
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


app.get('/', (req, res) =>{
    res.send('doctor is runing')
})

app.listen(port, () => {
    console.log(`car mechanic port is runing in the ${port}`);
})
