const Restaurante = require("../models/restaurante.js");

async function crearRestaurante(data) {
    const existe = await Restaurante.findOne({ nombre: data.nombre });

    if (existe) {
        throw new Error("Ya existe un restaurante con este nombre.");
    }

    const restaurante = new Restaurante(data);
    return await restaurante.save();
}

async function obtenerRestaurantes() {
    return await Restaurante.find({ estado: "activo" });
}

async function obtenerRestaurantesPorId(id) {
    const restaurante = await Restaurante.findById(id);

    if (!restaurante) {
        return null;
    }

    return restaurante;
}

async function cambiarEstado(id, nuevoEstado) {
    if (!["activo", "inactivo"].includes(nuevoEstado)) {
        throw new Error("Estado inválido");
    }

    return await Restaurante.findByIdAndUpdate(
        id,
        { estado: nuevoEstado },
        { new: true }
    );
}

async function eliminarRestaurante(id) {
    return await Restaurante.findByIdAndUpdate(
        id,
        { estado: "inactivo" },
        { new: true }
    );
}

async function obtenerRestaurantesPorCategoria(categoria) {

    if (!categoria) {
        throw new Error("Debe proporcionar una categoría");
    }

    return await Restaurante.find({
        estado: "activo",
        categorias: categoria
    });
}

module.exports = {
    crearRestaurante,
    obtenerRestaurantes,
    obtenerRestaurantesPorId,
    cambiarEstado,
    eliminarRestaurante,
    obtenerRestaurantesPorCategoria
};