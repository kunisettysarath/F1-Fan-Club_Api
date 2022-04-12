const Races = require("../models/races");
const Teams = require("../models/teams");
const TeamStandings = require("../models/teamStandings");
const Users = require("../models/users");
const Bookings = require("../models/booking");
const Orders = require("../models/orders");

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
