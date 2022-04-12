let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: Number,
  dob: Date,
  profilePicUrl: String,
  country: String,
  gender: String,
  password: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
  },
  subscribed: Boolean,
  role: {
    type: String,
    enum: ["user", "admin"],
  },
});
let Users = mongoose.model("Users", usersSchema, "Users");
module.exports = Users;
module.exports.getid = function (userMid, callback) {
  Users.findById(userMid, callback);
};
