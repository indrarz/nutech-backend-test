const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    profile_image: {
      data: Buffer,
      contentType: { type: String, default: "image/jpeg" },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.createdAt = moment(ret.createdAt)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD HH:mm:ss");
        ret.updatedAt = moment(ret.updatedAt)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD HH:mm:ss");
        return ret;
      },
    },
  }
);

module.exports = model("User", userSchema);
