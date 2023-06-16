import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from './../../../../redux/features/ordenesSlice';

const localizer = momentLocalizer(moment);
const MyCalendar = ({ reservations }) => {
  const events = reservations.map((reservation) => {
    if (!reservation.hora_servicio && !reservation.dia_servicio && reservation.estadoPago === "approved") {
      return null; // O maneja el caso de reserva sin hora de servicio de acuerdo a tus necesidades
    }
  
    const [start, end] = reservation?.hora_servicio?.split("-") || [];
    const startDate = moment(`${reservation.dia_servicio} ${start?.trim()}` || null, "YYYY-MM-DD HH:mm");
    const endDate = moment(`${reservation.dia_servicio} ${end?.trim()}` || null, "YYYY-MM-DD HH:mm");
  
    return {
      servicio: reservation.servicio,
      profesional: reservation.profesional_nombre,
      dia: reservation.dia_servicio,
      start: startDate.toDate(),
      end: endDate.toDate(),
      estadoPago: reservation.estadoPago, // Agrega el estado de pago al objeto del evento
    };
  }).filter((event) => event !== null && event.estadoPago === "approved"); // Filtra eventos nulos y con estado de pago "approved"
  

  console.log("events", events);
  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events.filter((event) => event !== null )} // Filtrar eventos nulos
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '100px' }}
        components={{
          event: EventComponent
        }}
      />
    </div>
  );
};

const EventComponent = ({ event }) => {
  return (
    <div>
      <div>Servicio: {event.servicio}</div>
      <div>Profesional: {event.profesional}</div>
    </div>
  );
};



const CalendarDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const dispatch = useDispatch();
  const reservations =  useSelector((state) => state.ordenes.order || []);
console.log("reservations", reservations)
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

// import React, { useEffect } from "react";

// function CalendarDashboard() {
//   useEffect(() => {
//     const allArrivalBtns_calendar_9 = document.querySelectorAll(
//       ".arrival-btn_calendar_9"
//     );
//     allArrivalBtns_calendar_9.forEach((e) => {
//       e.addEventListener("click", () => {
//         allArrivalBtns_calendar_9.forEach((y) => {
//           if (y.classList.contains("active") && y != e) {
//             y.classList.toggle("text-gray-600");
//             y.classList.toggle("bg-indigo-50");
//             y.classList.toggle("active");
//             y.classList.toggle("bg-gray-50");
//             y.classList.toggle("text-indigo-700");
//           }
//         });
//         if (!e.classList.contains("active")) {
//           e.classList.add("text-indigo-700");
//           e.classList.add("bg-indigo-50");
//           e.classList.add("bg-gray-50");
//           e.classList.remove("text-gray-600");
//           e.classList.remove("bg-gray-50");
//           e.classList.add("active");
//         }
//       });
//     });
//   });
//   return (
//     <>
//       <div className="w-full px-4 py-2 mx-auto">
//         <div className="hidden lg:block">
//           <div className="flex items-center justify-between px-4 py-4 mb-6 bg-white md:px-6 md:mb-0 gap-x-3">
//             <div className="flex items-center gap-x-24">
//               <p className="text-sm font-semibold leading-none text-gray-800 md:text-base">
//                 10 Abril 2023 , Lunes
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col bg-white border-t border-b lg:flex-row">
//           <div className="flex flex-col pb-0 bg-white border-r md:pb-6 lg:pb-0 lg:flex-col md:justify-between lg:justify-start gap-x-2 lg:items-start md:items-center">
//             <div className="w-full p-5 rounded-t md:p-6">
//               <div className="flex items-center justify-between">
//                 <span
//                   tabIndex={0}
//                   className="text-sm font-semibold text-gray-800 focus:outline-none"
//                 >
//                   Abril 2023
//                 </span>
//                 <div className="flex items-center">
//                   <button
//                     aria-label="calendar backward"
//                     className="text-gray-800 focus:text-gray-400 hover:text-gray-400 "
//                   >
//                     <svg
//                       width={6}
//                       height={8}
//                       viewBox="0 0 6 8"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M4.6875 0.625L1.3125 4L4.6875 7.375"
//                         stroke="#1F2937"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </button>
//                   <button
//                     aria-label="calendar forward"
//                     className="ml-3 text-gray-800 focus:text-gray-400 hover:text-gray-400 "
//                   >
//                     <svg
//                       width={6}
//                       height={8}
//                       viewBox="0 0 6 8"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M1.3125 7.375L4.6875 4L1.3125 0.625"
//                         stroke="#1F2937"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between pt-12 overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr>
//                       <th>
//                         <div className="flex justify-center w-full">
//                           <p className="text-xs font-semibold text-center text-gray-800 ">
//                             Mo
//                           </p>
//                         </div>
//                       </th>
//                       <th>
//                         <div className="flex justify-center w-full">
//                           <p className="text-xs font-semibold text-center text-gray-800 ">
//                             Tu
//                           </p>
//                         </div>
//                       </th>
//                       <th>
//                         <div className="flex justify-center w-full">
//                           <p className="text-xs font-semibold text-center text-gray-800 ">
//                             We
//                           </p>
//                         </div>
//                       </th>
//                       <th>
//                         <div className="flex justify-center w-full">
//                           <p className="text-xs font-semibold text-center text-gray-800 ">
//                             Th
//                           </p>
//                         </div>
//                       </th>
//                       <th>
//                         <div className="flex justify-center w-full">
//                           <p className="text-xs font-semibold text-center text-gray-800 ">
//                             Fr
//                           </p>
//                         </div>
//                       </th>
//                       <th>
//                         <div className="flex justify-center w-full">
//                           <p className="text-xs font-semibold text-center text-gray-800 ">
//                             Sa
//                           </p>
//                         </div>
//                       </th>
//                       <th>
//                         <div className="flex justify-center w-full">
//                           <p className="text-xs font-semibold text-center text-gray-800 ">
//                             Su
//                           </p>
//                         </div>
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="pt-6">
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer" />
//                       </td>
//                       <td className="pt-6">
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer" />
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer" />
//                       </td>
//                       <td className="pt-6">
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             1
//                           </p>
//                         </div>
//                       </td>
//                       <td className="pt-6">
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             2
//                           </p>
//                         </div>
//                       </td>
//                       <td className="pt-6">
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             3
//                           </p>
//                         </div>
//                       </td>
//                       <td className="pt-6">
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             4
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             5
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             6
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             7
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             8
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             9
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             10
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             11
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             12
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             13
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             14
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="w-full h-full">
//                           <div className="flex items-center justify-center w-full rounded-full cursor-pointer">
//                             <a
//                               role="link"
//                               tabIndex={0}
//                               className="flex items-center justify-center w-8 h-8 text-sm font-medium text-white bg-indigo-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:bg-indigo-500 hover:bg-indigo-500"
//                             >
//                               15
//                             </a>
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             16
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             17
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             18
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             19
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             20
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             21
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             22
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             23
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             24
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             25
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             26
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             27
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             28
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             29
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             30
//                           </p>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                           <p className="text-sm font-medium text-gray-600 ">
//                             31
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             <hr className="w-full border border-gray-100" />
//             <div className="w-full px-8 py-6">
//               <p className="mb-6 text-sm font-semibold leading-none text-gray-800">
//                 Servicios
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#0891B2] pl-2">
//                 Uñas
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#EA580C] pl-2 my-4">
//                 Barbería
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#4338CA] pl-2 my-4">
//                 Depilación
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#DC2626] pl-2 my-4">
//                 Maquillaje
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#9333EA] pl-2 my-4">
//                 Masajes
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#16A34A] pl-2 my-4">
//                 Peluquería
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#DC2626] pl-2  my-4">
//                 Spa
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#4338CA] pl-2  my-4">
//                 Yoga
//               </p>
//               <p className="text-sm leading-none text-gray-600 border-l-2 border-[#0891B2] pl-2">
//                 Academia
//               </p>
//             </div>
//           </div>
//           <div className="hidden w-10 h-full bg-white lg:block" />
//           <div className="hidden w-full xl:overflow-x-hidden md:block">
//             <table className="min-w-full bg-gray-50 ">
//               <thead className="items-center">
//                 <tr className="h-12 bg-white border-b border-l border-r border-gray-200 rounded-lg ">
//                   <th className="px-10 ">
//                     <p className="text-sm font-medium text-center text-gray-800 cursor-pointer ">
//                       Sun
//                     </p>
//                   </th>
//                   <th className="px-10 ">
//                     <p className="text-sm font-medium text-center text-gray-800 cursor-pointer ">
//                       Mon{" "}
//                     </p>
//                   </th>
//                   <th className="px-10 ">
//                     <p className="text-sm font-medium text-center text-gray-800 cursor-pointer ">
//                       Tue
//                     </p>
//                   </th>
//                   <th className="px-10 ">
//                     <p className="text-sm font-medium text-center text-gray-800 cursor-pointer ">
//                       Wed
//                     </p>
//                   </th>
//                   <th className="px-10 ">
//                     <p className="text-sm font-medium text-center text-gray-800 cursor-pointer ">
//                       Thu
//                     </p>
//                   </th>
//                   <th className="px-10 ">
//                     <p className="text-sm font-medium text-center text-gray-800 cursor-pointer ">
//                       Fri
//                     </p>
//                   </th>
//                   <th className="px-10 ">
//                     <p className="text-sm font-medium text-center text-gray-800 cursor-pointer ">
//                       Sat
//                     </p>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-b border-gray-300 ">
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-400 " />
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-400 " />
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-400 " />
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-400 " />
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       1
//                     </p>
//                     <div className="absolute flex items-center gap-x-1 2xl:w-[9%] md:w-28 py-3 px-2 ml-[10px] mt-[-115px] h-[76px]  rounded-sm bg-indigo-50 xl:w-[10%] lg:w-[10%] border-l-2 border-indigo-700 pl-2">
//                       <div tabIndex={0} className="ml-1">
//                         <p className="text-xs font-medium leading-normal text-indigo-700">
//                           Design Review{" "}
//                         </p>
//                         <p className="text-xs font-medium leading-normal text-indigo-700 ">
//                           14:00 - 16:00
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600">
//                       2
//                     </p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600">
//                       3
//                     </p>
//                   </td>
//                 </tr>
//                 <tr className="relative w-full border-b border-gray-300 ">
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       4
//                     </p>
//                   </td>
//                   <td className="relative border-r border-gray-300 xl:static ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       5
//                     </p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       6
//                     </p>
//                   </td>
//                   <td className="relative border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       7
//                     </p>
//                     <div className="absolute flex items-center gap-x-1 2xl:w-[80%] md:w-28 py-3 px-2 ml-[10px] mt-[-115px] h-[76px]  rounded-sm bg-[#ECFEFF] xl:w-[85%] lg:w-[85%] border-l-2 border-[#0E7490] pl-2">
//                       <div tabIndex={0} className="py-2 ml-1">
//                         <p className="text-xs font-medium leading-normal text-[#0E7490]">
//                           Dinner with <br /> Alpha Team{" "}
//                         </p>
//                         <p className="text-xs font-medium leading-normal text-[#0E7490] mt-3">
//                           21:00 - 22:00
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       8
//                     </p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600">
//                       9
//                     </p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600">
//                       10
//                     </p>
//                   </td>
//                 </tr>
//                 <tr className="relative border-b border-gray-300 ">
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       11
//                     </p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       12
//                     </p>
//                   </td>
//                   <td className="relative border-r border-gray-300 xl:static ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       13
//                     </p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       14
//                     </p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600 ">
//                       15
//                     </p>
//                     <div className="absolute flex items-center gap-x-1 2xl:w-[35%] md:w-52 py-3 px-2 ml-[10px] mt-[-115px] h-[76px]  rounded-sm bg-[#F0FDF4] xl:w-[30%] lg:w-[25%] border-l-2 border-[#15803D] pl-2">
//                       <div tabIndex={0} className="ml-1">
//                         <p className="text-xs font-medium leading-normal text-[#15803D]">
//                           Family Trip to a beach and Resort{" "}
//                         </p>
//                         <p className="text-xs font-medium leading-normal text-[#15803D] ">
//                           09:00 - 18:00
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600">
//                       16
//                     </p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600">
//                       17
//                     </p>
//                   </td>
//                 </tr>
//                 <tr className="border-b border-gray-300 ">
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">18</p>
//                     <div className="absolute flex items-center gap-x-1 2xl:w-[9%] md:w-28 py-3 px-2 ml-[10px] mt-[-115px] h-[76px]  rounded-sm bg-[#FFF7ED] xl:w-[10%] lg:w-[10%] border-l-2 border-[#C2410C] pl-2">
//                       <div tabIndex={0} className="ml-1">
//                         <p className="text-xs font-medium leading-normal text-[#C2410C]">
//                           Dart Game{" "}
//                         </p>
//                         <p className="text-xs font-medium leading-normal text-[#C2410C] ">
//                           22:00 - 23:00
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">19</p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">20</p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">21</p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">22</p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600">23</p>
//                     <div className="absolute flex items-center gap-x-1 2xl:w-[9%] md:w-28 py-3 px-2 ml-[10px] mt-[-115px] h-[76px]  rounded-sm bg-indigo-50 xl:w-[10%] lg:w-[10%] border-l-2 border-indigo-700 pl-2">
//                       <div tabIndex={0} className="ml-1">
//                         <img
//                           src="https://tuk-cdn.s3.amazonaws.com/can-uploader/145.png"
//                           alt="one"
//                         />
//                         <p className="text-xs font-medium leading-normal text-indigo-700">
//                           Grocery
//                         </p>
//                         <p className="text-xs font-medium leading-normal text-indigo-700 ">
//                           17:00 - 19:00
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600">24</p>
//                   </td>
//                 </tr>
//                 <tr className="border-b border-gray-300 ">
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">25</p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">26</p>
//                     <div className="absolute flex items-center gap-x-1 2xl:w-[9%] md:w-28 py-3 px-2 ml-[10px] mt-[-115px] h-[76px]  rounded-sm bg-[#FEF2F2] xl:w-[10%] lg:w-[10%] border-l-2 border-[#B91C1C] pl-2">
//                       <div tabIndex={0} className="ml-1">
//                         <img
//                           src="https://tuk-cdn.s3.amazonaws.com/can-uploader/245.png"
//                           alt="two"
//                         />
//                         <p className="text-xs font-medium leading-normal text-[#B91C1C]">
//                           Doctor’s Visit
//                         </p>
//                         <p className="text-xs font-medium leading-normal text-[#B91C1C] ">
//                           14:00 - 16:00
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">27</p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">28</p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600 ">29</p>
//                     <div className="absolute flex items-center gap-x-1 2xl:w-[9%] md:w-28 py-3 px-2 ml-[10px] mt-[-115px] h-[76px]  rounded-sm bg-[#FAF5FF] xl:w-[10%] lg:w-[10%] border-l-2 border-[#7E22CE] pl-2">
//                       <div tabIndex={0} className="ml-1">
//                         <img
//                           src="https://tuk-cdn.s3.amazonaws.com/can-uploader/345.png"
//                           alt="three"
//                         />
//                         <p className="text-xs font-medium leading-normal text-[#7E22CE]">
//                           Client Meetup
//                         </p>
//                         <p className="text-xs font-medium leading-normal text-[#7E22CE] ">
//                           22:00 - 23:00
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600">30</p>
//                   </td>
//                   <td className="border-r border-gray-300 ">
//                     <p className="pt-2 pb-32 pl-2 text-xs text-gray-600">31</p>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="block md:hidden">
//           <div className="flex items-center justify-between w-full px-1 py-8 overflow-x-auto bg-white">
//             <table className="w-full ">
//               <thead>
//                 <tr>
//                   <th>
//                     <div className="flex justify-center w-full">
//                       <p className="text-sm font-medium text-center text-gray-600 ">
//                         Su
//                       </p>
//                     </div>
//                   </th>
//                   <th>
//                     <div className="flex justify-center w-full">
//                       <p className="text-sm font-medium text-center text-gray-600 ">
//                         Mo
//                       </p>
//                     </div>
//                   </th>
//                   <th>
//                     <div className="flex justify-center w-full">
//                       <p className="text-sm font-medium text-center text-gray-600 ">
//                         Tu
//                       </p>
//                     </div>
//                   </th>
//                   <th>
//                     <div className="flex justify-center w-full">
//                       <p className="text-sm font-medium text-center text-gray-600 ">
//                         We
//                       </p>
//                     </div>
//                   </th>
//                   <th>
//                     <div className="flex justify-center w-full">
//                       <p className="text-sm font-medium text-center text-gray-600 ">
//                         Th
//                       </p>
//                     </div>
//                   </th>
//                   <th>
//                     <div className="flex justify-center w-full">
//                       <p className="text-sm font-medium text-center text-gray-600 ">
//                         Fr
//                       </p>
//                     </div>
//                   </th>
//                   <th>
//                     <div className="flex justify-center w-full">
//                       <p className="text-sm font-medium text-center text-gray-600 ">
//                         Sa
//                       </p>
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="pt-6">
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-sm text-gray-400" />
//                     </div>
//                   </td>
//                   <td className="pt-[22px]">
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-sm text-gray-400" />
//                     </div>
//                   </td>
//                   <td className="pt-6">
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-400 " />
//                     </div>
//                   </td>
//                   <td className="pt-6">
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-400 " />
//                     </div>
//                   </td>
//                   <td className="pt-6">
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 w-[25px] py-[2px] ml-[5px] border-l-2 border-indigo-700 rounded-sm bg-indigo-50 pl-1">
//                         1
//                       </p>
//                     </div>
//                   </td>
//                   <td className="pt-6 ">
//                     <div className="relative flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 ">2</p>
//                     </div>
//                   </td>
//                   <td className="pt-[22px]">
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 ">3</p>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 ">4</p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 ">5</p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="w-full h-full">
//                       <div className="relative flex items-center justify-center w-full rounded-full cursor-pointer">
//                         <a
//                           tabIndex={0}
//                           role="link"
//                           className="flex items-center justify-center text-xs text-gray-600 "
//                         >
//                           6
//                         </a>
//                       </div>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 w-[25px] py-[2px] ml-[5px] border-l-2 border-[#0891B2] rounded-sm bg-[#ECFEFF] pl-1">
//                         7
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 ">8</p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 ">9</p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 ">10</p>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 ">11</p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer ">
//                       <p className="text-xs text-gray-600 ">12</p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer ">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 hover:rounded ">
//                         13
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer ">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         14
//                       </p>
//                     </div>
//                   </td>
//                   <td className>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 w-[25px] py-[2px] ml-[5px] border-l-2 border-[#16A34A] rounded-sm bg-[#F0FDF4] pl-1">
//                         15
//                       </p>
//                     </div>
//                   </td>
//                   <td className>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         16
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 ">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         17
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 ">
//                       <p className="text-xs text-gray-600 w-[25px] py-[2px] ml-[5px] border-l-2 border-[#BE185D] rounded-sm bg-[#FDF2F8] pl-1">
//                         18
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 ">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         19
//                       </p>
//                     </div>
//                   </td>
//                   <td className>
//                     <div className="flex justify-center w-full px-2 py-2 ">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         20
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 ">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         21
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 ">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         22
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 w-[25px] py-[2px] ml-[5px] border-l-2 border-indigo-700 rounded-sm bg-indigo-50 pl-1">
//                         23
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer ">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         24
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         25
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 w-[25px] py-[2px] ml-[5px] border-l-2 border-[#1D4ED8] rounded-sm bg-blue-50 pl-1">
//                         26
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         27
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         28
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="text-xs text-gray-600 w-[25px] py-[2px] ml-[5px] border-l-2 border-[#7C3AED] rounded-sm bg-[#F5F3FF] pl-1">
//                         29
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         30
//                       </p>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex justify-center w-full px-2 py-2 cursor-pointer">
//                       <p className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 ">
//                         31
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default CalendarDashboard;
