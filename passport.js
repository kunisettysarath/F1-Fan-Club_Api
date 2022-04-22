var users = require("./app/models/users.js");
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
module.exports = function(passport) {

    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'MyS3cr3tK3Y';
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        users.findOne({ _id: jwt_payload.data._id }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });

    }));
}