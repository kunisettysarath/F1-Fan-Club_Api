const express = require("express");
const path = require("path");
const http = require("http");
var passport = require("passport");
var mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/SampleDB");
connect.then(
  (db) => {
    console.log("connected to server");
  },
  (err) => {
    console.log(err);
  }
);

const bodyParser = require("body-parser");
const api = require("./app/routes/api");
const app = express();
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/circuit_images", express.static(__dirname + "/assets/circuits"));
app.use("/images", express.static(__dirname + "/assets/Images"));
app.use("/api", api);
const port = process.env.PORT || "3000";
//app.set('port', port);
//const server = http.createServer(app);
app.listen(port);
