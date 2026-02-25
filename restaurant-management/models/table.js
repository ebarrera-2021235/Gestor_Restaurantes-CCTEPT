const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
      index: true
    },
    number: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    location: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

tableSchema.index({ restaurantId: 1, number: 1 }, { unique: true });

module.exports = mongoose.model("Table", tableSchema);