const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otpSent: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function () {
      return new Date(new Date().getTime() + 120 * 1000); // set expiration to 2 minutes from now
    },
  },
});

module.exports = mongoose.model("Otp", otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }));
