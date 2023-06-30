import React, { useEffect, useState } from "react";

import ScheduleByDateForm from "../components/ScheduleByDateForm";
import ScheduleByProfessionalForm from "../components/ScheduleByProfessionalForm";

import {
  BsCalendarDate,
  BsCardList,
  BsCreditCardFill,
  BsFillCreditCardFill,
} from "react-icons/bs";
import {
  FaClipboardCheck,
  FaHandSparkles,
  FaRegListAlt,
  FaSpa,
} from "react-icons/fa";
import { AiFillCaretLeft, AiOutlineShopping } from "react-icons/ai";
import Pages from "./Pages";
import Sumary from "./Sumary";
import { HiClipboardCheck, HiIdentification } from "react-icons/hi";
import { pasosReserva } from "../data";
import ServiceDetails from "../components/ReservatioSteps/ServiceDetails";
import Reservation from "../components/ReservatioSteps/Reservation";
import { useSelector } from "react-redux";
import clienteAxios from "../config/axios";
import swal from "sweetalert";
import { Navigate, useNavigate } from "react-router-dom";
// import swal from "sweetalert2";

const Service = () => {
  const [formDate, setFormDate] = useState(false);
  const [formProfessional, setFormProfessional] = useState(false);
  const [pago, setPago] = useState(false);
  const [sumary, setSumary] = useState([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const navigate = useNavigate();
  const [profile, setProfile] = useState([]);

  // useEffect(() => {
  //   JSON.parse(localStorage.getItem("profile")) &&
  //     setProfile(JSON.parse(localStorage.getItem("profile")));
  // }, [currentStep]);

  useEffect(() => {
    JSON.parse(localStorage.getItem("profile")) &&
      setProfile(JSON.parse(localStorage.getItem("profile")));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      JSON.parse(localStorage.getItem("profile")) &&
        setProfile(JSON.parse(localStorage.getItem("profile")));
    }, 3500);

    // Limpiar el temporizador cuando el componente se desmonte o cuando el valor de currentStep cambie
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    try {
      const getUser = async () => {
        try {
          // console.log(profile, "ESTE ES EL PERFIL DENTRO DEL USE EFECT");
          console.log(profile)
          if (!profile.email) {
            return console.log("Ups, algo no salio como se esperaba");
          }
          let { data } = await clienteAxios.get(
            `api/usuarios/perfil/${profile._id}`
          );
          if (!("telefono" in data) || !("cedula" in data)) {
            // console.log("no existe eso padre");
            swal(
              "Para que recibas el mejor servicio Por favor, bríndanos tu teléfono y cédula. ¡Gracias!",
              "",
              "info"
            );
            navigate("/ajustes");
          }
        } catch (err) {
          let error = err.response.data.msg
            ? err.response.data.msg
            : err.response && "Estamos presentando problemas internos";
          return toast.error(error);
        }
      };

      getUser();
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  }, [profile]);

  // console.log(profile, "ESTE ES EL PERFIL");

  return (
    <div className="mx-auto p-8 flex gap-4 3xl:gap-8 bg-white max-md:w-screen flex-wrap items-center justify-center">
      <div className="bg-white rounded shadow-lg p-4  px-4 md:p-8 mb-6 w-4/5 max-md:w-full">
        <div>
          <h3 className="mb-2 text-3xl font-semibold text-center leading-none text-gray-900">
            {pasosReserva[currentStep - 1]}
          </h3>
          <p className="text-xl font-normal text-center">
            Si tu servicio seleccionado no se encuentra en nuestro carrito de
            compras, no te preocupes 😉, agenda mediante alguna de nuestras
            asesoras mediante
            <a
              href="https://api.whatsapp.com/send/?phone=573242118509&text&type=phone_number&app_absent=0"
              className="ml-1 text-whatsapp "
            >
              Whatsapp.
            </a>
          </p>
        </div>
        {currentStep == "1" && (
          <ServiceDetails
            currentStep={currentStep}
            pasosReserva={pasosReserva}
            setComplete={setComplete}
            setCurrentStep={setCurrentStep}
          />
        )}
      </div>
    </div>
  );
};

export default Service;

// import React, { useEffect, useState } from "react";

// import ScheduleByDateForm from "../components/ScheduleByDateForm";
// import ScheduleByProfessionalForm from "../components/ScheduleByProfessionalForm";

// import {
//   BsCalendarDate,
//   BsCardList,
//   BsCreditCardFill,
//   BsFillCreditCardFill,
// } from "react-icons/bs";
// import {
//   FaClipboardCheck,
//   FaHandSparkles,
//   FaRegListAlt,
//   FaSpa,
// } from "react-icons/fa";
// import { AiFillCaretLeft, AiOutlineShopping } from "react-icons/ai";
// import Pages from "./Pages";
// import Sumary from "./Sumary";
// import { HiClipboardCheck, HiIdentification } from "react-icons/hi";
// import { pasosReserva } from "../data";
// import ServiceDetails from "../components/ReservatioSteps/ServiceDetails";
// import Reservation from "../components/ReservatioSteps/Reservation";

// const Service = () => {
//   const [formDate, setFormDate] = useState(false);
//   const [formProfessional, setFormProfessional] = useState(false);
//   const [pago, setPago] = useState(false);
//   const [sumary, setSumary] = useState([]);

//   const [currentStep, setCurrentStep] = useState(1);
//   const [complete, setComplete] = useState(false);

//   return (
//     <div className="mx-auto p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center">
//       <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-4/5">

//         <div>
//           <h3 className="mb-2 text-3xl font-semibold text-center leading-none text-gray-900">
//             {pasosReserva[currentStep - 1]}
//           </h3>
//           <p className="text-xl font-normal text-center">Si tu servicio seleccionado no se encuentra en nuestro carrito de compras, no te preocupes 😉, agenda mediante alguna de nuestras asesoras mediante
//           <a
//         href="https://api.whatsapp.com/send/?phone=573147428757&text&type=phone_number&app_absent=0"
//         className="ml-1 text-whatsapp "
//       >
//        Whatsapp.

//       </a>
//           </p>
//         </div>

//         {currentStep == "1" && (
//           <ServiceDetails
//             currentStep={currentStep}
//             pasosReserva={pasosReserva}

//             setComplete={setComplete}
//             setCurrentStep={setCurrentStep}
//           />
//         )}

//         {/* {!formDate && !formProfessional && !pago && !sumary ? (
//           <div className="container mx-auto">
//             <p className="text-center my-4">Tenemos dos opciones para ti</p>

//             <div style={{ backgroundColor: "rgb(255, 255, 255)" }}>
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 cursor-pointer">
//                 <div
//                   className="p-6 bg-gray-100 rounded-lg text-center"
//                   onClick={() => setFormDate(!formDate)}
//                 >
//                   <div className="mb-5">
//                     <BsCalendarDate className="hi-outline hi-template inline-block w-12 h-12 text-primary" />
//                   </div>

//                   <h3 className="text-lg font-bold mb-2">
//                     1. Selecciona por fecha
//                   </h3>

//                   <p className="text-sm leading-6 text-gray-600">
//                     Se te dispondrá las profesionales que estén disponibles en
//                     la fecha y hora que selecciones.
//                   </p>
//                 </div>

//                 <div
//                   className="p-6 bg-gray-100 rounded-lg text-center"
//                   onClick={() => setFormProfessional(!formProfessional)}
//                 >
//                   <div className="mb-5">
//                     <FaHandSparkles className="hi-outline hi-template inline-block w-12 h-12 text-primary" />
//                   </div>

//                   <h3 className="text-lg font-bold mb-2">
//                     2. Selecciona por profesional
//                   </h3>

//                   <p className="text-sm leading-6 text-gray-600">
//                     Podrás seleccionar la profesional de tu preferencia.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <button
//             onClick={handleForms}
//             type="button"
//             className="my-6 block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-2 border border-gray-300"
//           >
//             <div className="flex items-center justify-center">
//               <AiFillCaretLeft />
//               <span className="ml-2">Volver</span>
//             </div>
//           </button>
//         )} */}
//         {/* {formDate && (
//         <ScheduleByDateForm handleButtonMetodoPago={handleButtonMetodoPago} />
//       )}
//       {formProfessional && <ScheduleByProfessionalForm />}
//       {pago && <Pages handleButtonSumary={handleButtonSumary} />}
//       {sumary && <Sumary />} */}
//       </div>
//     </div>
//   );
// };

// export default Service;
