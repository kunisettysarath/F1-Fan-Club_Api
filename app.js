const express = require("express");
const path = require("path");
const http = require("http");
var passport = require("passport");
var mongoose = require("mongoose");
const uri = "mongodb+srv://admin:admin@cluster0.2zu0uss.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'f1-fan-club-data' });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

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
