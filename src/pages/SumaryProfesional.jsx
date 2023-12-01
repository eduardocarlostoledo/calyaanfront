import React, { useEffect, useState } from "react";
import { ImWhatsapp } from "react-icons/im";
import { NumericFormat } from "react-number-format";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";
import Chat from "./private/professional/Chat";

const Sumary = () => {
  const { id } = useParams();
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const getHistorial = async () => {
      try {
        let { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);
        setHistorial(data);
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
    <div className="container mx-auto p-4 md:p-8 flex gap-4 3xl:gap-8 bg-white flex-wrap items-center justify-center">
      <div className="bg-white rounded shadow-lg p-4 md:p-8 mb-6 w-full lg:w-4/5">
<div className="mx-auto p-2 md:p-4 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center">
          <p className="text-2xl md:text-4xl text-center font-semibold leading-9 text-gray-800">
            ¡Contamos contigo para brindar el mejor servicio!
          </p>
          <div className="mx-auto">
            <div className="mt-8">
              <p className="text-base md:text-xl text-gray-800 leading-tight font-medium">
                Número de orden:{" "}
                <span className="text-gray-600 font-normal">
                  {" "}
                  {historial._id}
                </span>
              </p>
              <p className="text-base md:text-xl text-gray-800 leading-tight font-medium mt-6">
                Fecha de reserva:{" "}
                <span className="text-gray-600 font-normal">
                  {" "}
                  {historial?.cita_servicio} - {historial?.hora_servicio}{" "}
                </span>
              </p>

              <div className="flex gap-4 mt-6">
                <p className="text-base md:text-xl font-medium leading-normal text-gray-800">
                  Cliente
                </p>
                <span className="list-disc">
                  {historial?.cliente_id?.nombre || "Pendiente"}
                </span>
              </div>
            </div>
          </div>
          <hr className="mt-6" />

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
            <div>
              <p className="text-xl md:text-2xl font-semibold leading-normal text-gray-800">
                Detalle del Paquete
              </p>

              <div className="flex flex-col md:flex-row md:gap-4 mt-6">
                {historial?.servicios?.map((servicio) => (
                  <div key={servicio._id} className="flex md:flex-col items-center">
                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={servicio?.img}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
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
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold leading-normal text-gray-800 ">
                Detalles de reserva
              </p>

              <div aria-label="delivery" className="mt-6">
                <p className="text-base font-semibold leading-none text-gray-800">
                  Estado del Pago
                </p>
                <p className="text-base leading-normal text-gray-600">
                  Estado del Pago: {historial.factura?.estadoPago || "Pendiente"}
                </p>

                <p className="text-base font-semibold leading-none text-gray-800 mt-6">
                  Dirección de reserva
                </p>
                <p className="text-base leading-normal text-gray-600">
                  {historial?.direccion_servicio || "Pendiente"}
                </p>
                <p className="text-base font-semibold leading-none text-gray-800 mt-6">
                  Día y Hora asignada
                </p>
                <p className="text-base leading-normal text-gray-600">
                  Hora: {historial?.hora_servicio || "Pendiente"}
                  <br />
                  Fecha: {historial?.cita_servicio || "Pendiente"}
                </p>
              </div>
              <div className="mt-6">
                <p className="text-base mb-4 font-semibold leading-none text-gray-800 ">
                  Tienes dudas? Habla con nosotros a través de Whatsapp!{" "}
                </p>
                <a
                  href={`https://web.whatsapp.com/send/?phone=573147428757&text${id}&type=phone_number&app_absent=0`}
                  className="flex bg-whatsapp border border-gray-300 mt-6 p-5 w-full justify-center py-3 gap-2 items-center"
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
          <hr className="mt-6" />
          <p className="text-xl md:text-2xl font-medium leading-normal text-gray-800 mt-6">
            Total de la reserva
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="mt-4">
              <p className="text-base font-semibold leading-none text-gray-800">
                Costo de Servicio
              </p>
              <p className="text-base font-semibold leading-none text-gray-800">
                <NumericFormat
                  value={historial?.factura?.precioSubTotal}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </p>
            </div>

            <div className="mt-4">
              <p className="text-base font-semibold leading-none text-gray-800">
                Costo por Sesión
              </p>
              <p className="text-base font-semibold leading-none text-gray-800">
                <NumericFormat
                  value={historial?.factura?.precioTotal}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </p>
            </div>
          </div>

          <p className="text-base leading-normal text-gray-600 mt-4">
            Apreciamos su compra y esperamos que disfrute de su servicio ¡Gracias!
          </p>

          <p className="text-base text-gray-600 leading-none mt-8">
            ¿Preguntas? Revisa{" "}
            <span className="text-gray-800 font-semibold hover:underline cursor-pointer">
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
      {/* INICIO CHAT CON CLIENTE */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-1 md:p-1 shadow-lg">
        <header className="chat-header text-center">
          <h1>Coordina los detalles de la Reserva!</h1>
        </header>
        {/* id es el id de la orden*/}
        <Chat id={id} />
      </div>
      {/* FIN CHAT CON CLIENTE */}
    </div>
  );
};

export default Sumary;


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