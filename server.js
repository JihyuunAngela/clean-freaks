const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport"); // for authentication - many strategies
const session = require("express-session"); // session middleware
const MongoStore = require('connect-mongo'); // stores the session
const methodOverride = require("method-override"); // override methods
const flash = require("express-flash");
const logger = require("morgan"); // for logs
const connectDB = require("./config/database");
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


// Routes
const mainRoutes = require("./routes/main");
const todoRoutes = require("./routes/todos");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder - public files - adds a middleware for serving static files to your Express app
app.use(express.static("public"));

//Body Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Logging
app.use(logger("dev"));

//Method Override - Use forms for put / delete
app.use(methodOverride("_method")); // use _method or _anything to use to override

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if it wasn't modified
    saveUninitialized: true, // don't create session until something is stored
    store: MongoStore.create({
        mongoUrl: process.env.DB_STRING,
      }), // store session in DB
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/todos", todoRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
