const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const app = express();

mongoose
  .connect("mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + process.env.DB_CLUSTER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// CORS (Cross Origin Ressource Sharing) => sécurité permettant contrôle des ressources partagés
app.use((req, res, next) => {
  // accès à tous ("*")
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    // Autorisation d' utiliser certaines entête pour les requêtes
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // Autorsiation de telle ou telles méthodes
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  // appel de prochain middleware
  next();
});

app.use(bodyParser.json());
//gestionnaire de routage pour les images
app.use("/images", express.static(path.join(__dirname, "images")));
//utilisation routage pour les sauces
app.use("/api/sauces", sauceRoutes);
//utilisation routage pour les utilisateurs
app.use("/api/auth", userRoutes);
app.use(helmet());
app.use(mongoSanitize());
module.exports = app;
