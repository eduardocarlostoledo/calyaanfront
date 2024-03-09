import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
//import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "./../../../../redux/features/ordenesSlice";
import "./Calendar.css";


const localizer = momentLocalizer(moment);
const MyCalendar = ({ reservations }) => {
  const events = reservations
    .map((reservation) => {
      if (
        !reservation.hora_servicio &&
        !reservation.cita_servicio &&
        // reservation.factura.estadoPago === "approved" &&
        !reservation.profesional_id
      ) {
        return null; // O maneja el caso de reserva sin hora de servicio de acuerdo a tus necesidades
      }

      const [start, end] = reservation?.hora_servicio?.split("-") || [];
      const startDate = moment(
        `${reservation.cita_servicio} ${start?.trim()}` || null,
        "YYYY-MM-DD HH:mm"
      );
      const endDate = moment(
        `${reservation.cita_servicio} ${end?.trim()}` || null,
        "YYYY-MM-DD HH:mm"
      );

      return {
        _id: reservation._id,
        nombre: reservation.cliente_id?.nombre,
        apellido: reservation.cliente_id?.apellido,
        servicio: reservation.servicios[0]?.nombre,
        profesional: reservation.profesional_id?.nombre,
        dia: reservation?.cita_servicio,
        start: startDate.toDate(),
        end: endDate.toDate(),
        estadoPago: reservation.factura?.estadoPago, // Agrega el estado de pago al objeto del evento
        direccion_servicio: reservation.direccion_servicio,
      };
    })
    .filter((event) => event !== null && event.estadoPago === "approved"); // Filtra eventos nulos y con estado de pago "approved"

   //console.log("events", events);
  return (
    <div style={{ height: "10000px" }}>
     <Calendar
  localizer={localizer}
  events={events.filter((event) => event !== null)} // Filtrar eventos nulos
  startAccessor="start"
  endAccessor="end"
  style={{ width: '25%', marginLeft: '250px' }}  // Set the width to 100%
  components={{
    event: EventComponent,
  }}
/>
    </div>
  );
};

const EventComponent = ({ event }) => {
  return (
    <div style={{ fontSize: "12px", overflow: null }}>
      <div>{event._id}</div>
      <div>{event.nombre} {""} {event.apellido}</div>
      <div>S: {event.servicio}</div>
      <div>P: {event.profesional}</div>
      <div>D: {event.direccion_servicio}</div>
    </div>
  );
};

const CalendarDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.ordenes.order || []);
  //console.log("reservations", reservations)

  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <MyCalendar reservations={reservations} />
      )}
    </div>
  );
};

export default CalendarDashboard;