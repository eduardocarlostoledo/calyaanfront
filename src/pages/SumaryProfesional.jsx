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

const Sumary = () => {
  const { id } = useParams();
  const [historial, setHistorial] = useState([]);
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [estadoServicio, setEstadoServicio] = useState(null);

  useEffect(() => {
    const getHistorial = async () => {
      try {
        const { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);
        setHistorial(data);
        setEstadoServicio(data.estado_servicio);
        setImage(data.registroFirmaCliente)
      } catch (error) {
        handleAxiosError(error);
      }
    };
    getHistorial();
  }, [id, estadoServicio]);

  const handleUpdateOrder = async (estado) => {
    try {
      const response = await clienteAxios.post(`/api/ordenes/updateorderbyprofesional/`, {
        id,
        estado,
        registroFirmaCliente: image,
      });
      setEstadoServicio(response.data.estado_servicio);
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

  console.log("IMAGE", image)


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
                  {historial?.cita_servicio} - {historial?.hora_servicio}
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
    
          <p style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
  Cuando hayas finalizado el servicio, agrega el comprobante de la firma de la sesión,{" "}
  guárdalo y completa la orden.

</p>

          <form className="flex justify-center space-x-4 mt-4" onSubmit={(e) => e.preventDefault()}>
              <div className="w-full lg:w-6/12 px-4">
                <label className="mb-2">Agrega el Comprobante de Firma.</label>
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
                  onClick={() => handleUpdateOrder("Completado")}
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

//version de chat
// import React, { useEffect, useState } from "react";
// import { ImWhatsapp } from "react-icons/im";
// import { NumericFormat } from "react-number-format";
// import { Link, useParams } from "react-router-dom";
// import clienteAxios from "../config/axios";
// import { toast } from "react-toastify";
// import Chat from "./private/professional/Chat";
// import Spinner from "../components/Spinner";
// import { LazyLoadImage } from "react-lazy-load-image-component";

// const Sumary = () => {
//   const { id } = useParams();
//   const [historial, setHistorial] = useState([]);
//   const [image, setImage] = useState(null);
//   const [loadingImage, setLoadingImage] = useState(false);

//   useEffect(() => {
//     const getHistorial = async () => {
//       try {
//         let { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);
//         setHistorial(data);
//       } catch (error) {
//         console.log(error);
//         const errorMsg =
//           error.response?.data?.msg || "Estamos presentando problemas internos";
//         toast.error(errorMsg);
//       }
//     };
//     getHistorial();
//   }, [id]);

//   const handleUpdateOrder = async (estado) => {
//     try {
//       const response = await clienteAxios.post(`/api/ordenes/updateorderbyprofesional/`, {
//         id,
//         estado,
//         registroFirmaCliente : image,
//       });
//       toast.success(response.data.msg);
//       // Actualizar el estado local o realizar otras acciones si es necesario
//     } catch (error) {
//       console.error("Error al actualizar la orden:", error);
//       const errorMsg =
//         error.response?.data?.msg || "Error al actualizar la orden";
//       toast.error(errorMsg);
//     }
//   };

//   const handleChangeImage = async (e) => {
//     try {
//       setLoadingImage(true);
//       const formData = new FormData();
//       formData.append("upload_preset", `${e.target.files[0].name}`);
//       formData.append("file", e.target.files[0], "form-data");

//       let { data } = await clienteAxios.post(`/api/uploads/file`, formData);

//       setLoadingImage(false);
//       setImage(data.imageURL);
//       toast.success(data.msg);
//     } catch (err) {
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   console.log("IMAGE", image)
 

//   //console.log(historial);
//   return (
//     // <div className="container mx-auto p-2 sm:p-1 flex flex-wrap items-center justify-center">
//     //   <div className="bg-white rounded shadow-lg p-1 md:p-8 mb-6 w-full lg:w-4/5 sm:mb-12 md:mb-8">
//     //     <div className="mx-auto p-2 md:p-4 sm:my-0 flex gap-1 3xl:gap-8 bg-white full-screen flex-wrap items-center justify-center">
// <div className="text-center py-1">

// <p className="text-xl md:text-2xl font-semibold leading-normal text-gray-800 ">
//                 Detalles de reserva
//               </p>
//   <div>
//     <div>
        
//           <div className="mx-auto text-center">
//             <div className="mt-1 text-center">
//               <p>
//                 Número de orden:{" "}
//                 <span className="text-gray-600 font-normal sm:text-center block sm:inline">
//                   {historial._id}
//                 </span>
//               </p>
//               <p>
//                 Día y Hora:{" "}
//                 <span className="text-gray-600 font-normal sm:text-center block sm:inline">
//                   {historial?.cita_servicio} - {historial?.hora_servicio}
//                 </span>
//               </p>
//               <p>
//                 Cliente: {" "}
//                 <span className="text-gray-600 font-normal sm:text-center block sm:inline">
//                   {(historial?.cliente_id?.nombre && historial?.cliente_id?.apellido)
//                     ? `${historial.cliente_id.nombre} ${historial.cliente_id.apellido}`
//                     : "Pendiente"}
//                 </span>
//               </p>

//               <p>
//                 Sesión nº: {" "}
//                 <span className="text-gray-600 font-normal sm:text-center block sm:inline">
//                 {historial.nroSesion || "Pendiente"}
//                 </span>
//               </p>

//               <p>
//                 Localidad / Barrio: {" "}
//                 <span className="text-gray-600 font-normal sm:text-center sm:py-1 block sm:inline">
//                 {(historial?.localidad_servicio)
//                     ? `${historial.localidad_servicio}`
//                     : "Pendiente"}
//                 </span>
//               </p>

//               <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
//                      Dirección de reserva
//                    </p>
//                    <p className="text-base leading-normal text-gray-600">
                   
//                    {historial?.direccion_servicio && historial?.adicional_direccion_servicio
//   ? `${historial.direccion_servicio} ${historial.adicional_direccion_servicio}`
//   : "Pendiente"}

// </p>

// <div>
//   {historial?.servicios?.map((servicio) => (
//     <div key={servicio._id} className="flex md:flex-col items-center md:mb-4">
//       <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mx-auto mb-2 md:mb-0">
//         <img
//           src={servicio?.img}
//           alt=""
//           className="h-full w-full object-cover object-center"
//         />
//       </div>
//       <div className="md:mt-0 mt-4 text-center ml-1">
//         <p className="text-base leading-none text-gray-600 py-1 ml-1 mr-1">
//           {servicio?.nombre}
//         </p>       
//         <p className="text-base leading-none text-gray-600 mt-4">
//           Cantidad: {servicio?.cantidad ? servicio?.cantidad : 1}
//         </p>
//       </div>
//     </div>
//   ))}
// </div>


       

//               <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
//                      Estado del Pago
//                    </p>
//                    <p className="text-base leading-normal text-gray-600">
//                      Estado del Pago:  {historial.factura?.estadoPago || "Pendiente"}
//                      <br />                    
//                    </p>
//                  <div aria-label="delivery" className="">
                   
//                    <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
//                      Día y Hora asignada:
//                    </p>
//                    <p className="text-base leading-normal text-gray-600">
//                      Hora:  {historial?.hora_servicio || "Pendiente"}
//                      <br />
//                      Fecha: {historial?.cita_servicio || "Pendiente"}
//                    </p>
//                  </div>

            
//               {/* <div className="grid md:grid-cols-2 gap-8">
//                 <div className="mt-4">
//                   <p className="text-xl md:text-2xl font-medium leading-normal text-gray-800 mt-6">
//                 Total de la reserva
//               </p>

//                   <p className="text-base font-semibold leading-none text-gray-800">
//                     Costo de Servicio
//                   </p>
//                   <p className="text-base font-semibold leading-none text-gray-800">
//                     <NumericFormat
//                       value={historial?.factura?.precioSubTotal}
//                       displayType={"text"}
//                       thousandSeparator={true}
//                       prefix={"$"}
//                     />
//                   </p>
//                 </div>
//                 <p className="text-base leading-normal text-gray-600 mt-4">
//                   Apreciamos su compra y esperamos que disfrute de su servicio ¡Gracias!
//                 </p>
//                 <p className="text-base text-gray-600 leading-none mt-8">
//                   ¿Preguntas? Revisa{" "}
//                   <span className="text-gray-800 font-semibold hover:underline cursor-pointer">
//                     Nuestras preguntas frecuentes
//                   </span>
//                 </p>
//                 <p className="text-base text-gray-600 mt-4">
//                   ¿Preguntas? Póngase en contacto con nuestro {" "}
//                   <span className="text-gray-800 font-semibold hover:underline cursor-pointer">
//                     Atención al cliente
//                   </span>
//                 </p>
//               </div> */}
//             </div>
//           </div>

//           <div className="flex justify-center space-x-4 mt-4">
//         <button
//           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//           onClick={() => handleUpdateOrder("Completada")}
//         >
//           ORDEN FINALIZADA
//         </button>
//         <button
//           className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
//           onClick={() => handleUpdateOrder("Pendiente")}
//         >
//           ORDEN PENDIENTE
//         </button>

//         <form className="flex flex-wrap" onSubmit={handleUpdateOrder("Completada")}>
//                   <div className="w-full lg:w-6/12 px-4">                    

//                     <label className="mb-2"> Comprobante Firma </label>
//                     {loadingImage ? (
//                       <div className="p-4 flex justify-center">
//                         <Spinner />
//                       </div>
//                     ) : !image ? (
//                       <>
//                         <label
//                           htmlFor="dropzone-file"
//                           className="flex flex-col items-center justify-center mt-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100"
//                         >
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6 rounded">
//                             <svg
//                               aria-hidden="true"
//                               className="w-10 h-10 mb-3 text-gray-400"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                               ></path>
//                             </svg>
//                             <p className="text-xs text-gray-500 ">
//                               SVG, PNG o JPG (MAX. 2MB)
//                             </p>
//                           </div>
//                           <input
//                             id="dropzone-file"
//                             type="file"
//                             className="hidden"
//                             onChange={handleChangeImage}
//                           />
//                         </label>
//                       </>
//                     ) : (
//                       <div className="flex gap-6">
//                         <LazyLoadImage
//                           className="rounded mt-2"
//                           effect="blur"
//                           width="240"
//                           height="240"
//                           alt="Logo fondo trasparente"
//                           src={image}
//                         />
//                         <div className="mt-1 flex  items-center ">
//                           <button
//                             type="button"
//                             className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
//                             onClick={(e) => setImage(null)}
//                           >
//                             Eliminar
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     <button type="submit" className="text-white mt-4 mx-auto bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 max-lg:w-3/4 max-sm:w-full">
//                       Guardar
//                     </button>

//                   </div>
//                 </form>


//       </div>


//           {/* INICIO CHAT CON CLIENTE */}
//           <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-1 md:p-1 shadow-lg">
//             <header className="chat-header text-center">
//               {/* <h1>Coordina los detalles de la Reserva!</h1> */}
//             </header>
//             {/* id es el id de la orden*/}
//             <Chat id={id} />
//           </div>
//           {/* FIN CHAT CON CLIENTE */}
//         </div>
//       </div>
//     </div>
//   );

// };

// export default Sumary;
//version vieja
// import React, { useEffect, useState } from "react";
// import { ImWhatsapp } from "react-icons/im";
// import { NumericFormat } from "react-number-format";
// import { Link, useParams } from "react-router-dom";
// import clienteAxios from "../config/axios";
// import { toast } from "react-toastify";
// import Chat from "./private/professional/Chat";

// const Sumary = () => { 

//   const { id } = useParams();

//   const [historial, setHistorial] = useState([]);

//   useEffect(() => {
//     const getHistorial = async () => {
//       try {
//         let { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);
//         setHistorial(data);
//       } catch (error) {
//         console.log(error);
//         const errorMsg =
//           error.response?.data?.msg || "Estamos presentando problemas internos";
//         toast.error(errorMsg);
//       }
//     };
//     getHistorial();
//   }, [id]);

//   return (
//     <div className="mx-auto p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center">
//       <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-4/5">
//         <div className="lg:max-w-[1440px] md:max-w-[744px] max-w-[373px] lg:px-10 md:px-6 px-4 py-12 bg-white mx-auto">
//           <div className="lg:max-w-[1063px] w-full mx-auto">
//             <p className="lg:text-4xl text-3xl text-center font-semibold leading-9 text-gray-800">
//               ¡Contamos contigo para brindar el mejor servicio!
//             </p>
//             <div className="lg:max-w-[1063px] w-full mx-auto">
//               <div className="lg:flex justify-between gap-4 mt-8">
//                 <p className="md:text-xl text-base text-gray-800 leading-tight font-medium">
//                   Número de orden:{" "}
//                   <span className="text-gray-600 font-normal">
//                     {" "}
//                     {historial._id}
//                   </span>
//                 </p>
//                 <p className="md:text-xl text-base text-gray-800 leading-tight font-medium lg:mt-0 md:mt-6 mt-6">
//                   Fecha de reserva:{" "}
//                   <span className="text-gray-600 font-normal">
//                     {" "}
//                     {historial?.cita_servicio} - {historial?.hora_servicio}{" "}
//                   </span>
//                 </p>

//                 <div className="flex md:gap-8 gap-4">
//                   <p className="md:text-xl text-base font-medium leading-normal text-gray-800 lg:mt-0 md:mt-6 mt-6">
//                     Cliente
//                   </p>
//                   <span className="list-disc">
//                     {historial?.cliente_id?.nombre || "Pendiente"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <hr className="mt-6" />

//             <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8">
//               <div>
//                 <p className="text-2xl font-semibold leading-normal text-gray-800">
//                   Detalle del Paquete
//                 </p>

//                 <div className="lg:flex gap-4 justify-between">
//                   <div className="md:flex gap-4 mt-6">
//                     {historial?.servicios?.map((servicio) => (
//                       <div key={servicio._id}>
//                         <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
//                           <img
//                             src={servicio?.img}
//                             alt=""
//                             className="h-full w-full object-cover object-center"
//                           />
//                         </div>
//                         <div className="md:mt-0 mt-4">
//                           <p className="text-base leading-none text-gray-600">
//                             {servicio?.nombre}
//                           </p>
//                           <p className="text-base font-semibold leading-none text-gray-800 mt-4">
//                             <NumericFormat
//                               value={servicio?.precio}
//                               displayType={"text"}
//                               thousandSeparator={true}
//                               prefix={"$"}
//                             />
//                           </p>
//                           <p className="text-base leading-none text-gray-600 mt-4">
//                             Cantidad {servicio?.cantidad ? servicio?.cantidad : 1}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 {/* <div className="lg:flex gap-4 justify-between">
//                   <div className="md:flex gap-4 mt-6">
//                     {
//                       historial?.servicios?.map((servicio) => (
//                         <>
//                           <div >
//                             <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
//                               <img
//                                 src={servicio?.img}
//                                 alt=""
//                                 className="h-full w-full object-cover object-center"
//                               />
//                             </div>
//                           </div>
//                           <div className="md:mt-0 mt-4">
//                             <p className="text-base leading-none text-gray-600">
//                               {servicio?.nombre}
//                             </p>
//                             <p className="text-base font-semibold leading-none text-gray-800 mt-4">
//                               <NumericFormat
//                                 value={servicio?.precio}
//                                 displayType={"text"}
//                                 thousandSeparator={true}
//                                 prefix={"$"}
//                               />
//                             </p>
//                             <p className="text-base leading-none text-gray-600 mt-4">
//                               Cantidad {servicio?.cantidad ? servicio?.cantidad : 1}
//                             </p>
//                           </div>
//                         </>
//                       ))
//                     }
//                   </div>
//                 </div> */}
//               </div>
//               <div>
//                 <p className="text-2xl font-semibold leading-normal text-gray-800 ">
//                   Detalles de reserva
//                 </p>

//                 <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
//                     Estado del Pago
//                   </p>
//                   <p className="text-base leading-normal text-gray-600">
//                     Estado del Pago:  {historial.factura?.estadoPago || "Pendiente"}
//                     <br />                    
//                   </p>

//                 <div aria-label="delivery" className="">
//                   <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
//                     Dirección de reserva
//                   </p>
//                   <p className="text-base leading-normal text-gray-600">
                    
//                     {historial?.direccion_servicio || "Pendiente"}                  </p>
//                   <p className="pt-4 text-base font-semibold leading-none text-gray-800 lg:mb-3 md:mb-4">
//                     Día y Hora asignada
//                   </p>
//                   <p className="text-base leading-normal text-gray-600">
//                     Hora:  {historial?.hora_servicio || "Pendiente"}
//                     <br />
//                     Fecha: {historial?.cita_servicio || "Pendiente"}
//                   </p>
//                 </div>
//                 <div className="mt-4">
//                   <p className="mb-4 text-base font-semibold leading-none text-gray-800 ">
//                     Tienes dudas? Habla con nosotros a través de Whatsapp! {" "}
//                   </p>
//                   <a
                  
//                   href={`https://web.whatsapp.com/send/?phone=573147428757&text${id}&type=phone_number&app_absent=0`}
                  
//                   className="flex border bg-whatsapp   mt-6 p-5 border-gray-300 lg:max-w-[296px] w-full justify-center py-3 gap-2 items-center"
//                   target="_blank"
//                 >
//                     <p className="text-base font-medium leading-none text-white">
//                       Consultas
//                     </p>
//                     <ImWhatsapp className="w-4 h-4 text-white" />
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <hr className="mt-6" />
//           <p className="text-2xl font-medium leading-normal text-gray-800 mt-6">
//             Total de la reserva
//           </p>
//           <div className="gap-4 justify-between">
//             <div className="lg:max-w-[405px]">
//               <div className="flex justify-between mt-4">
//                 <p className="text-base font-semibold leading-none text-gray-800">
//                   Costo de Servicio
//                 </p>
//                 <p className="text-base font-semibold leading-none text-gray-800">
//                   <p>
//                     <NumericFormat
//                       value={historial?.factura?.precioSubTotal}
//                       displayType={"text"}
//                       thousandSeparator={true}
//                       prefix={"$"}
//                     />
//                   </p>                                    
//                 </p>                

//               </div>
//             </div>

//             <div className="lg:max-w-[405px]">
//               <div className="flex justify-between mt-4">
//                 <p className="text-base font-semibold leading-none text-gray-800">
//                   Costo por Sesión
//                 </p>
//                 <p className="text-base font-semibold leading-none text-gray-800">
//                   <p>
//                     <NumericFormat
//                       value={historial?.factura?.precioTotal}
//                       displayType={"text"}
//                       thousandSeparator={true}
//                       prefix={"$"}
//                     />
//                   </p>                                    
//                 </p>                

//               </div>
//             </div>


//             <div className="lg:mt-2 md:mt-6 mt-4">
//               <p className="text-base leading-normal text-gray-600 lg:max-w-[515px] w-full">
//                 Apreciamos su compra y esperamos que disfrute de su servicio
//                 ¡Gracias!
//               </p>

//               <p className="text-base text-gray-600 leading-none mt-8">
//                 ¿Preguntas? Revisa 
//                 <span className="text-gray-800 font-semibold hover:underline cursor-pointer mt-2">
//                 {" "}Nuestras preguntas frecuentes
//                 </span>
//               </p>
//               <p className="text-base text-gray-600 mt-4">
//                 ¿Preguntas? Póngase en contacto con nuestro 
//                 <span className="text-gray-800 font-semibold hover:underline cursor-pointer">
//                    {" "}Atención al cliente
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
// {/* INICIO CHAT CON CLIENTE */}
// <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-4 md:p-8 shadow-lg">
//   <header className="chat-header">
//     <h1>Chatea con Nosotros!</h1>
//   </header>
//   {/* id es el id de la orden*/}
//   <Chat id={id} />
// </div>
// {/* FIN CHAT CON CLIENTE */}
      
//     </div>
//   );
// };

// export default Sumary;