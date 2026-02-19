const Menu = require("../models/menu.js");


async function crearMenu(data) {

	const existe = await Menu.findOne({ nombre: data.nombre });

	if (existe) {
		throw new Error("Ya existe un menú con ese nombre");
	}

	const menu = new Menu(data);
	return await menu.save();
}


async function obtenerMenus() {
	return await Menu.find({ disponible: true }).populate("restaurantes");
}


async function obtenerMenuPorId(id) {
	return await Menu.findById(id).populate("restaurantes");
}


async function obtenerMenusPorTipo(tipo) {
	return await Menu.find({ tipo, disponible: true }).populate("restaurantes");
}


async function obtenerMenusPorRestaurante(restauranteId) {
	return await Menu.find({
		restaurantes: restauranteId,
		disponible: true
	}).populate("restaurantes");
}


async function actualizarMenu(id, data) {

	if (data.nombre) {
		const existe = await Menu.findOne({ nombre: data.nombre });
		if (existe && existe._id.toString() !== id) {
			throw new Error("Ya existe un menú con ese nombre");
		}
	}

	return await Menu.findByIdAndUpdate(
		id,
		data,
		{ new: true }
	);
}


async function cambiarDisponibilidad(id, disponible) {

	if (typeof disponible !== "boolean") {
		throw new Error("Disponibilidad debe ser true o false");
	}

	return await Menu.findByIdAndUpdate(
		id,
		{ disponible },
		{ new: true }
	);
}


async function eliminarMenu(id) {
	return await Menu.findByIdAndDelete(id);
}

module.exports = {
	crearMenu,
	obtenerMenus,
	obtenerMenuPorId,
	obtenerMenusPorTipo,
	obtenerMenusPorRestaurante,
	actualizarMenu,
	cambiarDisponibilidad,
	eliminarMenu
};
