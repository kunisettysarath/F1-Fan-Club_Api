const Races = require("../models/races");
const Driver = require("../models/drivers");
const DriverStandings = require("../models/driverStandings");

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
