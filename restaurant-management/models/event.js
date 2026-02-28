const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurante",
            required: true
        },

        nombre: {
            type: String,
            required: true,
            trim: true
        },

        descripcion: {
            type: String,
            required: true,
            trim: true
        },

        fecha_inicio: {
            type: Date,
            required: true
        },

        fecha_fin: {
            type: Date,
            required: true
        },

        cupo_maximo: {
            type: Number,
            required: true,
            min: 1
        },

        cupos_disponibles: {
            type: Number,
            required: true,
            min: 0
        },

        estado: {
            type: String,
            enum: ["activo", "inactivo", "vencido", "agotado"],
            default: "activo"
        }
    },
    {
        timestamps: true
    }
);

// Validar que fecha_fin sea mayor a fecha_inicio
eventSchema.pre("save", function () {
    if (this.fecha_fin <= this.fecha_inicio) {
    throw new Error("La fecha de fin debe ser mayor a la fecha de inicio");
    }
    if (this.cupos_disponibles > this.cupo_maximo) {
    throw new Error("Los cupos disponibles no pueden superar el cupo máximo");
    }
});


eventSchema.index({ restaurantId: 1 });
eventSchema.index({ estado: 1 });
eventSchema.index({ fecha_inicio: 1, fecha_fin: 1 });

module.exports = mongoose.model("Event", eventSchema);