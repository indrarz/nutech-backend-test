const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const serviceSchema = new Schema(
  {
    service_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    service_name: {
      type: String,
      required: true,
      trim: true,
    },
    service_icon: {
      data: Buffer,
      contentType: { type: String, default: "image/jpeg" },
    },
    service_tariff: {
      type: Number,
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

module.exports = model("Service", serviceSchema);
