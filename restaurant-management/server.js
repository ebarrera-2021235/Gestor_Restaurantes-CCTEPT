const env = require("./configs/env.js");

const fastify = require("fastify")({
    logger: true
});

const connectDB = require("./configs/db.js");
const swaggerConfig = require("./configs/swagger.js");

const restauranteRoutes = require("./routes/restaurantes.js");
const menuRoutes = require("./routes/menus.js");

fastify.register(require("@fastify/cors"), {
    origin: true
});


const startServer = async () => {
    try {
        await connectDB();
        await swaggerConfig(fastify);
        fastify.register(restauranteRoutes, { prefix: "/restaurantes" });
        fastify.register(menuRoutes, { prefix: "/menus" });

        await fastify.listen({ port: env.PORT });
        
        console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
        console.log(`Documentación disponible en http://localhost:${env.PORT}/docs`);

        } catch (error) {
            fastify.log.error(error);
            process.exit(1);
    }
};

startServer();
