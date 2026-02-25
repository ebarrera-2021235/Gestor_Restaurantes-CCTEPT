const restauranteService = require("../services/restaurante.service");
const asyncHandler = require("../utils/asyncHandler");
const validarObjectId = require("../utils/objectIdValidator");
const { successResponse } = require("../utils/responseFormatter");

async function restauranteRoutes(fastify, options) {

	// Crear restaurante
	fastify.post("/", {
		schema: {
			body: {
				type: "object",
				required: ["nombre", "descripcion", "categorias", "horario", "contacto"],
				properties: {
					nombre: { type: "string" },
					descripcion: { type: "string" },
					categorias: {
						type: "array",
						items: { type: "string" }
					},
					horario: {
						type: "object",
						required: ["apertura", "cierre"],
						properties: {
							apertura: { type: "string" },
							cierre: { type: "string" }
						}
					},
					contacto: {
						type: "object",
						required: ["direccion", "email", "telefono"],
						properties: {
							direccion: { type: "string" },
							email: { type: "string" },
							telefono: { type: "string" }
						}
					},
					estado: {
						type: "string",
						enum: ["activo", "inactivo"],
						default: "activo"
					}
				}
			}
		}
	}, asyncHandler(async (request, reply) => {

		const restaurante = await restauranteService.crearRestaurante(request.body);

		return reply.code(201).send(
			successResponse(restaurante, "Restaurante creado correctamente")
		);
	}));


	// Obtener todos / por categoría
	fastify.get("/", asyncHandler(async (request, reply) => {

		const { categoria } = request.query;

		const restaurantes = categoria
			? await restauranteService.obtenerRestaurantesPorCategoria(categoria)
			: await restauranteService.obtenerRestaurantes();

		return reply.send(successResponse(restaurantes));
	}));


	// Obtener por ID
	fastify.get("/:id", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const restaurante = await restauranteService.obtenerRestaurantesPorId(request.params.id);

		if (!restaurante) {
			throw new Error("Restaurante no encontrado");
		}

		return reply.send(successResponse(restaurante));
	}));


	// Cambiar estado
	fastify.patch("/:id/estado", {
		schema: {
			body: {
				type: "object",
				required: ["estado"],
				properties: {
					estado: {
						type: "string",
						enum: ["activo", "inactivo"]
					}
				}
			}
		}
	}, asyncHandler(async (request, reply) => {

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


	// Eliminación lógica
	fastify.delete("/:id", asyncHandler(async (request, reply) => {

		validarObjectId(request.params.id);

		const restaurante = await restauranteService.eliminarRestaurante(request.params.id);

		if (!restaurante) {
			throw new Error("Restaurante no encontrado");
		}

		return reply.send(
			successResponse(null, "Restaurante desactivado correctamente")
		);
	}));

}

module.exports = restauranteRoutes;