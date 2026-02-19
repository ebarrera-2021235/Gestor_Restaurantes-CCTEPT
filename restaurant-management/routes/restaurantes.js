const restauranteService = require("../services/restaurante.service");
const asyncHandler = require("../utils/asyncHandler");
const validarObjectId = require("../utils/objectIdValidator");
const { successResponse } = require("../utils/responseFormatter");

async function restauranteRoutes(fastify, options) {

	// ✅ Crear restaurante
	fastify.post("/", asyncHandler(async (request, reply) => {
		const restaurante = await restauranteService.crearRestaurante(request.body);
		return reply.code(201).send(
			successResponse(restaurante, "Restaurante creado correctamente")
		);
	}));


	// ✅ Obtener restaurantes (con filtro por categoría opcional)
	fastify.get("/", asyncHandler(async (request, reply) => {

		const { categoria } = request.query;

		const restaurantes = categoria
			? await restauranteService.obtenerRestaurantesPorCategoria(categoria)
			: await restauranteService.obtenerRestaurantes();

		return reply.send(successResponse(restaurantes));
	}));


	// ✅ Obtener restaurante por ID
	fastify.get("/:id", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const restaurante = await restauranteService.obtenerRestaurantePorId(request.params.id);

		if (!restaurante) {
			throw new Error("Restaurante no encontrado");
		}

		return reply.send(successResponse(restaurante));
	}));


	// ✅ Cambiar estado
	fastify.patch("/:id/estado", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const restaurante = await restauranteService.cambiarEstado(
			request.params.id,
			request.body.estado
		);

		if (!restaurante) {
			throw new Error("Restaurante no encontrado");
		}

		return reply.send(successResponse(restaurante, "Estado actualizado"));
	}));


	// ✅ Soft delete
	fastify.delete("/:id", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const restaurante = await restauranteService.eliminarRestaurante(request.params.id);

		if (!restaurante) {
			throw new Error("Restaurante no encontrado");
		}

		return reply.send(successResponse(null, "Restaurante desactivado correctamente"));
	}));

}

module.exports = restauranteRoutes;
