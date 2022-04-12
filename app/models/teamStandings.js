let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let teamsStandingsSchema = new Schema({
    "season": Number,
    "round": Number,
    "ConstructorStandings": [{
        "constructorId": String,
        "points": Number,
        "position": Number,
        "wins": Number
    }],
})

let TeamStandings = mongoose.model('TeamStandings', teamsStandingsSchema, 'TeamStandings');
module.exports = TeamStandings;