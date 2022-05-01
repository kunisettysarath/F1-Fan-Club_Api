const Races = require("../models/races");
const Teams = require("../models/teams");
const TeamStandings = require("../models/teamStandings");
const Users = require("../models/users");
const Bookings = require("../models/booking");
const Orders = require("../models/orders");
const News = require('../models/news');
const UpcomingRaces = require('../models/upcomingRaces');
const product = require('../models/products');
const Driver = require("../models/drivers");
const DriverStandings = require("../models/driverStandings");


exports.teamDetail = async (req, res) => {
  let teamId = req.params.teamId;
  let result = {};
  result.details = await Teams.findOne({
    constructorId: teamId,
  });
  let teamRaces = Races.aggregate([
    {
      $unwind: "$result",
    },
    {
      $match: {
        "result.teamId": {
          $eq: teamId,
        },
      },
    },
    {
      $group: {
        _id: {
          season: "$season",
          round: "$round",
          url: "$url",
          circuitId: "$circuitId",
          date: "$date",
        },
        result: {
          $push: "$result",
        },
      },
    },
    {
      $sort: {
        "_id.season": -1,
      },
    },
  ]);

  let teamData = await teamRaces.exec();
  result.races = teamData;
  let standing = TeamStandings.aggregate([
    {
      $unwind: "$ConstructorStandings",
    },
    {
      $match: {
        "ConstructorStandings.constructorId": {
          $eq: teamId,
        },
      },
    },
    {
      $group: {
        _id: {
          season: "$season",
          round: "$round",
        },
        ConstructorStandings: {
          $push: "$ConstructorStandings",
        },
      },
    },
    {
      $sort: {
        "_id.season": -1,
      },
    },
  ]);
  result.standings = await standing.exec();
  res.send({
    data: result,
  });
};

exports.signup = async (req, res) => {
  let user = await Users.findOne(
    {
      email: req.body.data.email,
    },
    {
      password: 0,
      security: 0,
    }
  );
  if (user) {
    res.send({
      data: "user already exist",
    });
  } else {
    let newUser = Users({
      name: req.body.data.name,
      email: req.body.data.email,
      password: req.body.data.pass,
      profilePicUrl: "",
      gender: req.body.data.gender,
      country: "",
      dob: req.body.data.date,
      phoneNo: req.body.data.mobile,
      temporaryKey: "",
      points: 0,
    });
    newUser.save((err, resp) => {
      if (err) {
        res.send({
          error: "Something wrong happened please try again later",
        });
      } else {
        res.send({
          data: "user Registration Successfull",
        });
      }
    });
  }
};

/* API call for season years only */
exports.racesResult = async (req, res) => {
  Races.distinct("season", async (err, resp) => {
    if (err) {
      res.send({
        error: "Something wrong happened please try again later",
      });
    } else if (resp) {
      res.send({
        data: resp,
      });
    }
  });
};

/* API call for individual season */
exports.seasonResult = async (req, res) => {
  let seasonYear = req.params.season;
  Races.find(
    {
      season: seasonYear,
    },
    {
      _id: 0,
    },
    async (err, resp) => {
      if (err) {
        res.send({
          error: "Something wrong happened please try again later",
        });
      } else if (resp) {
        res.send({
          data: resp,
        });
      }
    }
  );
};

exports.purchaseMerchandise = (req, res) => {
  let order = {
    userId: req.body.userId,
    productId: req.body.productId,
    quantitly: req.body.quantity,
    sellingPrice: req.body.sellingPrice,
    deliveryAddress: req.body.deliveryAddress,
    productName: req.body.productTitle,
  };
  let newOrder = new Orders(order);
  newOrder.save((err, resp) => {
    if (err) {
      res.send({
        error: "Something wrong happened please try again later",
      });
    } else if (resp) {
      res.send({
        data: resp._id,
      });
    }
  });
};
exports.updatePoints = (req, res) => {
  let points = req.body.points;
  let email = req.body.email;

  Users.findOne(
    {
      email: email,
    },
    (err, resp) => {
      if (resp) {
        resp.points = resp.points + parseInt(points);
        resp.save((e, r) => {
          if (r) {
            res.send({
              data: "Successfully Updated Points",
            });
          } else {
            res.send({
              error: "Something wrong happened please try again later",
            });
          }
        });
      } else {
        res.send({
          error: "Something wrong happened please try again later",
        });
      }
    }
  );
};


exports.news = (req, res) => {
  News.find({}, (err, data) => {
      if (err) {
          res.send({
              err
          });
      }
      res.send({
          data: data
      });
  })
}
exports.newsDetails = (req, res) => {
  let newsId = req.query.newsId;
  let news = News.findOne({
      "_id": newsId
  }, (err, data) => {
      res.send({
          data: data
      })
  });
}

exports.raceBooking = async(req, res) => {

  Bookings.count({
      eventId: req.body.eventId
  }, function(err, c) {
      if (err) {
          res.send({
              data: "error"
          })

      } else {
          Bookings.count({
              eventId: req.body.eventId,
              userEmail: req.body.email
          }, function(err, count) {
              if (err) {
                  res.send({
                      data: "error"
                  })
              } else {
                  if (count == 0) {
                      c = c + 1;
                      let newBooking = new Bookings({
                          userEmail: req.body.email,
                          eventId: req.body.eventId,
                          eventType: "race",
                          seatNo: c
                      });
                      newBooking.save((err, resp) => {

                          if (err) {
                              res.send({
                                  error: "Something wrong happened please try again later"
                              })
                          } else {

                              res.send({
                                  data: "Ticket Booked Succesfully",
                                  bookingId: c
                              })
                          }
                      });
                  } else {
                      res.send({
                          data: "Already booked",
                          bookingId: c
                      })
                  }
              }
          })
      }
  })
}

exports.booking = async(req, res) => {

  Bookings.count({
      eventId: req.body.event
  }, function(err, c) {
      if (err) {
          res.send({
              data: "error"
          })
      } else {
          Bookings.count({
              eventId: req.body.event,
              userEmail: req.body.email
          }, function(err, count) {
              if (err) {
                  res.send({
                      data: "error"
                  })
              } else {
                  if (count == 0) {
                      c = c + 1;
                      let newBooking = new Bookings({
                          userEmail: req.body.email,
                          eventId: req.body.event,
                          eventType: "meetup",
                          meetUpStatus: req.body.status
                      });
                      newBooking.save((err, resp) => {
                          if (err) {
                              res.send({
                                  error: "Something wrong happened please try again later"
                              })
                          } else {

                              res.send({
                                  data: "Response Recorded Succesfully",
                                  bookingId: c
                              })
                          }
                      });
                  } else {
                      res.send({
                          data: "Already Registered",
                          bookingId: c
                      })
                  }
              }

          })
      }
  })
}

exports.bookings = (req, res) => {
  Bookings.find({
      userEmail: req.body.email,
      eventType: "race"
  }, async(err, resp) => {
      if (err) {
          res.send({
              error: "Something wrong happened please try again later"
          })
      } else {
          let length = resp.length;
          for (let i = 0; i < length; i++) {
              item = resp[i];
              if (item.eventType == 'race') {
                  let event = await UpcomingRaces.findOne({
                      _id: item.eventId
                  });
                  data = {
                      booking: item,
                      race: event
                  };
                  resp[i] = data;
              }
          }
          res.send({
              data: resp
          })
      }
  })
}



exports.orders = (req, res) => {

  Orders.find({
      userId: req.body.userId
  }, async(err, resp) => {
      if (err) {
          res.send({
              error: "Something wrong happened please try again later"
          })
      } else {
          let length = resp.length;
          for (let i = 0; i < length; i++) {
              item = resp[i];
              let event = await product.findOne({
                  _id: item.productId
              });
              data = {
                  booking: item,
                  race: event
              };
              resp[i] = data;
          }
          res.send({
              data: resp
          })
      }
  })
}


exports.driverDetail = (req, res) => {
  driverName = new Array();
  avgSpeed = 0;
  flag = 0;
  team = new String();
  totalRaces = 0;
  points = 0;
  races = new Array();
  // console.log("----------------------------------");
  // console.log(req.params);
  let driverId = req.params.driver;
  Races.find(
    {},
    {
      _id: 0,
      season: 1,
      circuitId: 1,
      "result.points": 1,
      "result.avgSpeed": 1,
      "result.teamId": 1,
      "result.driverId": 1,
    },
    (err, data_races) => {
      // console.log("data_races" + data_races);
      for (let result1 of data_races) {
        for (let result2 of result1.result) {
          tempName = String(result2.driverId);
          // console.log("----------------------------------");
          // console.log(driverId + "========" + tempName);
          if (driverId == tempName) {
            // console.log("in------" + result2);
            team = result2.teamId;
            if (avgSpeed < result2.avgSpeed) {
              avgSpeed = result2.avgSpeed;
            }
            points += result2.points;
            flag = 1;
          }
        }
        if (flag == 1) {
          totalRaces++;
          races.push(result1.circuitId);
          flag = 0;
        }
      }
      res.send({
        team: team,
        races: totalRaces,
        totalPoint: points,
        track: races,
        maxAvgSpeed: avgSpeed,
      });
    }
  );
};

exports.driverPersonalDetail = (req, res) => {
  driverName = new Array();
  avgSpeed = 0;
  flag = 0;
  dob = new String();
  totalRaces = 0;
  points = 0;
  races = new Array();
  let driverId = req.params.driver;
  Driver.findOne(
    { driverId: driverId },
    {
      _id: 0,
      givenName: 1,
      familyName: 1,
      dateOfBirth: 1,
      nationality: 1,
      desc: 1,
      url: 1,
    },
    (err, data_driver) => {
      if (err) {
        res.send({
          err: "Please Try Again Later",
        });
      }
      if (data_driver) {
        res.send({
          givenName: data_driver.givenName,
          familyName: data_driver.familyName,
          nationality: data_driver.nationality,
          dateOfBirth: data_driver.dateOfBirth,
          description: data_driver.desc,
          url: data_driver.url,
        });
      }
    }
  );
};

exports.driverStangingDetail = (req, res) => {
  year = new Array();
  standing = new Array();
  wins = new Array();
  let driverId = req.params.driver;
  DriverStandings.find(
    {},
    {
      season: 1,
      "DriverStandings.position": 1,
      "DriverStandings.driverId": 1,
      "DriverStandings.wins": 1,
    },
    (err, data_races) => {
      if (err) {
        res.send({ resp: "Something Went Wrong" });
      }

      for (let result1 of data_races) {
        for (let result2 of result1.DriverStandings) {
          tempName = String(result2.driverId);
          if (driverId == tempName) {
            wins.push(result2.wins);
            standing.push(result2.position);
            flag = 1;
          }
        }
        if (flag == 1) {
          year.push(result1.season);
          flag = 0;
        }
      }
      res.send({
        year: year,
        standing: standing,
        wins: wins,
      });
    }
  );
};
