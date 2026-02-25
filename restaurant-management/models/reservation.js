const mongoose = require("mongoose");

const RESERVATION_STATUS = {
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed"
};

const reservationSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
      index: true
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Table",
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    reservationDate: {
      type: Date,
      required: true,
      index: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    people: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: Object.values(RESERVATION_STATUS),
      default: RESERVATION_STATUS.CONFIRMED
    }
  },
  {
    timestamps: true
  }
);

reservationSchema.index({
  tableId: 1,
  reservationDate: 1,
  status: 1
});

module.exports = mongoose.model("Reservation", reservationSchema);