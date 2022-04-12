let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let upcomingEventsSchema = new Schema({
    title: String,
    description: String,
    imgURL:String,
    date: Date,
    time: Date,
    location: {
        locality: {
            type: String
        },
        country: {
            type: String,
        },
        lat: {
            type: Number
        },
        long: {
            type: Number
        }
    }
});

let UpcomingEvents = mongoose.model('UpcomingEvents', upcomingEventsSchema, 'UpcomingEvents');
module.exports = UpcomingEvents;