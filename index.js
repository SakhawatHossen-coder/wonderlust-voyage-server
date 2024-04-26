const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//tourist-server
//Vid76hR1BONaxRjA

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkr0gnw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristCollection = client.db("touristdb").collection("tourists");

    app.get("/tourist", async (req, res) => {
      const cursor = touristCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/tourist", async (req, res) => {
      const newTourist = req.body;
      const result = await touristCollection.insertOne(newTourist);
      res.send(result);
    });
    ////
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Torist server is running");
});

app.listen(port, () => {
  console.log("tourist server runnning ---");
});
