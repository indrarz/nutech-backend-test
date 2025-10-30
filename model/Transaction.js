const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoice_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    transaction_type: {
      type: String,
      enum: ["TOPUP", "PAYMENT"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.created_on = moment(ret.createdAt)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD HH:mm:ss");
        ret.updated_at = moment(ret.updatedAt)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD HH:mm:ss");
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

// Generate invoice number
transactionSchema.statics.generateInvoiceNumber = async function (userId) {
  const dateStr = moment().tz("Asia/Jakarta").format("DDMMYYYY");
  const countToday = await this.countDocuments({
    user: userId,
    createdAt: {
      $gte: moment().tz("Asia/Jakarta").startOf("day"),
      $lte: moment().tz("Asia/Jakarta").endOf("day"),
    },
  });

  const sequence = String(countToday + 1).padStart(3, "0");
  return `INV${dateStr}-${userId}${sequence}`;
};

module.exports = model("Transaction", transactionSchema);
