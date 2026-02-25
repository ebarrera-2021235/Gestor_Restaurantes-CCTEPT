const reservationService = require("../services/reservation.service");
const asyncHandler = require("../utils/asyncHandler");
const validarObjectId = require("../utils/objectIdValidator");
const { successResponse } = require("../utils/responseFormatter");

async function reservationRoutes(fastify, options) {

    fastify.post(
        "/",
        {
            schema: {
                body: {
                    type: "object",
                    required: [
                        "restaurantId",
                        "tableId",
                        "userId",
                        "reservationDate",
                        "startTime",
                        "endTime",
                        "people"
                    ],
                    properties: {
                        restaurantId: { type: "string" },
                        tableId: { type: "string" },
                        userId: { type: "string" },
                        reservationDate: { type: "string", format: "date" },
                        startTime: { type: "string" },
                        endTime: { type: "string" },
                        people: { type: "number" }
                    }
                }
            }
        },
        asyncHandler(async (request, reply) => {

            const reserva = await reservationService.crearReserva(request.body);

            return reply.code(201).send(
                successResponse(reserva, "Reserva creada correctamente")
            );
        })
    );


    fastify.get(
        "/",
        {
            schema: {
                querystring: {
                    type: "object",
                    required: ["restaurantId"],
                    properties: {
                        restaurantId: { type: "string" }
                    }
                }
            }
        },
        asyncHandler(async (request, reply) => {

            const { restaurantId } = request.query;

            validarObjectId(restaurantId);

            const reservas =
                await reservationService.obtenerReservasPorRestaurante(restaurantId);

            return reply.send(successResponse(reservas));
        })
    );


    fastify.patch(
        "/:id/cancel",
        {
            schema: {
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "string" }
                    }
                }
            }
        },
        asyncHandler(async (request, reply) => {

            validarObjectId(request.params.id);

            const reserva =
                await reservationService.cancelarReserva(request.params.id);

            return reply.send(
                successResponse(reserva, "Reserva cancelada correctamente")
            );
        })
    );
}

module.exports = reservationRoutes;