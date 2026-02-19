function errorHandler(error, reply) {

  // Error de Mongo duplicado
    if (error.code === 11000) {
        return reply.code(400).send({
            error: "Dato duplicado. Ya existe un registro con ese valor."
        });
    }

  // Error de validación de Mongoose
    if (error.name === "ValidationError") {
        return reply.code(400).send({
            error: Object.values(error.errors).map(e => e.message)
        });
    }

    return reply.code(500).send({
        error: error.message || "Error interno del servidor"
    });
}

module.exports = errorHandler;
