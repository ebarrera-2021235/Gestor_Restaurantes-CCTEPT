const Event = require("../models/event.js");

async function crearEvento(data) {
    const ahora = new Date();

    if (new Date(data.fecha_inicio) < ahora) {
        throw new Error("La fecha de inicio no puede ser en el pasado");
    }

    if (new Date(data.fecha_fin) <= new Date(data.fecha_inicio)) {
        throw new Error("La fecha de fin debe ser mayor a la fecha de inicio");
    }

    // Los cupos disponibles inician igual al cupo máximo
    data.cupos_disponibles = data.cupo_maximo;

    const evento = new Event(data);
    return await evento.save();
}

async function obtenerEventos() {
    return await Event.find().populate("restaurantId");
}

async function obtenerEventoPorId(id) {
    return await Event.findById(id).populate("restaurantId");
}

async function obtenerEventosPorRestaurante(restaurantId) {
    return await Event.find({ restaurantId }).populate("restaurantId");
}

async function obtenerEventosActivos() {
    const ahora = new Date();
    return await Event.find({
        estado: "activo",
        fecha_inicio: { $lte: ahora },
        fecha_fin: { $gte: ahora }
    }).populate("restaurantId");
}

async function actualizarEvento(id, data) {
    // No permitir modificar cupos_disponibles directamente
    delete data.cupos_disponibles;

    if (data.fecha_inicio && data.fecha_fin) {
        if (new Date(data.fecha_fin) <= new Date(data.fecha_inicio)) {
            throw new Error("La fecha de fin debe ser mayor a la fecha de inicio");
        }
    }

    return await Event.findByIdAndUpdate(id, data, { new: true });
}

async function cambiarEstadoEvento(id, estado) {
    const estadosValidos = ["activo", "inactivo", "vencido", "agotado"];

    if (!estadosValidos.includes(estado)) {
        throw new Error(`Estado inválido. Los estados válidos son: ${estadosValidos.join(", ")}`);
    }

    return await Event.findByIdAndUpdate(id, { estado }, { new: true });
}

async function reservarCupo(id) {
    const evento = await Event.findById(id);

    if (!evento) {
        throw new Error("Evento no encontrado");
    }

    if (evento.estado !== "activo") {
        throw new Error("El evento no está activo");
    }

    const ahora = new Date();
    if (evento.fecha_fin < ahora) {
        // Marcar automáticamente como vencido
        await Event.findByIdAndUpdate(id, { estado: "vencido" });
        throw new Error("El evento ya ha vencido");
    }

    if (evento.cupos_disponibles <= 0) {
        await Event.findByIdAndUpdate(id, { estado: "agotado" });
        throw new Error("No hay cupos disponibles para este evento");
    }

    return await Event.findByIdAndUpdate(
        id,
        { $inc: { cupos_disponibles: -1 } },
        { new: true }
    );
}

async function liberarCupo(id) {
    const evento = await Event.findById(id);

    if (!evento) {
        throw new Error("Evento no encontrado");
    }

    if (evento.cupos_disponibles >= evento.cupo_maximo) {
        throw new Error("Los cupos disponibles ya están en el máximo");
    }

    return await Event.findByIdAndUpdate(
        id,
        { $inc: { cupos_disponibles: 1 } },
        { new: true }
    );
}

async function eliminarEvento(id) {
    return await Event.findByIdAndDelete(id);
}

module.exports = {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId,
    obtenerEventosPorRestaurante,
    obtenerEventosActivos,
    actualizarEvento,
    cambiarEstadoEvento,
    reservarCupo,
    liberarCupo,
    eliminarEvento
};