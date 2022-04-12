let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let bookingSchema = new Schema({
    userEmail: String,
    eventId: Schema.ObjectId,
    eventType: {
        type: String,
        enum: ['race', 'meetup']
    },
    seatNo: String,
    meetUpStatus: {
        type: String,
        enum: ['Accept', 'Reject', 'Tentative']
    },
});

let Bookings = mongoose.model('Bookings', bookingSchema, 'Bookings');
module.exports = Bookings;