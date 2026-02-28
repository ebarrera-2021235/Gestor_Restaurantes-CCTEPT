const orderService = require("../services/pedido.service.js");
const asyncHandler = require("../utils/asyncHandler.js");
const validarObjectId = require("../utils/objectIdValidator.js");
const { successResponse } = require("../utils/responseFormatter.js");
const { ORDER_STATUS, ORDER_TYPE } = require("../models/Pedidos.js");


async function orderRoutes(fastify, options) {

    // POST /orders
    fastify.post(
        "/",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["restaurantId", "userId", "tipo_pedido", "items"],
                    properties: {

                        restaurantId: { type: "string" },

                        userId: {
                            type: "string",
                            minLength: 1
                        },

                        reservationId: { type: "string" },

                        tipo_pedido: {
                            type: "string",
                            enum: Object.values(ORDER_TYPE)
                        },

                        items: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                required: [
                                    "id_plato",
                                    "nombre_snapshot",
                                    "cantidad",
                                    "precio_unitario"
                                ],
                                properties: {

                                    id_plato: { type: "string" },

                                    nombre_snapshot: { type: "string" },

                                    cantidad: {
                                        type: "number",
                                        minimum: 1
                                    },

                                    precio_unitario: {
                                        type: "number",
                                        minimum: 0
                                    }

                                }
                            }
                        },

                        impuestos: {
                            type: "number",
                            minimum: 0,
                            default: 0
                        },

                        servicio: {
                            type: "number",
                            minimum: 0,
                            default: 0
                        }

                    }
                }
            }
        },

        asyncHandler(async (request, reply) => {

            validarObjectId(request.body.restaurantId);

            if (request.body.reservationId) {
                validarObjectId(request.body.reservationId);
            }

            request.body.items.forEach(item => {
                validarObjectId(item.id_plato);
            });

            const order = await orderService.createOrder(request.body);

            return reply.code(201).send(
                successResponse(order, "Pedido creado correctamente")
            );

        })
    );


    // GET /orders/restaurant/:id
    fastify.get(
        "/restaurant/:id",
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

            const orders = await orderService.getOrdersByRestaurant(
                request.params.id
            );

            return reply.send(
                successResponse(orders)
            );

        })
    );


    // PATCH /orders/:id/status
    fastify.patch(
        "/:id/status",
        {
            schema: {
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "string" }
                    }
                },

                body: {
                    type: "object",
                    required: ["estado"],
                    properties: {
                        estado: {
                            type: "string",
                            enum: Object.values(ORDER_STATUS)
                        }
                    }
                }
            }
        },

        asyncHandler(async (request, reply) => {

            validarObjectId(request.params.id);

            const order = await orderService.updateOrderStatus(
                request.params.id,
                request.body.estado
            );

            return reply.send(
                successResponse(order, "Estado actualizado correctamente")
            );

        })
    );


    // PATCH /orders/:id/promocion  ← NUEVO
    fastify.patch(
        "/:id/promocion",
        {
            schema: {
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "string" }
                    }
                },

                body: {
                    type: "object",
                    required: ["promotionId"],
                    properties: {
                        promotionId: { type: "string" }
                    }
                }
            }
        },

        asyncHandler(async (request, reply) => {

            validarObjectId(request.params.id);
            validarObjectId(request.body.promotionId);

            const order = await orderService.aplicarPromocionAPedido(
                request.params.id,
                request.body.promotionId
            );

            return reply.send(
                successResponse(order, "Promoción aplicada correctamente")
            );

        })
    );

}


module.exports = orderRoutes;