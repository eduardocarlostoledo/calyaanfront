import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import clienteAxios from "../../config/axios";
import { Link } from "react-router-dom";

const HistoryServices = () => {
  const [historial, setHistorial] = useState([]);
  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const getHistorial = async () => {
      // console.log(user._id);
      try {
        let { data } = await clienteAxios.get(
          `api/usuarios/historial/${user._id}`
        );

          console.log(data)

        setHistorial(data);
        // console.log(data)
      } catch (error) {
        console.log(error);
        const errorMsg =
          error.response?.data?.msg || "Estamos presentando problemas internos";
        toast.error(errorMsg);
      }
    };
    getHistorial();
  }, [user._id]);

  // console.log(historial);

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="mb-4">
            <p className="font-medium text-xl mb-2">Historial</p>
            <p className="text-gray-600 leading-loose">
              Podrás visualizar todos los servicios que has solicitado
              acumulando puntos para descuentos espectaculares.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-medium leading-none mb-2">
                Ultimos servicios solicitados
              </h5>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Servicio
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Hora
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Profesional
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historial?.map((reserva) => (
                    <tr key={reserva._id} className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {reserva?.servicios?.map((servicio)=>servicio.nombre)}
                      </th>
                      <td className="px-6 py-4">{reserva.cita_servicio}</td>
                      <td className="px-6 py-4">{reserva.hora_servicio}</td>
                      <td className="px-6 py-4">
                        {reserva.profesional_id.creador.nombre}
                      </td>
                      <td className="px-6 py-4">{reserva.estado_servicio}</td>
                      <td className="px-6 py-4">
                        {" "}
                        <Link to={`/resumen/${reserva._id}`}> Ver </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryServices;

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import clienteAxios from "../../config/axios";

// const HistoryServices = () => {
//   const [historial, setHistorial] = useState([]);
// console.log(historial, "historial") // FLAG
//   const { user } = useSelector((state) => ({ ...state.auth }));

//   useEffect(() => {
//     const getHistorial = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_APP_BACK}/ordenes/ordenbyuserid/${user._id}`);
//         const data = await response.json();
//         setHistorial(data);
//         // let { data } = await clienteAxios.get(
//         //   `ordenes/orden/${user._id}`
//         // );
//         // setHistorial([...data]);
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
//     <div className="flex items-center justify-center mt-5">
//       <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//         <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
//           <div className="mb-4">
//             <p className="font-medium text-xl mb-2">Historial</p>
//             <p className="text-gray-600 leading-loose">
//               Podrás visualizar todos los servicios que has solicitado
//               acumulando puntos para descuentos espectaculares.
//             </p>
//           </div>

//           <div className="lg:col-span-2">
//             <div className="flex items-center justify-between mb-4">
//               <h5 className="text-xl font-medium leading-none mb-2">
//                 Ultimos servicios solicitados
//               </h5>
//             </div>

//             <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//               <table className="w-full text-sm text-left text-gray-500">
//                 <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3">
//                       Servicio
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Fecha y Hora
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Profesional
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Estado
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr className="bg-white border-b">
//                     {historial?.map((reserva) => (
//                       <>
//                         <th
//                           scope="row"
//                           className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
//                         >
//                           {reserva.servicio}
//                         </th>
//                         <td className="px-6 py-4">{reserva.diaHora}</td>
//                         <td className="px-6 py-4">{reserva.profesional}</td>
//                         <td className="px-6 py-4">{reserva.estadoPago}</td>
//                         <td className="px-6 py-4"></td>
//                       </>
//                     ))}
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HistoryServices;
