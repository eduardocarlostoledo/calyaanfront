import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
//import { hourSelect } from "../data";
import limpiarHorarios from "../helpers/Logic/limpiarHorarios";
import Spinner from "./Spinner";
import { set } from "date-fns";

const ScheduleByProfessionalForm = () => {
  const [inputValue, setInputValue] = useState({
    address: "",
    date: "",
    time: "",
  });

  localStorage.setItem("DateService", JSON.stringify(inputValue));

  const [pagar, setPagar] = useState(false);
  const [profesional, setProfesional] = useState({});

  const [cargando, setCargando] = useState(false);

  const [profesionalesRequest, setProfesionalesRequest] = useState([]);

  const [hourSelect, setHoursSelect] = useState([]); // mapea la disponibilidad.horarios del profesional

  const handleProfesional = (profesional) => {
    const updatedArray = profesionalesRequest.map((obj) =>
      obj._id === profesional._id
        ? { ...obj, styles: true }
        : { ...obj, styles: false }
    );

    setProfesionalesRequest(updatedArray);
console.log("Updated Array", updatedArray)
    setProfesional(profesional);

  console.log("PROFESIONAL.HORARIOS",profesional.horarios)
  let horarios = profesional.horarios  

    setHoursSelect(limpiarHorarios(horarios));
    console.log("setHoursSelect HOURSELECT", hourSelect)
  };

  let { date, time } = inputValue;

  const handleChange = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });

    if (e.target.name == "time") {
      setPagar(true);
    }
  };

  useEffect(() => {
    const obtenerUsuarios = async () => {
      setCargando(true);
  
      try {
        let nombre = JSON.parse(localStorage.getItem("services"))
          ? JSON.parse(localStorage.getItem("services"))[0]?.nombre
          : "";
  
        let localidad = localStorage.getItem("localidad")
          ? localStorage.getItem("localidad")
          : "";
  
        const { data } = await clienteAxios.post(
          "api/reservas/profesionales/fecha",
          {
            fecha: date,
            especialidad: [nombre],
            localidad,
          }
        );
  
        console.log("useeffect", data);
  
        if (data && data.length > 0) {
          const updatedArray = data.map((obj) => ({ ...obj, styles: false }));
          setProfesionalesRequest(updatedArray);
        } else {
          setProfesionalesRequest(data || []);
        }
        setCargando(false);
      } catch (err) {
        console.log(err);
      }
    };
  
    obtenerUsuarios();
  }, [date]);

  
  // useEffect(() => {
  //   const obtenerUsuarios = async () => {
  //     setCargando(true);

  //     try {
  //       let nombre = JSON.parse(localStorage.getItem("services"))
  //         ? JSON.parse(localStorage.getItem("services"))[0]?.nombre
  //         : "";

  //       let localidad = localStorage.getItem("localidad")
  //         ? localStorage.getItem("localidad")
  //         : "";

  //       const { data } = await clienteAxios.post(
  //         "api/reservas/profesionales/fecha",
  //         {
  //           fecha: date,
  //           especialidad: [nombre],
  //           localidad,
  //         }
  //       );

  //       console.log(data);

  //       if (data?.length > 0) {
  //         const updatedArray = data.map((obj) => ({ ...obj, styles: false }));
  //         setProfesionalesRequest(updatedArray);
  //       } else {
  //         setProfesionalesRequest(data);
  //       }
  //       setCargando(false);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   obtenerUsuarios();
  // }, [date]);

  const handleSubmitProfessional = () => {
    localStorage.setItem("ProfessionalService", JSON.stringify(profesional));
  };
console.log("PROFESIONALREQUEST", profesionalesRequest)
  return (
    <>
      <div className="mx-auto p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-4/5">
          <div>
            <h3 className="mb-10 text-lg font-bold text-center leading-none text-gray-900">
              Agenda tu reserva por profesional
            </h3>
          </div>
          <form>
            <h4 className="mb-4 font-medium leading-none text-gray-900">
              Selecciona fecha y hora para tu reserva
            </h4>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5"
                  placeholder="username.example"
                  required=""
                />
              </div>
              {hourSelect.length > 0 && (
                <div>
                  <label
                    htmlFor="time"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Hora
                  </label>

                  <select
                    type="time"
                    name="time"
                    id="time"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5 "
                    required=""
                  >
                    <option value="">Horas</option>
                    {hourSelect?.map((hour, index) => (
                      <option key={index} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {date && (
              <div className="mx-auto mt-6 flex bg-whitefull-screen flex-wrap items-center justify-around">
                {!cargando ? (
                  profesionalesRequest.length > 0 ? (
                    profesionalesRequest.map((profesional) => (
                      <div
                      key={profesional._id} // Agregando la clave 'key'
                        className={`w-full max-w-sm rounded-lg shadow-md ${
                          profesional.styles &&
                          "bg-gray-100 border border-gray-200 "
                        }`}
                      >
                        <div className="flex flex-col items-center p-6">
                          <img
                            className="w-24 h-24 mb-3 rounded-full shadow-lg"
                            src={
                              profesional.creador.creador.img
                                ? profesional.creador.creador.img
                                : "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                            }
                          />
                          <h5 className="mb-1 text-xl font-medium text-gray-900">
                            {profesional.creador.creador.nombre}
                          </h5>
                          <span className="text-sm text-gray-500 text-center">
                            {profesional.creador.descripcion}
                          </span>
                          <span className="text-sm text-gray-500"></span>
                          <div className="flex mt-4 space-x-3 md:mt-6">
                            <div
                              onClick={() => handleProfesional(profesional)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover"
                            >
                              Seleccionar
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>{profesionalesRequest.msg}</>
                  )
                ) : (
                  <Spinner />
                )}
              </div>
            )}
          </form>
          {pagar && time && (
            <Link
              onClick={handleSubmitProfessional}
              type="submit"
              to="/pago"
              className="text-white mt-4 bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40"
            >
              Siguiente paso: información de pago
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ScheduleByProfessionalForm;


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import clienteAxios from "../config/axios";
// import { hourSelect } from "../data";
// import limpiarHorarios from "../helpers/Logic/limpiarHorarios";
// import Spinner from "./Spinner";

// const ScheduleByProfessionalForm = () => {
//   const [inputValue, setInputValue] = useState({
//     address: "",
//     date: "",
//     time: "",
//   });

//   localStorage.setItem("DateService", JSON.stringify(inputValue));

//   const [pagar, setPagar] = useState(false);
//   const [profesional, setProfesional] = useState({});

//   const [cargando, setCargando] = useState(false);

//   const [profesionalesRequest, setProfesionalesRequest] = useState([]);

//   const [hourSelect, setHoursSelect] = useState([]);

//   const handleProfesional = (profesional) => {
//     const updatedArray = profesionalesRequest.map((obj) =>
//       obj._id === profesional._id
//         ? { ...obj, styles: true }
//         : { ...obj, styles: false }
//     );

//     setProfesionalesRequest(updatedArray);
// console.log("Updated Array", updatedArray)
//     setProfesional(profesional);

// console.log(profesional.horarios)

//     setHoursSelect(limpiarHorarios(profesional.horarios));
//     console.log(limpiarHorarios(profesional.horarios))
//   };

//   let { date, time } = inputValue;

//   const handleChange = (e) => {
//     setInputValue({
//       ...inputValue,
//       [e.target.name]: e.target.value,
//     });

//     if (e.target.name == "time") {
//       setPagar(true);
//     }
//   };

//   useEffect(() => {
//     const obtenerUsuarios = async () => {
//       setCargando(true);

//       try {
//         let nombre = JSON.parse(localStorage.getItem("services"))
//           ? JSON.parse(localStorage.getItem("services"))[0]?.nombre
//           : "";

//         let localidad = localStorage.getItem("localidad")
//           ? localStorage.getItem("localidad")
//           : "";

//         const { data } = await clienteAxios.post(
//           "api/reservas/profesionales/fecha",
//           {
//             fecha: date,
//             especialidad: [nombre],
//             localidad,
//           }
//         );

//         console.log(data);

//         if (data?.length > 0) {
//           const updatedArray = data.map((obj) => ({ ...obj, styles: false }));
//           setProfesionalesRequest(updatedArray);
//         } else {
//           setProfesionalesRequest(data);
//         }
//         setCargando(false);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     obtenerUsuarios();
//   }, [date]);

//   const handleSubmitProfessional = () => {
//     localStorage.setItem("ProfessionalService", JSON.stringify(profesional));
//   };

//   return (
//     <>
//       <div className="mx-auto p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center">
//         <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-4/5">
//           <div>
//             <h3 className="mb-10 text-lg font-bold text-center leading-none text-gray-900">
//               Agenda tu reserva por profesional
//             </h3>
//           </div>
//           <form>
//             <h4 className="mb-4 font-medium leading-none text-gray-900">
//               Selecciona fecha y hora para tu reserva
//             </h4>
//             <div className="grid gap-4 mb-4 sm:grid-cols-2">
//               <div>
//                 <label
//                   htmlFor="date"
//                   className="block mb-2 text-sm font-medium text-gray-900"
//                 >
//                   Fecha
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   id="date"
//                   onChange={handleChange}
//                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5"
//                   placeholder="username.example"
//                   required=""
//                 />
//               </div>
//               {hourSelect.length > 0 && (
//                 <div>
//                   <label
//                     htmlFor="time"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Hora
//                   </label>

//                   <select
//                     type="time"
//                     name="time"
//                     id="time"
//                     onChange={handleChange}
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5 "
//                     required=""
//                   >
//                     <option value="">Horas</option>
//                     {hourSelect?.map((hour, index) => (
//                       <option key={index} value={hour}>
//                         {hour}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//             </div>

//             {date && (
//               <div className="mx-auto mt-6 flex bg-whitefull-screen flex-wrap items-center justify-around">
//                 {!cargando ? (
//                   profesionalesRequest.length > 0 ? (
//                     profesionalesRequest.map((profesional) => (
//                       <div
//                         className={`w-full max-w-sm rounded-lg shadow-md ${
//                           profesional.styles &&
//                           "bg-gray-100 border border-gray-200 "
//                         }`}
//                       >
//                         <div className="flex flex-col items-center p-6">
//                           <img
//                             className="w-24 h-24 mb-3 rounded-full shadow-lg"
//                             src={
//                               profesional.creador.creador.img
//                                 ? profesional.creador.creador.img
//                                 : "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
//                             }
//                           />
//                           <h5 className="mb-1 text-xl font-medium text-gray-900">
//                             {profesional.creador.creador.nombre}
//                           </h5>
//                           <span className="text-sm text-gray-500 text-center">
//                             {profesional.creador.descripcion}
//                           </span>
//                           <span className="text-sm text-gray-500"></span>
//                           <div className="flex mt-4 space-x-3 md:mt-6">
//                             <div
//                               onClick={() => handleProfesional(profesional)}
//                               className="inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover"
//                             >
//                               Seleccionar
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <>{profesionalesRequest.msg}</>
//                   )
//                 ) : (
//                   <Spinner />
//                 )}
//               </div>
//             )}
//           </form>
//           {pagar && time && (
//             <Link
//               onClick={handleSubmitProfessional}
//               type="submit"
//               to="/pago"
//               className="text-white mt-4 bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40"
//             >
//               Siguiente paso: información de pago
//             </Link>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleByProfessionalForm;
