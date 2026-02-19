async function swaggerConfig(fastify) {

await fastify.register(require("@fastify/swagger"), {
    openapi: {
        info: {
            title: "API Gestión de Restaurantes y Menús",
            description: "Servicio empresarial para gestión de restaurantes y menús",
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
