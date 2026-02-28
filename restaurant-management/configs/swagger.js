async function swaggerConfig(fastify) {

await fastify.register(require("@fastify/swagger"), {
    openapi: {
        info: {
            title: "Savora | Gestion Restaurantes",
            description: "Servicio Empresarial Savora - Gestión de Restaurantes",
            version: "1.0.0"
        }
    }
});


await fastify.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "list",
        deepLinking: false
    }   
});

}

module.exports = swaggerConfig;
