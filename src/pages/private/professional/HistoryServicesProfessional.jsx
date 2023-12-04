import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import clienteAxios from '../../../config/axios';
import { Link } from 'react-router-dom';

const HistoryServicesProfessional = () => {
  const [historial, setHistorial] = useState([]);

  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const getHistorial = async () => {
      try {
        let { data } = await clienteAxios.get(`api/profesional/historial/${user.profesionalId}`);
        const datosFiltrados = data.filter((item) => item !== null && item !== undefined);
        setHistorial(datosFiltrados);
      } catch (err) {
        console.log(err);
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && 'Estamos presentando problemas internos';
        return toast.error(error);
      }
    };
    getHistorial();
  }, []);

  // return (
  //   <div className="flex flex-col items-center justify-center mt-5 md:ml-62 w-full">
  //     <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-full md:w-3/4">
  //       <h5 className="text-xl font-medium leading-none mb-4 text-center">
  //         Servicios en Curso
  //       </h5>

  //       <div className="overflow-x-auto">
  //         <table className="w-full text-sm text-left text-gray-500">
  //           <thead className="text-xs text-gray-700 uppercase bg-gray-50">
  //             <tr>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Servicio
  //               </th>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Sesión
  //               </th>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Fecha
  //               </th>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Hora
  //               </th>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Cliente
  //               </th>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Estado
  //               </th>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Pago Servicio
  //               </th>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Orden
  //               </th>
  //               <th scope="col" className="px-6 py-3 text-center">
  //                 Chat Cliente
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {historial?.map((reserva) => (
  //               <tr key={reserva._id} className="bg-white border-b">
  //                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
  //                   {reserva?.servicios?.map((servicio) => servicio.nombre)}
  //                 </td>
  //                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
  //                   {reserva.nroSesion}
  //                 </td>
  //                 <td className="px-6 py-4">{reserva.cita_servicio}</td>
  //                 <td className="px-6 py-4 text-center">{reserva.hora_servicio}</td>
  //                 <td className="px-6 py-4 text-center">{reserva?.cliente_id?.nombre}</td>
  //                 <td className="px-6 py-4 text-center">{reserva.estado_servicio}</td>
  //                 <td className="px-6 py-4 text-center">{reserva.factura.estadoPago}</td>
  //                 <td className="px-6 py-4 text-center">
  //                   <Link to={`/resumen-profesional/${reserva._id}`}>Ver</Link>
  //                 </td>
  //                 <td className="px-6 py-4 text-center">
  //                   <Link to={`/resumen-profesional/${reserva._id}`}>CHAT</Link>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
  <div className="flex flex-col items-center justify-center mt-5 md:ml-62 w-full">
    <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-full md:w-3/4">
      <h5 className="text-xl font-medium leading-none mb-4 text-center">
        Servicios en Curso
      </h5>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
  <tr>
    <th scope="col" className="responsive-th">
      Servicio
    </th>
    <th scope="col" className="responsive-th">
      Sesión
    </th>
    <th scope="col" className="responsive-th hidden md:table-cell">
      Fecha
    </th>
    <th scope="col" className="responsive-th hidden md:table-cell">
      Hora
    </th>
    <th scope="col" className="responsive-th hidden md:table-cell">
      Cliente
    </th>
    <th scope="col" className="responsive-th hidden md:table-cell">
      Estado
    </th>
    <th scope="col" className="responsive-th hidden md:table-cell">
      Pago Servicio
    </th>
    <th scope="col" className="responsive-th">
      Orden
    </th>
    <th scope="col" className="responsive-th">
      Chat Cliente
    </th>
  </tr>
</thead>
<tbody>
  {historial?.map((reserva) => (
    <tr key={reserva._id} className="bg-white border-b">
      <td className="responsive-td">
        {reserva?.servicios?.map((servicio) => servicio.nombre)}
      </td>
      <td className="responsive-td text-center">{reserva.nroSesion}</td>
      <td className="responsive-td hidden md:table-cell text-center">{reserva.cita_servicio}</td>
      <td className="responsive-td hidden md:table-cell text-center">{reserva.hora_servicio}</td>
      <td className="responsive-td hidden md:table-cell text-center">{reserva?.cliente_id?.nombre}</td>
      <td className="responsive-td hidden md:table-cell text-center">{reserva.estado_servicio}</td>
      <td className="responsive-td hidden md:table-cell text-center">{reserva.factura.estadoPago}</td>
      <td className="responsive-td text-center">
        <Link to={`/resumen-profesional/${reserva._id}`}>Ver</Link>
      </td>
      <td className="responsive-td text-center">
        <Link to={`/resumen-profesional/${reserva._id}`}>CHAT</Link>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  </div>
);


};

export default HistoryServicesProfessional;

// import React from "react";
// import { useState } from "react";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import clienteAxios from "../../../config/axios";
// import { Link } from "react-router-dom";

// const HistoryServicesProfessional = () => {
//   const [historial, setHistorial] = useState([]);

//   const { user } = useSelector((state) => ({ ...state.auth }));

//   useEffect(() => {
//     const getHistorial = async () => {
//       try {

//         let { data } = await clienteAxios.get(
//           `api/profesional/historial/${user.profesionalId}`
//         );
//         const datosFiltrados = data.filter((item) => item !== null && item !== undefined);
//         setHistorial(datosFiltrados);

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



//   return (
//     <div className="flex items-center justify-center ml-72 mt-5">
//     <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//       <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
//         <div className="lg:col-span-2 mx-auto">
//           <div className="flex items-center justify-between mb-4">
//             <h5 className="text-xl font-medium leading-none mb-2">
//               Servicios en Curso
//             </h5>
//           </div>

//           <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//             <table className="mx-auto w-full text-sm text-left text-gray-500">
              
//                 <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Servicio
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Sesión
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Fecha
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Hora
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Cliente
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Estado
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Pago Servicio
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Orden
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center">
//                       Chat Cliente
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {historial?.map((reserva) => (
//                     <tr key={reserva._id} className="bg-white border-b">
//                       <th
//                         scope="row"
//                         className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
//                       >    {reserva?.servicios?.map((servicio)=>servicio.nombre)}
//                       </th>
//                       <th
//                         scope="row"
//                         className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
//                       >    {reserva.nroSesion}
//                       </th>
//                       <td className="px-6 py-4">{reserva.cita_servicio}</td>
//                       <td className="px-6 py-4">{reserva.hora_servicio}</td>
//                       <td className="px-6 py-4">
//                         {reserva?.cliente_id?.nombre}
//                       </td>
//                       <td className="px-6 py-4">{reserva.estado_servicio}</td>
//                       <td className="px-6 py-4">{reserva.factura.estadoPago}</td>
//                       <td className="px-6 py-4"> <Link to={`/resumen-profesional/${reserva._id}`}> Ver </Link></td>
//                       <td className="px-6 py-4"> <Link to={`/resumen-profesional/${reserva._id}`}> Ver </Link></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

      
//     </div>
//   );
// };

// export default HistoryServicesProfessional;
