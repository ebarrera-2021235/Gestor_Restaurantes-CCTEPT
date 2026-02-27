const Reservation = require("../models/reservation");
const Table = require("../models/table");
const Restaurant = require("../models/restaurante");
const validarObjectId = require("../utils/objectIdValidator");

function horaAMinutos(hora) {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  }

async function crearReserva(data) {
  validarObjectId(data.restaurantId);
  validarObjectId(data.tableId);
  const {
    restaurantId,
    tableId,
    userId,
    reservationDate,
    startTime,
    endTime,
    people
  } = data;

  if (!reservationDate || reservationDate.trim() === "") {
    const error = new Error("reservationDate es obligatorio y no puede estar vacío");
    error.statusCode = 400;
    throw error;
  }

  const fechaBase = new Date(reservationDate);
  if (isNaN(fechaBase.getTime())) {
    const error = new Error("reservationDate no es una fecha válida");
    error.statusCode = 400;
    throw error;
  }
  fechaBase.setHours(0, 0, 0, 0);
  
  if (!userId || userId.trim() === "") {
      const error = new Error("userId es obligatorio y no puede estar vacío");
      error.statusCode = 400;
      throw error;
  }

  const userIdRegex = /^[0-9a-fA-F]{16}$/;
  if (!userIdRegex.test(userId)) {
      const error = new Error("userId no válido");
      error.statusCode = 400;
      throw error;
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    const error = new Error("startTime/endTime deben tener formato HH:MM (24h)");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(people) || people < 1) {
    const error = new Error("people debe ser un entero mayor o igual a 1");
    error.statusCode = 400;
    throw error;
  }

  const nuevaInicio = horaAMinutos(startTime);
  const nuevaFin = horaAMinutos(endTime);

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurante no encontrado");
  }

  if (nuevaInicio >= nuevaFin) {
    throw new Error("La hora de fin debe ser mayor que la hora de inicio");
  }

  fechaBase.setHours(0,0,0,0);
  const dia = fechaBase.getDay(); 
  // 0 = domingo, 6 = sábado

  let apertura;
  let cierre;

  if (dia >= 1 && dia <= 5) {
    // Lunes a viernes
    apertura = "10:00";
    cierre = "20:00";
  } else {
    // Sábado y domingo
    apertura = "08:00";
    cierre = "22:00";
  }

  const hoy = new Date();
  hoy.setHours(0,0,0,0);

  if (fechaBase < hoy) {
    throw new Error("No se puede reservar en una fecha pasada");
  }

  const aperturaMin = horaAMinutos(apertura);
  const cierreMin = horaAMinutos(cierre);

  if (nuevaInicio < aperturaMin || nuevaFin > cierreMin) {
    throw new Error("La reserva está fuera del horario permitido para ese día");
  }

  const table = await Table.findById(tableId);
  if (!table) {
    throw new Error("Mesa no encontrada");
  }

  if (!table.isActive) {
    throw new Error("La mesa no está disponible");
  }

  if (table.restaurantId.toString() !== restaurantId.toString()) {
    throw new Error("La mesa no pertenece a este restaurante");
  }

  if (restaurant.estado !== "activo") {
    throw new Error("El restaurante no está disponible para reservas");
  }

  if (people > table.capacity) {
    throw new Error("La cantidad de personas excede la capacidad de la mesa");
  }

  const conflicto = await Reservation.findOne({
    tableId,
    reservationDate: fechaBase,
    status: "confirmed",
    $expr: {
      $and: [
        { $lt: [nuevaInicio, { $add: [{ $multiply: [{ $toInt: { $substr: ["$endTime", 0, 2] } }, 60] }, { $toInt: { $substr: ["$endTime", 3, 2] } }] }] },
        { $gt: [nuevaFin, { $add: [{ $multiply: [{ $toInt: { $substr: ["$startTime", 0, 2] } }, 60] }, { $toInt: { $substr: ["$startTime", 3, 2] } }] }] }
      ]
    }
  });

  if (conflicto) {
    throw new Error("El horario seleccionado no está disponible (concurrencia detectada)");
  }

  const reserva = new Reservation({
    restaurantId,
    tableId,
    userId,
    reservationDate: fechaBase,
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
  validarObjectId(reservationId);
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