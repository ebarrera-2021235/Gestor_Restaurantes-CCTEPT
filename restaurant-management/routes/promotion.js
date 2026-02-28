const promotionService = require("../services/promotion.service");
const asyncHandler = require("../utils/asyncHandler");
const validarObjectId = require("../utils/objectIdValidator");
const { successResponse } = require("../utils/responseFormatter");

async function promotionRoutes(fastify, options) {

    // Crear promoción
    fastify.post("/", asyncHandler(async (request, reply) => {

        const promocion = await promotionService.crearPromocion(request.body);

        return reply.code(201).send(
            successResponse(promocion, "Promoción creada correctamente")
        );
    }));

    // Obtener todas las promociones
    fastify.get("/", asyncHandler(async (request, reply) => {

        const { restaurantId, activas } = request.query;

        let promociones;

        if (activas === "true") {
            promociones = await promotionService.obtenerPromocionesActivas(restaurantId || null);
        } else {
            promociones = await promotionService.obtenerPromociones();
        }

        return reply.send(successResponse(promociones));
    }));

    // Obtener promoción por ID
    fastify.get("/:id", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const promocion = await promotionService.obtenerPromocionPorId(request.params.id);

        if (!promocion) {
            throw new Error("Promoción no encontrada");
        }

        return reply.send(successResponse(promocion));
    }));

    // Actualizar promoción
    fastify.put("/:id", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const promocion = await promotionService.actualizarPromocion(
            request.params.id,
            request.body
        );

        if (!promocion) {
            throw new Error("Promoción no encontrada");
        }

        return reply.send(successResponse(promocion, "Promoción actualizada correctamente"));
    }));

    // Activar o desactivar promoción
    fastify.patch("/:id/toggle", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const { activa } = request.body;

        if (activa === undefined) {
            throw new Error("El campo activa es requerido");
        }

        const promocion = await promotionService.togglePromocion(
            request.params.id,
            activa
        );

        if (!promocion) {
            throw new Error("Promoción no encontrada");
        }

        return reply.send(successResponse(promocion, "Promoción actualizada correctamente"));
    }));

    // Calcular descuento sobre un total dado
    fastify.post("/:id/aplicar", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const { totalOriginal } = request.body;

        if (!totalOriginal || totalOriginal <= 0) {
            throw new Error("El campo totalOriginal debe ser un número mayor a 0");
        }

        const resultado = await promotionService.aplicarDescuento(
            request.params.id,
            totalOriginal
        );

        return reply.send(successResponse(resultado, "Descuento calculado correctamente"));
    }));

    // Eliminar promoción
    fastify.delete("/:id", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const promocion = await promotionService.eliminarPromocion(request.params.id);

        if (!promocion) {
            throw new Error("Promoción no encontrada");
        }

        return reply.send(successResponse(null, "Promoción eliminada correctamente"));
    }));
}

module.exports = promotionRoutes;