const Bookings = require('../models/booking');
const UpcomingRaces = require('../models/upcomingRaces');
const Orders = require('../models/orders');
const product = require('../models/products');
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
