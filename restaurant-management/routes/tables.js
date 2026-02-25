const Table = require("../models/table");
const asyncHandler = require("../utils/asyncHandler");
const validarObjectId = require("../utils/objectIdValidator");
const { successResponse } = require("../utils/responseFormatter");

async function tableRoutes(fastify, options) {
    fastify.post("/", {
        schema: {
            body: {
                type: "object",
                required: ["restaurantId", "number", "capacity"],
                properties: {
                    restaurantId: { type: "string" },
                    number: { type: "number" },
                    capacity: { type: "number" },
                    location: { type: "string" },
                    isActive: { type: "boolean", default: true }
                }
            }
        }
    }, asyncHandler(async (request, reply) => {

        validarObjectId(request.body.restaurantId);

        const table = await Table.create(request.body);

        return reply.code(201).send(
            successResponse(table, "Mesa creada correctamente")
        );
    }));

    fastify.get("/", asyncHandler(async (request, reply) => {

        const { restaurantId } = request.query;

        let tables;

        if (restaurantId) {
            validarObjectId(restaurantId);
            tables = await Table.find({ restaurantId });
        } else {
            tables = await Table.find();
        }

        return reply.send(successResponse(tables));
    }));

    fastify.get("/:id", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const table = await Table.findById(request.params.id);

        if (!table) {
            return reply.code(404).send({
                success: false,
                message: "Mesa no encontrada"
            });
        }

        return reply.send(successResponse(table));
    }));

    fastify.put("/:id", {
        schema: {
            body: {
                type: "object",
                properties: {
                    number: { type: "number" },
                    capacity: { type: "number" },
                    location: { type: "string" },
                    isActive: { type: "boolean" }
                }
            }
        }
    }, asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const table = await Table.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        );

        if (!table) {
            return reply.code(404).send({
                success: false,
                message: "Mesa no encontrada"
            });
        }

        return reply.send(successResponse(table, "Mesa actualizada"));
    }));

    fastify.patch("/:id/estado", {
        schema: {
            body: {
                type: "object",
                required: ["isActive"],
                properties: {
                    isActive: { type: "boolean" }
                }
            }
        }
    }, asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const table = await Table.findByIdAndUpdate(
            request.params.id,
            { isActive: request.body.isActive },
            { new: true }
        );

        if (!table) {
            return reply.code(404).send({
                success: false,
                message: "Mesa no encontrada"
            });
        }

        return reply.send(
            successResponse(table, "Estado de mesa actualizado")
        );
    }));

    fastify.delete("/:id", asyncHandler(async (request, reply) => {

        validarObjectId(request.params.id);

        const table = await Table.findByIdAndDelete(request.params.id);

        if (!table) {
            return reply.code(404).send({
                success: false,
                message: "Mesa no encontrada"
            });
        }

        return reply.send(
            successResponse(null, "Mesa eliminada correctamente")
        );
    }));
}

module.exports = tableRoutes;