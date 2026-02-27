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
            reservationDate: { type: "string"},
            startTime: { type: "string" },
            endTime: { type: "string" },
            people: { type: "number" }
            }
        }
        }
    },
    async (request, reply) => {
        try {
            validarObjectId(request.body.restaurantId);
            validarObjectId(request.body.tableId);
            if (!request.body.userId || request.body.userId.trim() === "") {
                const error = new Error("userId es obligatorio y no puede estar vacío");
                error.statusCode = 400;
                throw error;
            }
            const reserva = await reservationService.crearReserva(request.body);
            return reply.code(201).send({
                success: true,
                message: "Reserva creada correctamente",
                data: reserva
            });
        } catch (err) {
            return reply.code(err.statusCode || 400).send({
                success: false,
                message: err.message || "Error al crear la reserva"
            });
        }
    }
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
            try {
                validarObjectId(request.query.restaurantId);

                const reservas = await reservationService.obtenerReservasPorRestaurante(request.query.restaurantId);
                return reply.send(successResponse(reservas));
            } catch (err) {
                return reply.code(err.statusCode || 400).send({
                success: false,
                message: err.message
                });
            }
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
            try {
                validarObjectId(request.params.id);

                const reserva = await reservationService.cancelarReserva(request.params.id);

                return reply.send(successResponse(reserva, "Reserva cancelada correctamente"));
            } catch (err) {
                return reply.code(err.statusCode || 400).send({
                success: false,
                message: err.message
                });
            }
        })
    );
}

module.exports = reservationRoutes;