import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import clienteAxios from "../../../config/axios";
import { Link } from "react-router-dom";

const HistoryServicesProfessional = () => {
  const [historial, setHistorial] = useState([]);

  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const getHistorial = async () => {
      try {

        let { data } = await clienteAxios.get(
          `api/profesional/historial/${user.profesionalId}`
        );
        const datosFiltrados = data.filter((item) => item !== null && item !== undefined);
        setHistorial(datosFiltrados);

      } catch (err) {
        console.log(err);
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getHistorial();
  }, []);

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
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Pago Servicio
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
                      >    {reserva?.servicios?.map((servicio)=>servicio.nombre)}
                      </th>
                      <td className="px-6 py-4">{reserva.cita_servicio}</td>
                      <td className="px-6 py-4">{reserva.hora_servicio}</td>
                      <td className="px-6 py-4">
                        {reserva?.cliente_id?.nombre}
                      </td>
                      <td className="px-6 py-4">{reserva.estado_servicio}</td>
                      <td className="px-6 py-4">{reserva.factura.estadoPago}</td>
                      <td className="px-6 py-4"> <Link to={`/resumen-profesional/${reserva._id}`}> Ver </Link>
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

export default HistoryServicesProfessional;
