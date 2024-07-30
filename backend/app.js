const express = require("express");
const app=express();
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error");
const path = require("path")
const cors = require("cors");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// CORS configuration
const corsOptions = {
  origin: "https://aidbridgemernproject-frontend.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" })); 
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

//Route Imports
const user=require("./routes/userRoute.js")
const chat=require("./routes/chatRoute.js")
const contact=require("./routes/contactRoute.js")


app.use("/api/v1", user);
app.use("/api/v1", chat);
app.use("/api/v1", contact);

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
 res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

//Middleware for errors
app.use(errorMiddleware);

module.exports = app;
