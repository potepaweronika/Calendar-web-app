require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const connection = require("./db.js");
const tokenVerification = require('./middleware/tokenVerification')
const app = express();
const cors = require("cors");
connection();

//middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/api/users/",tokenVerification)
app.use("/api/auth", authRoutes)
app.use("/api/users/", userRoutes)
app.get("/api/events", tokenVerification)
app.use("/api/events/", eventRoutes)

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`));
