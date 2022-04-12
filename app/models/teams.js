let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let teamsSchema = new Schema({
    constructorId: String,
    url: String,
    name: String,
    nationality: String,
});

let Teams = mongoose.model('Teams', teamsSchema, 'Teams');
module.exports = Teams;