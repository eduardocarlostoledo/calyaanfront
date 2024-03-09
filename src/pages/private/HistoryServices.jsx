import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import clienteAxios from "../../config/axios";
import { Link } from "react-router-dom";
import { getEstadoPagoClass } from "../../helpers/Logic/coloresEstadoPago.js";
import { getEstadoOrdenClass } from "../../helpers/Logic/coloresEstadoOrden.js";


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
                <th scope="col" className="responsive-th text-center">
                  Servicio
                </th>
                <th scope="col" className="responsive-th text-center">
                  Sesión
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Fecha
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Hora
                </th>
                <th scope="col" className="responsive-th text-center">
                  Cliente
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Estado
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Pago Servicio
                </th>               
                <th scope="col" className="responsive-th text-center">
                  Chat y Orden
                </th>
              </tr>
            </thead>
            <tbody>
              {historial?.map((reserva) => (
                <tr key={reserva._id} className="bg-white border-b">
                  <td className="responsive-td">
                    {reserva?.servicios?.map((servicio) => servicio.nombre)}
                  </td>
                  <td className="responsive-td text-center">{reserva?.nroSesion}</td>
                  <td className="responsive-td hidden md:table-cell text-center">{reserva?.cita_servicio ? reserva?.cita_servicio : "Agendar" }</td>
                  <td className="responsive-td hidden md:table-cell text-center">{reserva?.hora_servicio ? reserva?.hora_servicio : "Agendar "}</td>
                  <td className="responsive-td text-center">{reserva?.profesional_id?.creador?.nombre ? reserva?.profesional_id?.creador?.nombre : "Agendar"}</td>
                  <td className={`responsive-td hidden md:table-cell text-center ${getEstadoOrdenClass(reserva?.estado_servicio)}`}>{reserva?.estado_servicio}</td>
                  <td className={`responsive-td hidden md:table-cell text-center ${getEstadoPagoClass(reserva?.factura?.estadoPago)}`}>
  {reserva?.factura?.estadoPago}
</td>


                  <td className="responsive-td text-center">
                    <Link to={`/resumen/${reserva._id}`}>CHAT</Link>
                    <td className="px-6 py-4 text-center">
                    </td>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoryServices;