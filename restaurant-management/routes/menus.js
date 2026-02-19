const menuService = require("../services/menu.service");
const asyncHandler = require("../utils/asyncHandler");
const validarObjectId = require("../utils/objectIdValidator");
const { successResponse } = require("../utils/responseFormatter");

async function menuRoutes(fastify, options) {

	fastify.post("/", asyncHandler(async (request, reply) => {

		const menu = await menuService.crearMenu(request.body);

		return reply.code(201).send(
			successResponse(menu, "Menú creado correctamente")
		);
	}));


	fastify.get("/", asyncHandler(async (request, reply) => {

		const { tipo, restaurante } = request.query;

		let menus;

		if (tipo) {
			menus = await menuService.obtenerMenusPorTipo(tipo);
		} else if (restaurante) {
			menus = await menuService.obtenerMenusPorRestaurante(restaurante);
		} else {
			menus = await menuService.obtenerMenus();
		}

		return reply.send(successResponse(menus));
	}));


	fastify.get("/:id", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const menu = await menuService.obtenerMenuPorId(request.params.id);

		if (!menu) {
			throw new Error("Menú no encontrado");
		}

		return reply.send(successResponse(menu));
	}));


	fastify.put("/:id", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const menu = await menuService.actualizarMenu(
			request.params.id,
			request.body
		);

		if (!menu) {
			throw new Error("Menú no encontrado");
		}

		return reply.send(successResponse(menu, "Menú actualizado"));
	}));


	fastify.patch("/:id/disponibilidad", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const menu = await menuService.cambiarDisponibilidad(
			request.params.id,
			request.body.disponible
		);

		if (!menu) {
			throw new Error("Menú no encontrado");
		}

		return reply.send(successResponse(menu, "Disponibilidad actualizada"));
	}));


	fastify.delete("/:id", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const menu = await menuService.eliminarMenu(request.params.id);

		if (!menu) {
			throw new Error("Menú no encontrado");
		}

		return reply.send(successResponse(null, "Menú eliminado correctamente"));
	}));

}

module.exports = menuRoutes;
