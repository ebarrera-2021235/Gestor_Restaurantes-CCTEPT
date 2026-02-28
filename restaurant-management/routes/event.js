const eventService = require("../services/event.service");
const asyncHandler = require("../utils/asyncHandler");
const validarObjectId = require("../utils/objectIdValidator");
const { successResponse } = require("../utils/responseFormatter");

async function eventRoutes(fastify, options) {

    // Crear evento
    fastify.post("/", asyncHandler(async (request, reply) => {

        const evento = await eventService.crearEvento(request.body);

        return reply.code(201).send(
            successResponse(evento, "Evento creado correctamente")
        );
    }));

    // Obtener todos los eventos
    fastify.get("/", asyncHandler(async (request, reply) => {

        const { restaurantId, activos } = request.query;

        let eventos;

        if (activos === "true") {
            eventos = await eventService.obtenerEventosActivos();
        } else if (restaurantId) {
            validarObjectId(restaurantId);
            eventos = await eventService.obtenerEventosPorRestaurante(restaurantId);
        } else {
            eventos = await eventService.obtenerEventos();
        }

        return reply.send(successResponse(eventos));
    }));

    // Obtener evento por ID
    fastify.get("/:id", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const evento = await eventService.obtenerEventoPorId(request.params.id);

        if (!evento) {
            throw new Error("Evento no encontrado");
        }

        return reply.send(successResponse(evento));
    }));

    // Actualizar evento
    fastify.put("/:id", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const evento = await eventService.actualizarEvento(
            request.params.id,
            request.body
        );

        if (!evento) {
            throw new Error("Evento no encontrado");
        }

        return reply.send(successResponse(evento, "Evento actualizado correctamente"));
    }));

    // Cambiar estado del evento
    fastify.patch("/:id/estado", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const { estado } = request.body;

        if (!estado) {
            throw new Error("El campo estado es requerido");
        }

        const evento = await eventService.cambiarEstadoEvento(
            request.params.id,
            estado
        );

        if (!evento) {
            throw new Error("Evento no encontrado");
        }

        return reply.send(successResponse(evento, "Estado actualizado correctamente"));
    }));

    // Reservar cupo en un evento
    fastify.patch("/:id/reservar", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const evento = await eventService.reservarCupo(request.params.id);

        return reply.send(successResponse(evento, "Cupo reservado correctamente"));
    }));

    // Liberar cupo de un evento
    fastify.patch("/:id/liberar", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const evento = await eventService.liberarCupo(request.params.id);

        return reply.send(successResponse(evento, "Cupo liberado correctamente"));
    }));

    // Eliminar evento
    fastify.delete("/:id", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const evento = await eventService.eliminarEvento(request.params.id);

        if (!evento) {
            throw new Error("Evento no encontrado");
        }

        return reply.send(successResponse(null, "Evento eliminado correctamente"));
    }));
}

module.exports = eventRoutes;