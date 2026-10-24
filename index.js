const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
    ObjectId,
} = require("mongodb");

dotenv.config();

const app = express();

const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect MongoDB
    // await client.connect();

    const db = client.db("hireme");
    const jobCollection = db.collection("jobs");

    console.log("MongoDB connected successfully");

    // Test route
    app.get("/", (req, res) => {
      res.send("HireMe server is running");
    });

    // Add Job
    app.post("/job", async (req, res) => {
      try {
        const jobData = req.body;

        console.log("Job received:", jobData);

        const result = await jobCollection.insertOne(jobData);

        res.status(201).json({
          success: true,
          message: "Job added successfully",
          result,
        });
      } catch (error) {
        console.error("Error adding job:", error);

        res.status(500).json({
          success: false,
          message: "Failed to add job",
        });
      }
    });




  //post job in all jobs
    app.get("/job", async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.json(result);
    });




//showing details

app.get("/job/:id", async (req, res) => {
  const { id } = req.params;

  const result = await jobCollection.findOne({
    _id: new ObjectId(id),
  });

  res.json(result);
});



















    // MongoDB connection test
    // await client.db("admin").command({
    //   ping: 1,
    // });

    console.log("MongoDB ping successful");

  } catch (error) {
    console.error("Server error:", error);
  }
}

run();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

