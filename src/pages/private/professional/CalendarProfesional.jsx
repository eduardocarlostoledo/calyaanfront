import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import clienteAxios from "../../../config/axios";

const localizer = momentLocalizer(moment);
const MyCalendar = ({ reservations }) => {

  const events = reservations
    .map((reservation) => {
      if (
        !reservation.hora_servicio &&
        !reservation.cita_servicio &&
        reservation.factura.estadoPago === "approved"
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
        cliente: reservation.cliente_id?.nombre,
        servicio: reservation.servicios[0]?.nombre,
        dia: reservation?.cita_servicio,
        start: startDate.toDate(),
        end: endDate.toDate(),
        estadoPago: reservation.factura?.estadoPago, // Agrega el estado de pago al objeto del evento
      };
    })
    .filter((event) => event !== null && event.estadoPago === "approved"); // Filtra eventos nulos y con estado de pago "approved"

  // console.log("events", events);
  return (
    <div style={{ height: "1000px" }}>
      <h1>CLICK EN AGENDA PARA VER RESERVAS</h1>
      <Calendar
        localizer={localizer}
        events={events.filter((event) => event !== null)} // Filtrar eventos nulos
        startAccessor="start"
        endAccessor="end"
        style={{ margin: "50px" }}
        components={{
          event: EventComponent,
        }}
      />
    </div>
  );
};

const EventComponent = ({ event }) => {
  return (
    <div>
      <div>ID: {event._id}</div>
      <div>Cliente: {event.cliente}</div>
      <div>Servicio: {event.servicio}</div>
    </div>
  );
};

const CalendarioProfesional = () => {
  const [reservations, setReservations] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        // Comienza la carga de datos, estableciendo el estado "cargando" a true
        setCargando(true);

        const { data } = await clienteAxios.get(
          `api/profesional/historial/${user.profesionalId}`
        );

        // Actualiza el estado con las reservas obtenidas y finaliza la carga
        setReservations(data);
        setCargando(false);
      } catch (err) {
        console.log(err);
        const error =
          err.response?.data.msg || "Estamos experimentando problemas internos";
        setError(error);
        toast.error(error);
        setCargando(false); // Asegúrate de establecer "cargando" a false en caso de error
      }
    };
    obtenerReservas();
  }, [user.profesionalId]);



  return (
    <div>
      {cargando ? ( // Verifica el estado "cargando" para mostrar "Cargando..." o el calendario
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <MyCalendar reservations={reservations} />
      )}
    </div>
  );
};

export default CalendarioProfesional;

// const CalendarioProfesional = () => {
//   const [reservations, setReservations] = useState([]);
//   const [cargando, setCargando] = useState(true);  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => ({ ...state.auth }));

//   useEffect(() => {
//     const obtenerReservas = async () => {
//       try {
//         setCargando(true);

//         const { data } = await clienteAxios.get(
//           `api/profesional/historial/${user.profesionalId}`
//         );
//         setReservations(data);

//         setCargando(false);

//       } catch (err) {
//         console.log(err);
//         const error =
//           err.response?.data.msg || "Estamos experimentando problemas internos";
//         setError(error);
//         toast.error(error);
//         setCargando(false);
//       }
//     };
//     obtenerReservas();
//   }, [user.profesionalId]);

// console.log(reservations,"PROFESIONAL RESERVAS")

//   return (
//     <div>
//       {loading ? (
//         <div>Cargando...</div>
//       ) : error ? (
//         <div>Error: {error}</div>
//       ) : (
//         <MyCalendar reservations={reservations} />
//       )}
//     </div>
//   );
// };

// export default CalendarioProfesional;

/*
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import clienteAxios from "../../../config/axios";

const localizer = momentLocalizer(moment);

const Evento = ({ evento }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showContent && (
        <div>
      <div>ID: {evento?.id}</div>
      <div>Cliente: {evento?.cliente}</div>
      <div>Servicio: {evento?.servicio}</div>
      
    </div>
      )}
    </div>
  );
};

const CalendarioProfesional = () => {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        setCargando(true);

        const { data } = await clienteAxios.get(
          `api/profesional/historial/${user.profesionalId}`
        );
        setReservas(data);
        setCargando(false);
      } catch (err) {
        console.log(err);
        const error =
          err.response?.data.msg || "Estamos experimentando problemas internos";
        setError(error);
        toast.error(error);
        setCargando(false);
      }
    };
    obtenerReservas();
  }, [user.profesionalId]);

console.log(reservas,"PROFESIONAL RESERVAS")

  const eventos = reservas
    .map((reserva) => {
      if (
        !reserva.hora_servicio &&
        !reserva.cita_servicio &&
        !reserva._id &&
        reserva.factura.estadoPago !== "approved"
      ) {
        return null;
      }

      const [start, end] = reserva?.hora_servicio?.split("-") || [];
      const startDate = moment(
        `${reserva.cita_servicio} ${start?.trim()}` || null,
        "YYYY-MM-DD HH:mm"
      );
      const endDate = moment(
        `${reserva.cita_servicio} ${end?.trim()}` || null,
        "YYYY-MM-DD HH:mm"
      );

      return {
        id: reserva._id,
        cliente: reserva.cliente_id?.nombre,
        servicio: reserva.servicios[0]?.nombre,
        dia: reserva?.cita_servicio,
        start: startDate.toDate(),
        end: endDate.toDate(),
        estadoPago: reserva.factura?.estadoPago, // Agrega el estado de pago al objeto del evento
      };
    })
    .filter((evento) => evento !== null && evento.estadoPago === "approved");

  // console.log("eventos", eventos);

  return (
    <div>
      {cargando ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div style={{ height: "1000px" }}>
          {eventos && eventos.length > 0 ? (
            <Calendar
              localizer={localizer}
              events={eventos.filter((event) => event !== null)} // Filtrar eventos nulos
              startAccessor="start"
              endAccessor="end"
              style={{ margin: "50px" }}
              components={{
                event: Evento,
              }}
            />
          ) : (
            <div>No hay eventos disponibles</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarioProfesional;

*/

// import React from "react";
// import { useState } from "react";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import clienteAxios from "../../../config/axios";
// import { Link } from "react-router-dom";
// import {
//   add,
//   eachDayOfInterval,
//   endOfMonth,
//   format,
//   getDay,
//   isEqual,
//   isSameDay,
//   isSameMonth,
//   isToday,
//   parse,
//   parseISO,
//   startOfToday,
// } from "date-fns";
// import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

// const Calendar = () => {

//   const [historial, setHistorial] = useState([]);

//   const { user } = useSelector((state) => ({ ...state.auth }));

//   useEffect(() => {
//     const getHistorial = async () => {
//       try {

//         let { data } = await clienteAxios.get(
//           `api/profesional/historial/${user.profesionalId}`
//         );
//         setHistorial(data);

//       } catch (err) {
//         console.log(err);
//         let error = err.response.data.msg
//           ? err.response.data.msg
//           : err.response && "Estamos presentando problemas internos";
//         return toast.error(error);
//       }
//     };
//     getHistorial();
//   }, []);

//   const meetings = historial.map((item, index) => {
//     return {
//       id: index + 1,
//       name: `${item.cliente_nombre} ${item.cliente_apellido}`,
//       imageUrl: item.servicio_img,
//       startDatetime: `${item.cita_servicio}T${item.hora_servicio.split("-")[0]}`,
//       endDatetime: `${item.cita_servicio}T${item.hora_servicio.split("-")[1]}`,
//     };
//   });

//   console.log(meetings);

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

//   let today = startOfToday();
//   let [selectedDay, setSelectedDay] = useState(today);
//   let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
//   let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

//   let days = eachDayOfInterval({
//     start: firstDayCurrentMonth,
//     end: endOfMonth(firstDayCurrentMonth),
//   });

//   function previousMonth() {
//     let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
//     setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
//   }

//   function nextMonth() {
//     let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
//     setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
//   }

//   let selectedDayMeetings = meetings.filter((meeting) =>
//     isSameDay(parseISO(meeting.startDatetime), selectedDay)
//   );

//   return (
//     <div className="flex items-center justify-center mt-5">
//       <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//         <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
//           <div className="mb-4">
//             <p className="font-medium text-xl mb-2">Calendario</p>
//             <p className="text-gray-600 leading-loose">
//               Podrás visualizar todos los servicios pendientes que tengas por
//               días.
//             </p>
//           </div>

//           <div className="lg:col-span-2">
//             <div className="flex items-center justify-between mb-4">
//               <h5 className="text-xl font-medium leading-none mb-2">
//                 Calendario con todos tus servicos pendientes
//               </h5>
//             </div>

//             <div className="flex items-center ">

//                   <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
//                     <div className="md:pr-14">
//                       <div className="flex items-center">
//                         <h2 className="flex-auto font-semibold text-gray-900">
//                           {format(firstDayCurrentMonth, "MMMM yyyy")}
//                         </h2>
//                         <button
//                           type="button"
//                           onClick={previousMonth}
//                           className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
//                         >
//                           <span className="sr-only">Previous month</span>
//                           <AiFillCaretLeft
//                             className="w-5 h-5"
//                             aria-hidden="true"
//                           />
//                         </button>
//                         <button
//                           onClick={nextMonth}
//                           type="button"
//                           className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
//                         >
//                           <span className="sr-only">Next month</span>
//                           <AiFillCaretRight
//                             className="w-5 h-5"
//                             aria-hidden="true"
//                           />
//                         </button>
//                       </div>
//                       <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
//                         <div>S</div>
//                         <div>M</div>
//                         <div>T</div>
//                         <div>W</div>
//                         <div>T</div>
//                         <div>F</div>
//                         <div>S</div>
//                       </div>
//                       <div className="grid grid-cols-7 mt-2 text-sm">
//                         {days.map((day, dayIdx) => (
//                           <div
//                             key={day.toString()}
//                             className={classNames(
//                               dayIdx === 0 && colStartClasses[getDay(day)],
//                               "py-1.5"
//                             )}
//                           >
//                             <button
//                               type="button"
//                               onClick={() => setSelectedDay(day)}
//                               className={classNames(
//                                 isEqual(day, selectedDay) && "text-white",
//                                 !isEqual(day, selectedDay) &&
//                                   isToday(day) &&
//                                   "text-red-500",
//                                 !isEqual(day, selectedDay) &&
//                                   !isToday(day) &&
//                                   isSameMonth(day, firstDayCurrentMonth) &&
//                                   "text-gray-900",
//                                 !isEqual(day, selectedDay) &&
//                                   !isToday(day) &&
//                                   !isSameMonth(day, firstDayCurrentMonth) &&
//                                   "text-gray-400",
//                                 isEqual(day, selectedDay) &&
//                                   isToday(day) &&
//                                   "bg-red-500",
//                                 isEqual(day, selectedDay) &&
//                                   !isToday(day) &&
//                                   "bg-gray-900",
//                                 !isEqual(day, selectedDay) &&
//                                   "hover:bg-gray-200",
//                                 (isEqual(day, selectedDay) || isToday(day)) &&
//                                   "font-semibold",
//                                 "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
//                               )}
//                             >
//                               <time dateTime={format(day, "yyyy-MM-dd")}>
//                                 {format(day, "d")}
//                               </time>
//                             </button>

//                             <div className="w-1 h-1 mx-auto mt-1">
//                               {meetings.some((meeting) =>
//                                 isSameDay(parseISO(meeting.startDatetime), day)
//                               ) && (
//                                 <div className="w-1 h-1 rounded-full bg-sky-500"></div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <section className="mt-12 md:mt-0 md:pl-14">
//                       <h2 className="font-semibold text-gray-900">
//                         Agenda para{" "}
//                         <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
//                           {format(selectedDay, "MMM dd, yyy")}
//                         </time>
//                       </h2>
//                       <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
//                         {selectedDayMeetings.length > 0 ? (
//                           selectedDayMeetings.map((meeting) => (
//                             <></>
//                             //<Meeting meeting={meeting} key={meeting.id} />
//                           ))
//                         ) : (
//                           <p>No meetings for today.</p>
//                         )}
//                       </ol>
//                     </section>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//   );
// };

// export default Calendar;

// let colStartClasses = [
//   "",
//   "col-start-2",
//   "col-start-3",
//   "col-start-4",
//   "col-start-5",
//   "col-start-6",
//   "col-start-7",
// ];

// import React from "react";

// import {
//   add,
//   eachDayOfInterval,
//   endOfMonth,
//   format,
//   getDay,
//   isEqual,
//   isSameDay,
//   isSameMonth,
//   isToday,
//   parse,
//   parseISO,
//   startOfToday,
// } from "date-fns";
// import { Fragment, useState } from "react";
// import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

// const meetings = [
//   {
//     id: 1,
//     name: "Leslie Alexander",
//     imageUrl:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-05-11T13:00",
//     endDatetime: "2022-05-11T14:30",
//   },
//   {
//     id: 2,
//     name: "Michael Foster",
//     imageUrl:
//       "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-05-20T09:00",
//     endDatetime: "2022-05-20T11:30",
//   },
//   {
//     id: 3,
//     name: "Dries Vincent",
//     imageUrl:
//       "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-05-20T17:00",
//     endDatetime: "2022-05-20T18:30",
//   },
//   {
//     id: 4,
//     name: "Leslie Alexander",
//     imageUrl:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-06-09T13:00",
//     endDatetime: "2022-06-09T14:30",
//   },
//   {
//     id: 5,
//     name: "Michael Foster",
//     imageUrl:
//       "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-05-13T14:00",
//     endDatetime: "2022-05-13T14:30",
//   },
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const Calendar = () => {
//   let today = startOfToday();
//   let [selectedDay, setSelectedDay] = useState(today);
//   let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
//   let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

//   let days = eachDayOfInterval({
//     start: firstDayCurrentMonth,
//     end: endOfMonth(firstDayCurrentMonth),
//   });

//   function previousMonth() {
//     let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
//     setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
//   }

//   function nextMonth() {
//     let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
//     setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
//   }

//   let selectedDayMeetings = meetings.filter((meeting) =>
//     isSameDay(parseISO(meeting.startDatetime), selectedDay)
//   );

//   return (
//     <div className="flex items-center justify-center mt-5">
//       <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//         <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
//           <div className="mb-4">
//             <p className="font-medium text-xl mb-2">Calendario</p>
//             <p className="text-gray-600 leading-loose">
//               Podrás visualizar todos los servicios pendientes que tengas por
//               días.
//             </p>
//           </div>

//           <div className="lg:col-span-2">
//             <div className="flex items-center justify-between mb-4">
//               <h5 className="text-xl font-medium leading-none mb-2">
//                 Calendario con todos tus servicos pendientes
//               </h5>
//             </div>

//             <div className="flex items-center ">

//                   <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
//                     <div className="md:pr-14">
//                       <div className="flex items-center">
//                         <h2 className="flex-auto font-semibold text-gray-900">
//                           {format(firstDayCurrentMonth, "MMMM yyyy")}
//                         </h2>
//                         <button
//                           type="button"
//                           onClick={previousMonth}
//                           className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
//                         >
//                           <span className="sr-only">Previous month</span>
//                           <AiFillCaretLeft
//                             className="w-5 h-5"
//                             aria-hidden="true"
//                           />
//                         </button>
//                         <button
//                           onClick={nextMonth}
//                           type="button"
//                           className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
//                         >
//                           <span className="sr-only">Next month</span>
//                           <AiFillCaretRight
//                             className="w-5 h-5"
//                             aria-hidden="true"
//                           />
//                         </button>
//                       </div>
//                       <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
//                         <div>S</div>
//                         <div>M</div>
//                         <div>T</div>
//                         <div>W</div>
//                         <div>T</div>
//                         <div>F</div>
//                         <div>S</div>
//                       </div>
//                       <div className="grid grid-cols-7 mt-2 text-sm">
//                         {days.map((day, dayIdx) => (
//                           <div
//                             key={day.toString()}
//                             className={classNames(
//                               dayIdx === 0 && colStartClasses[getDay(day)],
//                               "py-1.5"
//                             )}
//                           >
//                             <button
//                               type="button"
//                               onClick={() => setSelectedDay(day)}
//                               className={classNames(
//                                 isEqual(day, selectedDay) && "text-white",
//                                 !isEqual(day, selectedDay) &&
//                                   isToday(day) &&
//                                   "text-red-500",
//                                 !isEqual(day, selectedDay) &&
//                                   !isToday(day) &&
//                                   isSameMonth(day, firstDayCurrentMonth) &&
//                                   "text-gray-900",
//                                 !isEqual(day, selectedDay) &&
//                                   !isToday(day) &&
//                                   !isSameMonth(day, firstDayCurrentMonth) &&
//                                   "text-gray-400",
//                                 isEqual(day, selectedDay) &&
//                                   isToday(day) &&
//                                   "bg-red-500",
//                                 isEqual(day, selectedDay) &&
//                                   !isToday(day) &&
//                                   "bg-gray-900",
//                                 !isEqual(day, selectedDay) &&
//                                   "hover:bg-gray-200",
//                                 (isEqual(day, selectedDay) || isToday(day)) &&
//                                   "font-semibold",
//                                 "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
//                               )}
//                             >
//                               <time dateTime={format(day, "yyyy-MM-dd")}>
//                                 {format(day, "d")}
//                               </time>
//                             </button>

//                             <div className="w-1 h-1 mx-auto mt-1">
//                               {meetings.some((meeting) =>
//                                 isSameDay(parseISO(meeting.startDatetime), day)
//                               ) && (
//                                 <div className="w-1 h-1 rounded-full bg-sky-500"></div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <section className="mt-12 md:mt-0 md:pl-14">
//                       <h2 className="font-semibold text-gray-900">
//                         Agenda para{" "}
//                         <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
//                           {format(selectedDay, "MMM dd, yyy")}
//                         </time>
//                       </h2>
//                       <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
//                         {selectedDayMeetings.length > 0 ? (
//                           selectedDayMeetings.map((meeting) => (
//                             <></>
//                             //<Meeting meeting={meeting} key={meeting.id} />
//                           ))
//                         ) : (
//                           <p>No meetings for today.</p>
//                         )}
//                       </ol>
//                     </section>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//   );
// };

// export default Calendar;

// let colStartClasses = [
//   "",
//   "col-start-2",
//   "col-start-3",
//   "col-start-4",
//   "col-start-5",
//   "col-start-6",
//   "col-start-7",
// ];
