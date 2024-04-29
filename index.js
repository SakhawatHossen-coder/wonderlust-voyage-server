const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://wanderlust-voyage.netlify.app",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// app.use(cors());
//
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
    // await client.connect();

    const touristCollection = client.db("touristdb").collection("tourists");
    //CountrySection
    const countryCollection = client.db("touristdb").collection("countries");

    app.get("/countries", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/tourist/countries/:countryName", async (req, res) => {
      console.log(req.params.countryName);
      const result = await touristCollection
        .find({
          countryName: req.params.countryName,
        })
        .toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/tourist", async (req, res) => {
      const option = {
        sort: { averageCost: 1 },
      };
      const cursor = touristCollection.find().sort({ averageCost: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/tourist", async (req, res) => {
      const newTourist = req.body;
      const result = await touristCollection.insertOne(newTourist);
      res.send(result);
    });
    app.get("/tourist/email/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await touristCollection
        .find({
          userEmail: req.params.email,
        })
        .toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/tourist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.findOne(query);
      res.send(result);
    });
    //
    //PUT
    app.put("/tourist/:id", async (req, res) => {
      let id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      // const option = { upsert: true };
      const updateTourist = req.body;
      const newTourist = {
        $set: {
          image: updateTourist.image,
          touristSpot: updateTourist.touristSpot,
          countryName: updateTourist.countryName,
          location: updateTourist.location,
          description: updateTourist.description,
          averageCost: updateTourist.averageCost,
          season: updateTourist.season,
          travelTime: updateTourist.travelTime,
          totalVisitors: updateTourist.totalVisitors,
        },
      };
      const result = await touristCollection.updateOne(filter, newTourist);
      res.send(result);
    });
    app.delete("/tourist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.deleteOne(query);
      res.send(result);
    });
    // app.get("/tourist/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //   console.log("Searching for email:", email);
    //   const result = await touristCollection.find(query).toArray();
    //   console.log("Found tourist data:", result);
    //   res.send(result);
    // });

    ////
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
