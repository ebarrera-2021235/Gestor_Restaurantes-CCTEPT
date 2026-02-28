const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurante",
            required: true
        },

        titulo: {
            type: String,
            required: true,
            trim: true
        },

        tipo_descuento: {
            type: String,
            required: true,
            enum: ["porcentaje", "monto_fijo"]
        },

        valor: {
            type: Number,
            required: true,
            min: 0
        },

        fecha_inicio: {
            type: Date,
            required: true
        },

        fecha_fin: {
            type: Date,
            required: true
        },

        activa: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Validar coherencia de fechas
promotionSchema.pre("save", function () {
    if (this.fecha_fin <= this.fecha_inicio) {
        throw new Error("La fecha de fin debe ser mayor a la fecha de inicio");
    }

    if (this.tipo_descuento === "porcentaje" && this.valor > 100) {
        throw new Error("El porcentaje de descuento no puede superar 100");
    }
});


promotionSchema.index({ restaurantId: 1 });
promotionSchema.index({ activa: 1 });
promotionSchema.index({ fecha_inicio: 1, fecha_fin: 1 });

module.exports = mongoose.model("Promotion", promotionSchema);