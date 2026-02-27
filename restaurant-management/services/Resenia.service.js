const Resenia = require("../models/Resenia.js");
const Pedidos = require("../models/Pedidos.js");
const Restaurante = require("../models/restaurante.js");

class ReseniaService {
  
  async crearResenia(data, userId) {
    const pedido = await Pedidos.findById(data.orderId); 
    
    if (!pedido) {
      throw new Error("El pedido no existe");
    }

    if (pedido.estado !== "completed") {
      throw new Error("Solo puedes calificar pedidos que ya han sido completados");
    }

    if (pedido.resena_realizada) {
      throw new Error("Este pedido ya tiene una resenia asociada");
    }

    const nuevaResenia = new Resenia({
      restaurantId: pedido.restaurantId,
      userId: userId,
      orderId: pedido._id,
      puntuacion: data.puntuacion,
      comentario: data.comentario
    });

    const resultado = await nuevaResenia.save();

    await Pedidos.findByIdAndUpdate(data.orderId, { resena_realizada: true });

    await this.actualizarMetricasRestaurante(pedido.restaurantId); 

    return resultado;
  }

  async actualizarMetricasRestaurante(restaurantId) {
    const stats = await Resenia.aggregate([
      { $match: { restaurantId: restaurantId } },
      { 
        $group: { 
          _id: '$restaurantId', 
          promedio: { $avg: '$puntuacion' }, 
          total: { $sum: 1 } 
        } 
      }
    ]);

    if (stats.length > 0) {
      await Restaurante.findByIdAndUpdate(restaurantId, {
        rating: stats[0].promedio.toFixed(1),
        numReviews: stats[0].total
      });
    }
  }

  async obtenerReseniasPorRestaurante(restaurantId) {
    return await Resenia.find({ restaurantId })
      .populate("userId", "nombre apellido")
      .sort({ fecha: -1 });
  }
}

module.exports = new ReseniaService();