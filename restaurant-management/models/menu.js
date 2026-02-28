const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
    {
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    descripcion: {
        type: String,
        required: true,
        trim: true
    },

    precio: {
        type: Number,
        required: true,
        min: 0
    },

    tipo: {
        type: String,
        required: true,
        enum: ["entrada", "plato_fuerte", "postre", "bebida"]
    },

    disponible: {
        type: Boolean,
        default: true
    },

    restaurantes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurante",
        required: true
        }
    ]
},
    {
    timestamps: true
    }
);

menuSchema.index({ tipo: 1 });
menuSchema.index({ restaurantes: 1 });

module.exports = mongoose.model("Menu", menuSchema);
