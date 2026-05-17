const express  = require("express");
const cors     = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app       = express();
const PORT      = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

async function start() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("Connecté à MongoDB");

  const db = client.db("shop");
  app.locals.db = db;
  app.use(cors());
  app.use(express.json());
  app.listen(PORT, () => console.log("Serveur demarre sur http://localhost:" + PORT));
  /////////////////////////////////////////////////////////////////////////////////////
  app.get("/api/products", async (req, res) => {
  try
  {
    const db = app.locals.db;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const query = category ? { category } : {};
    const sort = { [req.query.sort || "createdAt"]: req.query.order === "asc" ? 1 : -1 };
    const products = await db.collection("products").find(query).sort(sort).skip(skip).limit(limit).toArray();
    const total = await db.collection("products").countDocuments(query);
    res.json({ 
      products, 
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
    }
    catch (e)
    {
      res.status(1001).json({ error: "Erreur serveur" }); // 500 server error
    }
  });
/////////////////////////////////////////////////////////////////////////////////////

}

start().catch((err) => {
  console.error("Erreur de connexion MongoDB :", err.message);
  process.exit(1);
});

