const env = require("./configs/env.js");

const fastify = require("fastify")({
    logger: true
});

//Conexión a la base de datos y configuración de Swagger
const connectDB = require("./configs/db.js");
const swaggerConfig = require("./configs/swagger.js");

const errorHandler = require("./utils/errorHandler");

const restauranteRoutes = require("./routes/restaurantes.js");
const menuRoutes = require("./routes/menus.js");
const tableRoutes = require("./routes/tables.js");
const reservationRoutes = require("./routes/reservations.js");
const orderRoutes = require("./routes/pedidos.js");
const eventRoutes = require("./routes/event.js");
const promotionRoutes = require("./routes/promotion.js");


fastify.register(require("@fastify/cors"), {
    origin: true
});

// Registro de rutas, manejo de errores y arranque del servidor
const startServer = async () => {
    try {
        await connectDB();
        await swaggerConfig(fastify);

        fastify.register(restauranteRoutes, { prefix: "/restaurantes" });
        fastify.register(menuRoutes, { prefix: "/menus" });
        fastify.register(tableRoutes, { prefix: "/tables" });
        fastify.register(reservationRoutes, { prefix: "/reservations" });
        fastify.register(orderRoutes, { prefix: "/orders" });
        fastify.register(eventRoutes, { prefix: "/api/events" });
        fastify.register(promotionRoutes, { prefix: "/api/promotions" });
        // Manejo global de errores
        fastify.setErrorHandler(errorHandler);

        await fastify.listen({ port: env.PORT });

        console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
        console.log(`Documentación disponible en http://localhost:${env.PORT}/docs`);

    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

startServer();