const mongoose = require("mongoose");

const reseniaSchema = new mongoose.Schema({
    restaurantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Restaurante", 
        required: true 
    },
    userId: { 
        type: String, 
        required: true 
    },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true,
        unique: true 
    },
    puntuacion: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comentario: { 
        type: String, 
        trim: true 
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    }
});

// Cambiamos el nombre del modelo a Resenia
module.exports = mongoose.model("Resenia", reseniaSchema);