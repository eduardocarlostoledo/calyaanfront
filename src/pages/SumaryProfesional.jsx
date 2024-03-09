import React, { useEffect, useState } from "react";
import { ImWhatsapp } from "react-icons/im";
import { NumericFormat } from "react-number-format";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";
import Chat from "./private/professional/Chat";
import Spinner from "../components/Spinner";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { AiOutlineCheckCircle } from "react-icons/ai";

const newHourArray = [
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
]


const Sumary = () => {
  const { id } = useParams();
  const [historial, setHistorial] = useState([]);
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [estadoServicio, setEstadoServicio] = useState(null);
  const [horaRealizacion, sethoraFechaRealizacion] = useState("");
  const [fechaRealizacion, setFechaRealizacion] = useState("");
  const [estadoLiquidacion, setEstadoLiquidacion] = useState("");

  useEffect(() => {
    const getHistorial = async () => {
      try {
        const { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);
        setHistorial(data);
        setEstadoServicio(data.estado_servicio);
        setImage(data.registroFirmaCliente)
        sethoraFechaRealizacion(data.hora_servicio)
        setFechaRealizacion(data.cita_servicio);
        setEstadoLiquidacion()
      } catch (error) {
        handleAxiosError(error);
      }
    };
    getHistorial();
  }, [id, estadoServicio]);

  const handleUpdateOrder = async (estado) => {
    try {

      if (estadoServicio==="Cancelado") return handleAxiosError(error, "No se puede modificar un servicio cancelado");
      
      const response = await clienteAxios.post(`/api/ordenes/updateorderbyprofesional/`, {
        id,
        estado,
        registroFirmaCliente: image,
        fechaRealizacion,
        horaRealizacion,
      });
      setEstadoServicio(response.data.estado_servicio);
      setFechaRealizacion(response.data.fechaRealizacion);
      sethoraFechaRealizacion(response.data.horaRealizacion)
      toast.success(response.data.msg);
      // Actualizar el estado local o realizar otras acciones si es necesario
    } catch (error) {
      handleAxiosError(error, "Error al actualizar la orden");
    }
  };

  const handleChangeImage = async (e) => {
    try {
      setLoadingImage(true);
      const formData = new FormData();
      formData.append("upload_preset", `${e.target.files[0].name}`);
      formData.append("file", e.target.files[0], "form-data");

      const { data } = await clienteAxios.post(`/api/uploads/file-firmas`, formData);

      setLoadingImage(false);
      setImage(data.imageURL);
      toast.success(data.msg);
    } catch (err) {
      handleAxiosError(err, "Error al subir la imagen");
    }
  };

  const handleAxiosError = (error, defaultMessage) => {
    console.error("Error:", error);
    const errorMsg = error.response?.data?.msg || defaultMessage;
    toast.error(errorMsg);
  };

  //console.log("IMAGE", image)

  //console.log(historial);

  function getEstadoClase(estado) {
    switch (estado) {
      case "Completado":
        return "text-green-500"; // Clase para texto verde
      case "Cancelada":
        return "text-red-500"; // Clase para texto rojo
      default:
        return "text-yellow-500"; // Clase para texto amarillo
    }
  }

  return (
    <div className="text-center py-1">

      <p className="text-xl md:text-2xl font-semibold leading-normal text-gray-800 ">
        Detalles de reserva
      </p>
      <div>
        <div>

          <div className="mx-auto text-center">
            <div className="mt-1 text-center">
              <p>
                Número de orden:{" "}
                <span className="text-gray-600 font-normal sm:text-center block sm:inline">
                  {historial._id}
                </span>
              </p>
              <p>
                Día y Hora:{" "}
                <span className="text-gray-600 font-normal sm:text-center block sm:inline">
                  {fechaRealizacion} - {horaRealizacion}
                </span>
              </p>
              <p>
                Cliente: {" "}
                <span className="text-gray-600 font-normal sm:text-center block sm:inline">
                  {(historial?.cliente_id?.nombre && historial?.cliente_id?.apellido)
                    ? `${historial.cliente_id.nombre} ${historial.cliente_id.apellido}`
                    : "Pendiente"}
                </span>
              </p>

              <p>
                Sesión nº: {" "}
                <span className="text-gray-600 font-normal sm:text-center block sm:inline">
                  {historial.nroSesion || "Pendiente"}
                </span>
              </p>

              <p>
                Localidad / Barrio: {" "}
                <span className="text-gray-600 font-normal sm:text-center sm:py-1 block sm:inline">
                  {(historial?.localidad_servicio)
                    ? `${historial.localidad_servicio}`
                    : "Pendiente"}
                </span>
              </p>

              <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                Dirección de reserva
              </p>
              <p className="text-base leading-normal text-gray-600">

                {historial?.direccion_servicio && historial?.adicional_direccion_servicio
                  ? `${historial.direccion_servicio} ${historial.adicional_direccion_servicio}`
                  : "Pendiente"}
              </p>

              <div>
                {historial?.servicios?.map((servicio) => (
                  <div key={servicio._id} className="flex md:flex-col items-center md:mb-4">
                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mx-auto mb-2 md:mb-0">
                      <img
                        src={servicio?.img}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="md:mt-0 mt-4 text-center ml-1">
                      <p className="text-base leading-none text-gray-600 py-1 ml-1 mr-1">
                        {servicio?.nombre}
                      </p>
                      <p className="text-base leading-none text-gray-600 mt-4">
                        Cantidad: {servicio?.cantidad ? servicio?.cantidad : 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                Estado del Pago
              </p>
              <p className="text-base leading-normal text-gray-600">
                Estado del Pago:  {historial.factura?.estadoPago || "Pendiente"}
                <br />
              </p>
              {/* COLOR DE LA ORDEN */}
              <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                Estado de la Orden
              </p>
              <p className={`text-base leading-normal ${getEstadoClase(estadoServicio)}`}>
                {estadoServicio || "Pendiente"}
                <br />
              </p>
              {/* COLOR DE LA ORDEN */}


              <div aria-label="delivery" className="">

                <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                  Día y Hora asignada:
                </p>
                <p className="text-base leading-normal text-gray-600">
                  Hora:  {historial?.hora_servicio || "Pendiente"}
                  <br />
                  Fecha: {historial?.cita_servicio || "Pendiente"}
                </p>



            


              </div>

            </div>
          </div>

          <p className="flex justify-center space-x-4 mt-4">
            Cuando hayas finalizado el servicio, agrega el comprobante de la firma de la sesión,{" "}
            guárdalo y completa la orden.
          </p>

            {/* Agregar la nueva opción de fecha de realización */}
          <div className="flex justify-center space-x-4 mt-4" >
            <div className="flex flex-col items-center md:flex-row md:items-start">
              <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                Agrega la fecha del servicio
              </p>
              <div className="md:flex-grow">
                <input
                  type="date"
                  value={fechaRealizacion}
                  onChange={(e) => setFechaRealizacion(e.target.value)}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />                        
              </div>
            </div>
            {/* fin fecha de realización */}
          </div>

            {/* Agregar la nueva opción de hora de realización */}
          <div className="flex justify-center space-x-4 mt-4" >
            <div className="flex flex-col items-center md:flex-row md:items-start">
              <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
                Agrega la hora del servicio
              </p>
              <div className="md:flex-grow">
                <select
                  type="time"
                  name="time"
                  id="time"
                  onChange={(e) => sethoraFechaRealizacion(e.target.value)}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <option value="">Hora</option>
                  {newHourArray?.map((hour, index) => (
                    <option key={index} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* fin hora de realización  */}

          </div>


          <form className="flex justify-center space-x-4 mt-4" onSubmit={(e) => e.preventDefault()}>
            <div className="w-full lg:w-6/12 px-4">
            <p className="flex justify-center space-x-4 mt-4"> Agrega el Comprobante de Firma. </p> 
              {loadingImage ? (
                <div className="p-4 flex justify-center">
                  <Spinner />
                </div>
              ) : !image ? (
                <>
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center mt-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 rounded">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="text-xs text-gray-500">SVG, PNG o JPG (MAX. 2MB)</p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleChangeImage}
                    />
                  </label>
                </>
              ) : (
                <div className="flex gap-6">
                  <LazyLoadImage
                    className="rounded mt-2"
                    effect="blur"
                    width="240"
                    height="240"
                    alt="Logo fondo trasparente"
                    src={image}
                  />
                  <div className="mt-1 flex items-center">
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                      onClick={(e) => setImage(null)}
                    >
                      X
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleUpdateOrder(estadoServicio)}
                className="text-white mt-4 mx-auto bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 max-lg:w-3/4 max-sm:w-full"
              >
                Guardar
              </button>

            </div>
          </form>

          
          <div className="flex justify-center space-x-4 mt-4">

               
      


            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleUpdateOrder("Completado")}
            >
              ORDEN COMPLETADA
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleUpdateOrder("Pendiente")}
            >
              ORDEN PENDIENTE
            </button>

      


          </div>

          {/* INICIO CHAT CON CLIENTE */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-1 md:p-1 shadow-lg">
            <header className="chat-header text-center">
              {/* <h1>Coordina los detalles de la Reserva!</h1> */}
            </header>
            {/* id es el id de la orden*/}
            <Chat id={id} />
          </div>
          {/* FIN CHAT CON CLIENTE */}
        </div>
      </div>
    </div>
  );

};

export default Sumary;