const Order = require("../models/Pedidos.js");
const Menu = require("../models/menu.js");
const Reservation = require("../models/reservation.js");


exports.createOrder = async (data) => {

    // validar items
    for (const item of data.items) {

        const menuItem = await Menu.findById(item.id_plato);

        if (!menuItem) {

            const error = new Error("Ítem no existe");
            error.statusCode = 404;
            throw error;

        }

        if (menuItem.restaurantId.toString() !== data.restaurantId) {

            const error = new Error(
                `El plato ${menuItem._id} no pertenece al restaurante`
            );

            error.statusCode = 400;
            throw error;
        }
    }


    // validar reserva
    if (data.reservationId) {

        const reservation = await Reservation.findById(data.reservationId);

        if (!reservation) {

            const error = new Error("Reserva no existe");
            error.statusCode = 404;
            throw error;

        }

        if (reservation.restaurantId.toString() !== data.restaurantId) {

            const error = new Error("La reserva no pertenece al restaurante");
            error.statusCode = 400;
            throw error;
        }

        if (reservation.userId !== data.userId) {

            const error = new Error("La reserva no pertenece al usuario");
            error.statusCode = 403;
            throw error;
        }

    }


    const order = new Order(data);

    return await order.save();

};



exports.getOrdersByRestaurant = async (restaurantId) => {

    return await Order.find({ restaurantId })
        .sort({ createdAt: -1 });

};



exports.updateOrderStatus = async (orderId, estado) => {

    const order = await Order.findById(orderId);

    if (!order) {

        const error = new Error("Pedido no encontrado");
        error.statusCode = 404;
        throw error;

    }

    order.estado = estado;

    return await order.save();

};