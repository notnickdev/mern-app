const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

const port = 3000 || process.env.PORT;

require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;

// Error
db.on("error", (error) => {
  console.error(error);
});

db.once("open", () => {
  console.log("Connected to database");
});

app.use(express.json());
app.use(cors());

// Routes
const subscribersRoute = require("./routes/subscribers");
const channelRoute = require('./routes/channel.route');

// Uses route
app.use("/subscribers", subscribersRoute);
app.use('/channels', channelRoute);


app.use("*", (req, res) => {
  res.send("Hello, World!");
});


app.listen(port, () => console.log(`Listening on port ${port}`));
