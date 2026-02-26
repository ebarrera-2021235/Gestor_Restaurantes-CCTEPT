module.exports = (error, request, reply) => {
    console.error(error); // log en consola

    // Enviar respuesta JSON
    reply.status(error.statusCode || 500).send({
        success: false,
        message: error.message || "Error interno del servidor",
    });
};