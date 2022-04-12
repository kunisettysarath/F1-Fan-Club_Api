let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let racesSchema = new Schema({
  season: Number,
  round: Number,
  url: String,
  circuitId: String,
  date: String,
  time: String,
  result: [
    {
      number: {
        type: Number,
      },
      position: {
        type: Number,
      },
      points: {
        type: Number,
      },
      driverId: {
        type: String,
      },
      teamId: {
        type: String,
      },
      grid: {
        type: String,
      },
      laps: {
        type: Number,
      },
      timeTaken: {
        type: Date,
      },
      avgSpeed: {
        type: Number,
      },
    },
  ],
});
let Races = mongoose.model("Races", racesSchema, "Races");
module.exports = Races;
