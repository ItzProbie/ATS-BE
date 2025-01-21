const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();


const db = require("./config/dbConnector");
const auth = require("./routes/auth");
const media = require("./routes/media");
const ats = require("./routes/ats");
const redisWrapper = require("./routes/redis-wrapper");

db.connect();
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth" , auth);
app.use("/api/v1/media" , media);
app.use("/api/v1/ats" , ats)
app.use("/api/v1/redis-wrapper" , redisWrapper);

app.get("/" , (req , res) => {
    res.send(`<h1>Server started successfully</h1>`);
})


const PORT = process.env.PORT || 3000;
app.listen(PORT , () => {
    console.log(`SERVER STARTED AT PORT ${PORT}`);
})
