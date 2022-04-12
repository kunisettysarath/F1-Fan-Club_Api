let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let upcomingRacesSchema = new Schema({
  season: Number,
  round: Number,
  url: String,
  raceName: String,
  circuitId: String,
  date: Date,
  time: Date,
});
let UpcomingRaces = mongoose.model(
  "UpcomingRaces",
  upcomingRacesSchema,
  "UpcomingRaces"
);
module.exports = UpcomingRaces;
