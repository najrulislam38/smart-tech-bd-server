const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.SMART_TECH_DB_USER}:${process.env.SMART_TECH_DB_PASS}@cluster0.uobb6mz.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection

    const productsCollection = client.db("smartTechDB").collection("products");
    const addProductsCollection = client
      .db("smartTechDB")
      .collection("addProducts");

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // image, name, brandName, type, price, rating, description
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateRequest = req.body;
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          image: updateRequest.image,
          name: updateRequest.name,
          brandName: updateRequest.brandName,
          type: updateRequest.type,
          price: updateRequest.price,
          rating: updateRequest.rating,
          description: updateRequest.description,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateProduct,
        options
      );
      res.send(result);
    });

    // add to cart operation
    app.get("/addProducts", async (req, res) => {
      const cursor = addProductsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/addProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addProductsCollection.findOne(query);
      res.send(result);
    });

    app.post("/addProducts", async (req, res) => {
      const addProduct = req.body;
      // console.log(addProduct);
      const result = await addProductsCollection.insertOne(addProduct);
      res.send(result);
    });

    app.delete("/addProducts/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await addProductsCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Smart tech bd server is running.");
});

app.listen(port, () => {
  console.log(`Server is running on the: ${port}`);
});
