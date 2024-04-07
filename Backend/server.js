const express = require("express");
const dotenv = require("dotenv");

const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "http://167.172.28.219:3000 http://lvl-up.pokegochi.io https://lvl-up.pokegochi.io https://Lvlup.pokegochi.com http://Lvlup.pokegochi.com http://pokegochi.io https://pokegochi.io", 
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

dotenv.config();
const server = require("http").createServer(app);
const connectDB = require("./config/db");
const path = require("path");

const views = __dirname + "/../client/build";

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.static(views));

app.get('*', function (req, res) {
  res.sendFile(path.join(views, 'index.html'));
});

app.get("/test", (req, res) => {
  console.log("test")
  res.json({ message: "Welcome to Pokegochi-Monster application." });
});


//db connection

connectDB();

app.use("/api/users", require("./routes/api/users"));

// gaming

//

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
