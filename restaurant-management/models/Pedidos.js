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
    items: {
      type: [
        {
          id_plato: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Menu", 
            required: true 
          },
          nombre_snapshot: {
            type: String,
            required: true
          }, 
          cantidad: { 
            type: Number, 
            required: true, 
            min: [1, "La cantidad debe ser al menos 1"] 
          },
          precio_unitario: { 
            type: Number, 
            required: true,
            min: [0, "El precio no puede ser negativo"]
          },
          subtotal: {
            type: Number,
            required: true,
            min: [0, "El subtotal no puede ser negativo"]
          }
        }
      ],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: "El pedido debe contener al menos un ítem."
      }
    },
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
    },
    resenia_realizada: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true 
  }
);

orderSchema.pre("validate", function(next) {
  if (this.items && this.items.length > 0) {
    let calculadoSubtotal = 0;
    this.items.forEach(item => {
      item.subtotal = item.cantidad * item.precio_unitario;
      calculadoSubtotal += item.subtotal;
    });
    this.subtotal = calculadoSubtotal;
    this.total = this.subtotal + (this.impuestos || 0) + (this.servicio || 0);
  }
  next();
});

orderSchema.post("init", function(doc) {
  doc._originalEstado = doc.estado;
});

orderSchema.pre("save", function(next) {
  if (!this.isNew && this.isModified("estado")) {
    if (this._originalEstado === ORDER_STATUS.COMPLETED || this._originalEstado === ORDER_STATUS.CANCELLED) {
      return next(new Error(`No se puede modificar un pedido que ya está en estado: ${this._originalEstado}`));
    }
  }
  next();
});

orderSchema.index({ restaurantId: 1, createdAt: -1 });

module.exports = {
  Order: mongoose.model("Order", orderSchema),
  ORDER_STATUS,
  ORDER_TYPE
};