const Promotion = require("../models/promotion.js");

async function crearPromocion(data) {
    const ahora = new Date();

    if (new Date(data.fecha_inicio) < ahora) {
        throw new Error("La fecha de inicio no puede ser en el pasado");
    }

    if (new Date(data.fecha_fin) <= new Date(data.fecha_inicio)) {
        throw new Error("La fecha de fin debe ser mayor a la fecha de inicio");
    }

    if (data.tipo_descuento === "porcentaje" && data.valor > 100) {
        throw new Error("El porcentaje de descuento no puede superar 100");
    }

    const promocion = new Promotion(data);
    return await promocion.save();
}

async function obtenerPromociones() {
    return await Promotion.find().populate("restaurantId");
}

async function obtenerPromocionPorId(id) {
    return await Promotion.findById(id).populate("restaurantId");
}

async function obtenerPromocionesActivas(restaurantId) {
    const ahora = new Date();

    const filtro = {
        activa: true,
        fecha_inicio: { $lte: ahora },
        fecha_fin: { $gte: ahora }
    };

    if (restaurantId) {
        filtro.restaurantId = restaurantId;
    }

    return await Promotion.find(filtro).populate("restaurantId");
}

async function actualizarPromocion(id, data) {
    if (data.fecha_inicio && data.fecha_fin) {
        if (new Date(data.fecha_fin) <= new Date(data.fecha_inicio)) {
            throw new Error("La fecha de fin debe ser mayor a la fecha de inicio");
        }
    }

    if (data.tipo_descuento === "porcentaje" && data.valor > 100) {
        throw new Error("El porcentaje de descuento no puede superar 100");
    }

    return await Promotion.findByIdAndUpdate(id, data, { new: true });
}

async function togglePromocion(id, activa) {
    if (typeof activa !== "boolean") {
        throw new Error("El campo activa debe ser true o false");
    }

    return await Promotion.findByIdAndUpdate(id, { activa }, { new: true });
}

// Función reutilizable para aplicar descuento a un total
// Se usará tanto desde promotions como desde pedidos
async function aplicarDescuento(promotionId, totalOriginal) {
    const ahora = new Date();

    const promocion = await Promotion.findById(promotionId);

    if (!promocion) {
        throw new Error("Promoción no encontrada");
    }

    if (!promocion.activa) {
        throw new Error("La promoción no está activa");
    }

    if (ahora < promocion.fecha_inicio || ahora > promocion.fecha_fin) {
        throw new Error("La promoción no está vigente en este momento");
    }

    let descuento = 0;
    let totalFinal = totalOriginal;

    if (promocion.tipo_descuento === "porcentaje") {
        descuento = (totalOriginal * promocion.valor) / 100;
    } else if (promocion.tipo_descuento === "monto_fijo") {
        descuento = promocion.valor;
    }

    // El total final nunca puede ser negativo
    totalFinal = Math.max(0, totalOriginal - descuento);

    return {
        promocion,
        totalOriginal,
        descuento: parseFloat(descuento.toFixed(2)),
        totalFinal: parseFloat(totalFinal.toFixed(2))
    };
}

async function eliminarPromocion(id) {
    return await Promotion.findByIdAndDelete(id);
}

module.exports = {
    crearPromocion,
    obtenerPromociones,
    obtenerPromocionPorId,
    obtenerPromocionesActivas,
    actualizarPromocion,
    togglePromocion,
    aplicarDescuento,
    eliminarPromocion
};