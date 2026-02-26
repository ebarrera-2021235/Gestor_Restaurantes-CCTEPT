const mongoose = require("mongoose");


const ORDER_STATUS = {
  PENDING: "pending",
  PREPARING: "preparing",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
};


const ORDER_TYPE = {
  DINE_IN: "dine_in",
  TAKE_AWAY: "take_away",
  DELIVERY: "delivery"
};

const orderSchema = new mongoose.Schema(
  {
    
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante", 
      required: true,
      index: true
    },
    
    userId: {
      type: String, 
      required: true,
      index: true
    },
   
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: false
    },
    tipo_pedido: {
      type: String,
      enum: Object.values(ORDER_TYPE),
      required: true
    },
    
    items: [
      {
        menuId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Menu", 
          required: true 
        },
        nombre: String, 
        cantidad: { 
          type: Number, 
          required: true, 
          min: 1 
        },
        precio_unitario: { 
          type: Number, 
          required: true 
        }
      }
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    impuestos: {
      type: Number,
      required: true,
      default: 0
    },
    servicio: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    estado: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING
    }
  },
  {
    
    timestamps: true 
  }
);


orderSchema.index({ restaurantId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);