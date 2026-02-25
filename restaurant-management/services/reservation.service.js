const Reservation = require("../models/reservation");
const Table = require("../models/table");
const Restaurant = require("../models/restaurante");

async function crearReserva(data) {
  const {
    restaurantId,
    tableId,
    userId,
    reservationDate,
    startTime,
    endTime,
    people
  } = data;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurante no encontrado");
  }

  const table = await Table.findById(tableId);
  if (!table) {
    throw new Error("Mesa no encontrada");
  }

  if (!table.isActive) {
    throw new Error("La mesa no está disponible");
  }

  if (table.restaurantId.toString() !== restaurantId) {
    throw new Error("La mesa no pertenece a este restaurante");
  }

  if (people > table.capacity) {
    throw new Error("La cantidad de personas excede la capacidad de la mesa");
  }

  const existeSolapamiento = await Reservation.findOne({
    tableId,
    reservationDate: new Date(reservationDate),
    status: "confirmed",
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  if (existeSolapamiento) {
    throw new Error("El horario seleccionado no está disponible");
  }

  const reserva = new Reservation({
    restaurantId,
    tableId,
    userId,
    reservationDate,
    startTime,
    endTime,
    people,
    status: "confirmed"
  });

  return await reserva.save();
}

async function obtenerReservasPorRestaurante(restaurantId) {
  return await Reservation.find({ restaurantId }).sort({ reservationDate: 1 });
}

async function cancelarReserva(reservationId) {
  const reserva = await Reservation.findById(reservationId);

  if (!reserva) {
    throw new Error("Reserva no encontrada");
  }

  if (reserva.status === "completed") {
  throw new Error("No se puede cancelar una reserva completada");
}

  reserva.status = "cancelled";
  return await reserva.save();
}

module.exports = {
  crearReserva,
  obtenerReservasPorRestaurante,
  cancelarReserva
};