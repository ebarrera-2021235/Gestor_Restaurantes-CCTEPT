const mongoose = require("mongoose");

const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const restauranteSchema = new mongoose.Schema(
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

    categorias: {
        type: [String],
        required: true,
        validate: {
        validator: function (val) {
            return val.length > 0 && val.length <= 2;
        },
        message: "El restaurante puede tener máximo 2 categorías"
        }
    },

    contacto: {
        telefono: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            match: /^\S+@\S+\.\S+$/
    },
        direccion: {
        type: String,
        required: true
    }
    },

    horario: {
        apertura: {
            type: String,
            required: true,
            match: horaRegex
        },
        cierre: {
        type: String,
        required: true,
        match: horaRegex
        }
    },

    estado: {
        type: String,
        enum: ["activo", "inactivo"],
        default: "activo"
    },
    ubicacion: {
        type: String, 
    }
},
    {
    timestamps: true
    }
);


restauranteSchema.pre("save", function () {
    const [horaA, minA] = this.horario.apertura.split(":").map(Number);
    const [horaC, minC] = this.horario.cierre.split(":").map(Number);

    const aperturaMin = horaA * 60 + minA;""
    const cierreMin = horaC * 60 + minC;

    if (cierreMin <= aperturaMin) {
        throw new Error("La hora de cierre debe ser mayor que la hora de apertura");
    }
});


restauranteSchema.pre("findOneAndUpdate", function () {
    const update = this.getUpdate();

    if (update.horario) {
        throw new Error("El horario no puede modificarse una vez creado el restaurante");
    }
});


restauranteSchema.index({ categorias: 1 });

module.exports = mongoose.model("Restaurante", restauranteSchema);
