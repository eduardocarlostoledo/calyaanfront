import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Sumary = () => {
  const [services, setServices] = useState(
    JSON.parse(localStorage.getItem("services"))
      ? JSON.parse(localStorage.getItem("services"))
      : []
  );

  const { id } = useParams();

  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const getHistorial = async () => {
      try {
        let { data } = await clienteAxios.get(`/ordenes/getordenbyid/${id}`);
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
  }, [id]);

  return (
    <div className="mx-auto p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center">
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-4/5">
        <div className="lg:max-w-[1440px] md:max-w-[744px] max-w-[373px] lg:px-10 md:px-6 px-4 py-12 bg-white mx-auto">
          <div className="lg:max-w-[1063px] w-full mx-auto">
            <p className="lg:text-4xl text-3xl text-center font-semibold leading-9 text-gray-800">
              Gracias por tu reserva
            </p>
            <div className="lg:flex justify-between gap-4 mt-8">
              <p className="md:text-xl text-base text-gray-800 leading-tight font-medium">
                Número de orden:{" "}
                <span className="text-gray-600 font-normal">
                  {" "}
                  {historial._id}
                </span>
              </p>
              <p className="md:text-xl text-base text-gray-800 leading-tight font-medium lg:mt-0 md:mt-6 mt-6">
                Fecha de reserva:{" "}
                <span className="text-gray-600 font-normal">
                  {" "}
                  {historial.dia_servicio} - {historial.hora_servicio}{" "}
                </span>
              </p>

              <div className="flex md:gap-8 gap-4">
                <p className="md:text-xl text-base font-medium leading-normal text-gray-800 lg:mt-0 md:mt-6 mt-6">
                  Profesional
                </p>
                <ul className="list-disc">
                  <p className="text-base leading-normal text-gray-600 lg:max-w-[235px] w-full">
                    {historial.profesional_nombre}
                  </p>
                </ul>
              </div>
            </div>
            <hr className="mt-6" />

            <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8">
              <div>
                <p className="text-2xl font-semibold leading-normal text-gray-800">
                  Resumen de reserva
                </p>

                <div className="lg:flex gap-4 justify-between">
                  <div className="md:flex gap-4 mt-6">
                    <div>
                      <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={historial?.servicio_img}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="md:mt-0 mt-4">
                      <p className="text-base leading-none text-gray-600">
                        {historial?.servicio}
                      </p>
                      <p className="text-base font-semibold leading-none text-gray-800 mt-4">
                        <NumericFormat
                          value={historial?.precio}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </p>
                      <p className="text-base leading-none text-gray-600 mt-4">
                        Cantidad {historial.cantidad}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-2xl font-semibold leading-normal text-gray-800 ">
                  Detalles de reserva
                </p>
                <div aria-label="delivery" className="">
                  <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                    Dirección de reserva
                  </p>
                  <p className="text-base leading-normal text-gray-600">
                    {historial.direccion_Servicio}
                    <br />
                    {historial.localidad_Servicio}
                  </p>
                  <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                    Pago de Reserva
                  </p>
                  <p className="text-base leading-normal text-gray-600">
                    Nro: {historial.payment_id}
                    <br />
                    Estado: {historial.estadoPago}
                  </p>
                  <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                    Horario de reserva
                  </p>
                  <p className="text-base leading-normal text-gray-600">
                    Hora: {historial.hora_servicio}
                    <br />
                    Fecha: {historial.dia_servicio}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="mb-4 text-base font-semibold leading-none text-gray-800 ">
                    Contacto
                  </p>
                  <p className="text-base leading-normal text-gray-600">
                    {historial.cliente_telefono} <br />
                    {historial.cliente_email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="mt-6" />
          <p className="text-2xl font-medium leading-normal text-gray-800 mt-6">
            Total de la reserva
          </p>
          <div className="lg:flex gap-4 justify-between">
            <div className="lg:max-w-[405px] w-full">
              <div className="flex justify-between mt-4">
                <p className="text-base leading-none text-gray-800">
                  Servicios Totales
                </p>
                <p className="text-base leading-none text-gray-800">
                  {historial.cantidad}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <p className="text-base leading-none text-gray-800">
                  Descuento por Fidelidad
                </p>
                <p className="text-base leading-none text-gray-800">0</p>
              </div>
              <div className="flex justify-between mt-4">
                <p className="text-base font-semibold leading-none text-gray-800">
                  Precio Total
                </p>
                <p className="text-base font-semibold leading-none text-gray-800">
                  {" "}
                  <NumericFormat
                    value={historial.precio}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </p>
              </div>
            </div>
            <div className="lg:mt-0 md:mt-6 mt-4">
              <p className="text-base leading-normal text-gray-600 lg:max-w-[515px] w-full">
                Apreciamos tu compra y esperamos que disfrute de tu servicio
                ¡Gracias!
              </p>

              <p className="text-base text-gray-600 leading-none mt-8">
                ¿Preguntas? Revisa
                <span className="text-gray-800 font-semibold hover:underline cursor-pointer mt-2">
                  Nuestras preguntas frecuentes
                </span>
              </p>
              <p className="text-base text-gray-600 mt-4">
                ¿Preguntas? Póngase en contacto con nuestro
                <span className="text-gray-800 font-semibold hover:underline cursor-pointer">
                  Atención al cliente
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sumary;

/* <div className="grid  md:grid-cols-2 gap-4 w-full max-w-screen-lg">
<div>
<h2 className="text-sm font-medium">Mapa - Hora de llegada 2:00 PM</h2>
<div className="bg-white rounded mt-4 shadow-lg">
  <img
    className="object-cover"
    src="https://i.pinimg.com/originals/7c/81/e3/7c81e3caedbcaaa8f4101897e92150e3.jpg"
  />
</div>
</div>
*/
