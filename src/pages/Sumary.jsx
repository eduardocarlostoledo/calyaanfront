import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ImWhatsapp } from "react-icons/im";
import calcularCupon from "../helpers/Logic/calcularCupon";
import Spinner from "../components/Spinner";
import Chat from "./private/professional/Chat";
import { useSelector } from "react-redux";
import ModalLogin from "../components/ModalLogin";

const Sumary = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const navigate = useNavigate();
  const { search } = useLocation();
  const { id } = useParams();
  const [valorDeDescuento, setValorDescuento] = useState(0)
  const [cargando, setCargando] = useState(false)
  const [historial, setHistorial] = useState([]);
  const [modal, setModal] = useState(false);

  const handleModalLogin = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const verificarSesion = async () => {
      try {        
        if (user === null) {
          setModal(true);
        } else {
          navigate(`/resumen/${id}`);
          setModal(false);
        }   
      } catch (error) {
        console.log(error);
        const errorMsg = error.response?.data?.msg || "Estamos presentando problemas internos";
        toast.error(errorMsg);
      }
    };
  
    verificarSesion(); // Llama a la función de verificación cuando cambie el usuario
  }, [user, id]); // Añade 'id' al array de dependencias para que el useEffect se dispare cuando 'id' cambie

  useEffect(() => {
    const getHistorial = async () => {
      try {
        setCargando(true)
        let { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);
        setHistorial(data);
        setValorDescuento(data?.factura?.coupon?.tipoDescuento === "porcentaje" ? (data?.factura?.precioNeto - (data?.factura?.precioNeto * (data?.factura?.coupon?.descuento / 100))) : data?.factura?.coupon?.descuento)
        setCargando(false)
      } catch (error) {
        console.log(error);
        setCargando(false)
        const errorMsg =
          error.response?.data?.msg || "Estamos presentando problemas internos";
        toast.error(errorMsg);
      }
    };
    getHistorial();
  }, [id]);

  return (
<div className="container mx-auto p-4 md:p-8 flex gap-4 3xl:gap-8 bg-white flex-wrap items-center justify-center">
      <div className="bg-white rounded shadow-lg p-4 md:p-8 mb-6 w-full lg:w-4/5">
        {
          cargando ?
            <div className="flex justify-center items-center h-80">
              <Spinner />
            </div>
            :
            <>
              <div className="lg:max-w-[1440px] md:max-w-[744px] max-w-[373px] lg:px-10 md:px-6 px-4 py-12 bg-white mx-auto">
                <div className="lg:max-w-[1063px] w-full mx-auto">
                  <p className="lg:text-4xl text-3xl text-center font-semibold leading-9 text-gray-800">
                    Gracias por tu reserva
                  </p>
                  <div className="lg:flex justify-between gap-4 mt-8">
                    <p className="md:text-xl text-base text-gray-800 leading-tight font-medium">
                      Número de orden:{" "}  {historial._id}
                      
                    </p>
                    {/* <p className="md:text-xl text-base text-gray-800 leading-tight font-medium lg:mt-0 md:mt-6 mt-6">
                      Fecha de reserva:{" "}
                      <span className="text-gray-600 font-normal">
                        {historial?.cita_servicio} - {historial?.hora_servicio}{" "}
                      </span>
                    </p> */}

                    <div className="flex md:gap-8 gap-4">
                      <p className="md:text-xl text-base font-medium leading-normal text-gray-800 lg:mt-0 md:mt-6 mt-6">
                        Profesional: {historial?.profesional_id?.nombre || "Pendiente"}
                      </p>
                      
                    </div>
                  </div>
                  <hr className="mt-6" />

                  <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8">
                    <div>
                      <p className="text-2xl font-semibold leading-normal text-gray-800">
                        Detalle del Paquete
                      </p>


                      <div className="lg:flex gap-4 justify-between">
                        <div className="md:flex gap-4 mt-6">
                          {
                            historial?.servicios?.map((servicio) => (
                              <>
                                <div >
                                  <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 items-center">
                                    <img
                                      src={servicio?.img}
                                      alt=""
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>
                                </div>
                                <div className="md:mt-0 mt-4">
                                  <p className="text-base leading-none text-gray-600">
                                    {servicio?.nombre}
                                  </p>
                                  <p className="text-base font-semibold leading-none text-gray-800 mt-4">
                                    <NumericFormat
                                      value={servicio?.precio}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                      prefix={"$"}
                                    />
                                  </p>
                                  <p className="text-base leading-none text-gray-600 mt-4">
                                    Cantidad {servicio?.cantidad ? servicio?.cantidad : 1}
                                  </p>
                                </div>
                              </>
                            ))
                          }
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
                          {historial?.direccion_servicio || "Pendiente"}
                          <br />

                        </p>
                        <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                          Pago de Reserva
                        </p>
                        <p className="text-base leading-normal text-gray-600">
                          Nro: {" "}
                          {historial?.factura?.payment_id || "Pendiente"}
                          <br />
                          Estado: {" "}      {historial?.factura?.estadoPago || "Pendiente"}
                        </p>
                        <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                          Día y Hora asignada
                        </p>
                        <p className="text-base leading-normal text-gray-600">
                          Hora:  {historial?.hora_servicio || "Pendiente"}
                          <br />
                          Fecha: {historial?.cita_servicio || "Pendiente"}
                        </p>

                      </div>
                      <div className="mt-4">
                    
                        <a

                          href={`https://web.whatsapp.com/send/?phone=573147428757&text${id}&type=phone_number&app_absent=0`}

                          className="flex border bg-whatsapp   mt-6 p-5 border-gray-300 lg:max-w-[296px] w-full justify-center py-3 gap-2 items-center text-center"
                          target="_blank"
                        >
                          <p className="text-base font-medium leading-none text-white">
                            Consultas
                          </p>
                          <ImWhatsapp className="w-4 h-4 text-white" />
                        </a>
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
                    </div>
                    <div className="flex justify-between mt-4">
                      <p className="text-base leading-none text-gray-800">
                        Precio del servicio
                      </p>
                      <p className="text-base leading-none text-gray-800">
                        <NumericFormat
                          value={historial?.factura?.precioNeto}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </p>
                    </div>

                    {
                      historial?.factura?.coupon?.codigo &&
                      <>
                        <div className="flex justify-between mt-4">
                          <p className="text-base leading-none text-gray-800">
                            Descuento de cupon - {historial?.factura?.coupon?.codigo}
                          </p>
                          <p className="text-base leading-none text-gray-800">
                            <NumericFormat
                              value={valorDeDescuento}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"$"}
                            />
                          </p>
                        </div>

                        <div className="flex justify-between mt-4">
                          <p className="text-base leading-none text-gray-800">
                            Precio con descuentos
                          </p>
                          <p className="text-base leading-none text-gray-800">
                            <NumericFormat
                              value={historial?.factura?.precioSubTotal}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"$"}
                            />
                          </p>
                        </div>
                      </>
                    }

                    <div className="flex justify-between mt-4">
                      <p className="text-base font-semibold leading-none text-gray-800">
                        Precio Por Sesión
                      </p>
                      <p className="text-base font-semibold leading-none text-gray-800">
                        {" "}
                        <NumericFormat
                          value={historial?.factura?.precioTotal}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </p>
                    </div>
                  </div>
                 
                </div>
              </div>
            </>
        }

<div className="chat">
      <header className="chat-header">
        <h1>Chatea con nosotros!</h1>
      </header>
      <Chat id={(id)}/>
      </div>
      </div>
      {modal && <ModalLogin handleModalLogin={handleModalLogin} />}

    </div>
  );
};

export default Sumary;