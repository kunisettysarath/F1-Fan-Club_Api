const express = require("express");
const app = express();
var fs = require("fs");
const passport = require("passport");
const Users = require("../models/users");
const UpcomingEvents = require("../models/upcomingEvents");
const upRaces = require("../models/upcomingRaces");
const Circuits = require("../models/circuits");
const DriverStandings = require("../models/driverStandings");
const TeamStandings = require("../models/teamStandings");
const Teams = require("../models/teams");
const Races = require("../models/races");
const controller = require("../controller/controller");
const driverDetail = require("../controller/driverdetail");
const Drivers = require("../models/drivers");
const Products = require("../models/products");
const booking = require("../controller/booking");
const newsController = require("../controller/newsController");
var jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});


app.get("/", (req, res) => {
  res.send("api works");
});
app.get("/posts", (req, res) => {
  contents = fs.readFileSync("app/files/news.json");
  var jsonContent = JSON.parse(contents);
  res.send(jsonContent);
});
app.get("/races", (req, res) => {
  contents = fs.readFileSync("app/files/races.json");
  var jsonContent = JSON.parse(contents);
  res.send(jsonContent);
});
app.post("/login", (req, res) => {
  let result = Users.findOne(
    {
      email: req.body.data.email,
      password: req.body.data.pass,
    },
    { password: 0 },
    (err, resp) => {
      if (err) {
        res.send({
          data: "",
        });
      } else {
        if (resp == null)
          res.send({
            data: "",
          });
        else {
          var token = jwt.sign({ data: resp }, "MyS3cr3tK3Y", {
            expiresIn: 60480,
          });
          res.send({
            data: resp,
            token: `Bearer ${token}`,
          });
        }
      }
    }
  );
});

app.get("/leaderboard", (req, res) => {
  let result = Users.find(
    {},
    {
      _id: false,
      name: true,
      points: true,
      profilePicUrl: true,
      country: true,
      gender: true,
      dob: true,
      email: true,
    }
  )
    .sort({
      points: -1,
    })
    .limit(10);
  result.exec((err, resp) => {
    if (err) {
      res.send({
        error: "",
      });
    } else {
      res.send({
        data: resp,
      });
    }
  });
});

app.get("/drivers", (req, res) => {
  let result = Drivers.find({}, {});
  result.exec((err, resp) => {
    if (err) {
      res.send({
        data: "error occured",
      });
    }
    res.send({
      data: resp,
    });
  });
});

app.get("/upcoming_races", (req, res) => {
  upRaces.find({}, (err, response) => {
    res.send(response);
  });
});

app.get("/upcoming-events", (req, res) => {
  UpcomingEvents.find({}, (err, data) => {
    res.send({
      data: data,
    });
  });
});

/* API call for a particular event */
app.get("/upcoming-events/event", (req, res) => {
  let eventId = req.query.eventId;
  let statement = UpcomingEvents.findOne(
    {
      _id: eventId,
    },
    (err, data) => {
      res.send({
        data: data,
      });
    }
  );
});

app.get("/circuits", (req, res) => {
  Circuits.find({}, (err, data) => {
    res.send({
      data: data,
    });
  });
});

app.get("/driver-standings", (req, res) => {
  DriverStandings.find({}, (err, data) => {
    res.send({
      data: data,
    });
  });
});

app.get("/team-standings", (req, res) => {
  TeamStandings.find({}, (err, data) => {
    res.send({
      data: data,
    });
  });
});

// app.get("/drivers", (req, res) => {
//   Drivers.find({}, (err, data) => {
//     res.send({
//       data: data,
//     });
//   });
// });

app.get("/circuits/circuit-details", (req, res) => {
  let jsonResult = {};
  let circuitId = req.query.circuitId;
  Circuits.findOne(
    {
      circuitId: circuitId,
    },
    {
      _id: 0,
    },
    (err, data_circuit) => {
      jsonResult.circuit = data_circuit;

      Races.find(
        {
          circuitId: circuitId,
        },
        {
          _id: 0,
          season: 1,
          circuitId: 1,
          date: 1,
          result: {
            $slice: 3,
          },
        },
        (err, data_races) => {
          jsonResult.result = data_races;
          res.send({
            data: jsonResult,
          });
        }
      ).sort({
        season: 1,
      });
    }
  );
});

app.get("/teams", (req, res) => {
  Teams.find({}, (err, response) => {
    if (err) {
      res.send({
        data: "",
      });
    }
    res.send({
      data: response,
    });
  });
});

/* API for product section starts from here here */
app.get("/products", (req, res) => {
  Products.find({}, (err, data) => {
    res.send({
      data: data,
    });
  });
});

//console.log(auth.authenticate());
// app.use((req, res, next) => {
//     console.log("hii");
//     //console.log(next);
//     if (auth.authenticate()) {
//         console.log("authenticated");
//         next();
//     }
//     console.log("not authenticated")

// });
// app.use(() => {
//     if (auth.authenticate()) {
//         next;
//     }
// })
app.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    // console.log(req.headers);
    console.log("xyz");
    res.send({ data: "xyzsafd" });
  }
);
app.get("/teams/:teamId", controller.teamDetail);
app.get("/driver_detail/:driver", driverDetail.driverDetail);
app.get("/driverStangingDetail/:driver", driverDetail.driverStangingDetail);
app.get("/driverPersonalDetail/:driver", driverDetail.driverPersonalDetail);
app.post("/signup", controller.signup);
app.post("/eventBooking", booking.booking);
app.post("/ticketBooking", booking.raceBooking);
app.get("/news", newsController.news);
app.get("/news/details", newsController.newsDetails);
app.use("/driver", express.static(__dirname + "/../../assets/driver"));
app.use("/driver", express.static(__dirname + "/../../assets/driver"));
app.get("/seasons", controller.racesResult);
app.get("/seasons/season-details/:season", controller.seasonResult);
app.post("/updatePoints", controller.updatePoints);
app.post("/purchaseMerchandise", controller.purchaseMerchandise);
/* API call for image & videos*/
app.use(
  "/product/thumbnail",
  express.static(__dirname + "/../../assets/products")
);
app.use("/logos", express.static(__dirname + "/../../assets/logos"));
app.use(
  "/event/thumbnail",
  express.static(__dirname + "/../../assets/birthday")
);

const request = require('request');

//storing teams details

// request('http://ergast.com/api/f1/constructors.json?limit=1000', { json: true }, (err, res, body) => {
//   console.log("in2");
//   arr = res.body.MRData.ConstructorTable.Constructors;
//   console.log(arr);
//   for (var temp in arr) {
//     // console.log(arr[temp].constructorId);
//     new Teams(arr[temp]).save()
//     .then(item => {
//       console.log("item saved to database");
//       })
//       .catch(err => {
//       console.log(err);
//       });
//   }
    
// });

//adding drivers
// request('http://ergast.com/api/f1/drivers.json?limit=1000', { json: true }, (err, res, body) => {
//   console.log("in2");
//   arr = res.body.MRData.DriverTable.Drivers;
//   console.log(arr);
//   for (var temp in arr) {
//     // console.log(arr[temp].constructorId);
//     new Drivers(arr[temp]).save()
//     .then(item => {
//       console.log("item saved to database");
//       })
//       .catch(err => {
//       console.log(err);
//       });
//   }
    
// });

//adding circuits
// request('http://ergast.com/api/f1/circuits.json?limit=1000', { json: true }, (err, res, body) => {
//   console.log("in2");
//   arr = res.body.MRData.CircuitTable.Circuits;
//   console.log(arr);
//   for (var temp in arr) {
//     // console.log(arr[temp].constructorId);
//     new Circuits(arr[temp]).save()
//     .then(item => {
//       console.log("item saved to database");
//       })
//       .catch(err => {
//       console.log(err);
//       });
//   }
    
// });

// adding seasons
// for (var v = 1950; v < 2010; v++) {
//   request('http://ergast.com/api/f1/' + v + '/results.json?limit=1000', { json: true }, (err, res, body) => {
//     console.log("in2");
//     // console.log(res);
//     arr = res.body.MRData.RaceTable;
//     for (var i = 0; i < arr.Races.length; i++) {
//       var temp = {};
//       temp.season = arr.Races[i].season;
//       temp.round = arr.Races[i].round;
//       temp.url = arr.Races[i].url;
//       temp.circuitId = arr.Races[i].Circuit.circuitId;
//       temp.date = arr.Races[i].date;
//       temp.time = arr.Races[i].date;
    
//       var results = [];
//       for (var j = 0; j < arr.Races[i].Results.length; j++) {
//         var test = {};
//         test.number = arr.Races[i].Results[j].number;
//         test.position = arr.Races[i].Results[j].position;
//         test.points = arr.Races[i].Results[j].points;
//         test.driverId = arr.Races[i].Results[j].Driver.driverId;
//         test.teamId = arr.Races[i].Results[j].Constructor.constructorId;//arr.Races[i].Results[j].position;
//         test.grid = arr.Races[i].Results[j].grid;
//         test.laps = arr.Races[i].Results[j].laps;
//         test.timeTaken = 0; arr.Races[i].Results[j].position;
//         test.avgSpeed = 0;//arr.Races[i].Results[j].position;
//         results[j] = test;
//       }
//       temp.result = results;
//       new Races(temp).save().
//         then(item => {
//           console.log("item saved to database");
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     }
//     // console.log(temp);
  
    
//   });

//adding circuits
// request('http://ergast.com/api/f1/circuits.json?limit=1000', { json: true }, (err, res, body) => {
//   console.log("in2");
//   arr = res.body.MRData.CircuitTable.Circuits;
//   console.log(arr);
//   for (var temp in arr) {
//     // console.log(arr[temp].constructorId);
//     new Users(arr[temp]).save()
//     .then(item => {
//       console.log("item saved to database");
//       })
//       .catch(err => {
//       console.log(err);
//       });
//   }
    
// });

module.exports = app;

