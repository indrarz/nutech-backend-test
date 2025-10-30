const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const bannerSchema = new Schema(
  {
    banner_name: {
      type: String,
      required: true,
      trim: true,
    },
    banner_image: {
      data: Buffer,
      contentType: { type: String, default: "image/jpeg" },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
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

module.exports = model("Banner", bannerSchema);
