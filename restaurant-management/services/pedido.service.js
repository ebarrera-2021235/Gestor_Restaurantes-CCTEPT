const { Order } = require("../models/Pedidos.js");



exports.createOrder = async (data) => {

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