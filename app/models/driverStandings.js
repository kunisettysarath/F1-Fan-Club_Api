let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let driverStandingsSchema = new Schema({
    "season": Number,
    "round": Number,
    "DriverStandings": [{
        "driverId": String,
        "constructorId": String,
        "points": Number,
        "position": Number,
        "wins": Number
    }],
})

let DriverStandings = mongoose.model('DriverStandings', driverStandingsSchema, 'DriverStandings');
module.exports = DriverStandings;