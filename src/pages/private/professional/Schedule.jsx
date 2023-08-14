import React, { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ButtonSpinner from "../../../components/ButtonSpinner";
import getScheduleProfessional from "../../../helpers/Components/getScheduleProfessional";
import clienteAxios from "../../../config/axios";
import { createSchedule } from "../../../redux/features/professionalSlice";
import { deleteError } from "../../../redux/features/authSlice";
import { newHourArray } from "../../../data";

const dateCurrent = new Date();

// const dateCurrent = new Date(); // Obténemos la fecha y hora actual
// dateCurrent.setHours(dateCurrent.getHours() + 5); // Agrega 5 horas a la fecha actual por solicitud de comerciales para anticipar las visitas a domicilio

function verificarHorario(horario, arrayObjetos) {
  for (let i = 0; i < arrayObjetos.length; i++) {
    const objeto = arrayObjetos[i];
    const horas = objeto.hora.split("-"); // Divide el rango de horas en dos partes

    const horaInicio = horas[0].trim(); // Obtiene la hora de inicio sin espacios en blanco
    const horaFin = horas[1].trim(); // Obtiene la hora de fin sin espacios en blanco

    if (horario >= horaInicio && horario <= horaFin && objeto.stock) {
      return true; // El horario está dentro del objeto y hay stock disponible
    }
  }

  return false; // El horario no se encontró en ninguno de los objetos o no hay stock disponible
}

const Schedule = () => {
  const dispatch = useDispatch();

  const { loadingProfessional, errorProfessional } = useSelector((state) => ({
    ...state.professional,
  }));

  const [dateInput, setDateInput] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [horariosForm, setHorariosForm] = useState([]);

  useEffect(() => {
    errorProfessional && toast.error(errorProfessional);
    dispatch(deleteError());
  }, [errorProfessional]);

  const handleChangeHorarios = (e) => {
    if (
      !verificarHorario(e.target.value, horariosForm) &&
      e.target.value !== ""
    ) {
      setHorariosForm([...horariosForm, { hora: e.target.value, stock: true }]);
    }
    setHoraInicio(e.target.value.split("-")[0]);
    setHoraFin(e.target.value.split("-")[1]);
  };

  const eliminarHorario = (horario) => {
    setHorariosForm(
      horariosForm.filter((horarioState) => horarioState.hora !== horario)
    );
  };

  const onChangeInputDate = async (e) => {
    setHorariosForm([]);

    try {
      const { data } = await clienteAxios.get(
        `/api/profesional/${e.target.value}`
      );

      if (data) {
        let dataRequest = {
          horario: data.hora,
          date: data.fecha,
        };

        setDateInput(e.target.value);
        setHorariosForm(data.horarios);
      } else {
        setDateInput(e.target.value);
        setHorariosForm([]);
      }
    } catch (err) {
      let error = err.response?.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const scheduleData = getScheduleProfessional(horariosForm);

    const dataP = {
      fecha: dateInput,
      horaInicio,
      horaFin,
      horarios: horariosForm,
      scheduleData,
    };

    try {
      await clienteAxios.post(`/api/profesional`, dataP);
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }

    toast.success("Disponibilidad agregada");

    setHoraInicio("");
    setHoraFin("");
    setHorariosForm([]);
    setDateInput("");
  };

  return (
    <div className="flex items-center justify-center my-32 max-lg:my-12">
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-8 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="mb-4">
            <p className="font-medium text-xl mb-2">Horarios</p>
            <p className="text-gray-600 leading-loose">
              Selecciona tus horarios según tu disponibilidad.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-medium leading-none mb-2">
                  Selecciona tus horarios
                </h5>
              </div>

              <input
                type="date"
                onChange={onChangeInputDate}
                //se comenta para cambiar la agenda.
                // min={
                //   dateCurrent.toISOString().split("T")[0]
                // } /*para definir solamente reservas hacia adelante*/
                // max={
                //   dateCurrent.getFullYear() +
                //   "-0" +
                //   (dateCurrent.getMonth() + 2) +
                //   "-" +
                //   dateCurrent.getDate()
                // }
                className="w-full block bg-gray-100 border-gray-400 font-semibold rounded-lg px-4 py-3 mt-6"
              />

              {dateInput && (
                <section className="mt-6 ">
                  <h2 className="font-semibold text-gray-900">
                    Horario para{" "}
                    <time>
                      {format(addDays(new Date(dateInput), 1), "MMM dd, yyy", {
                        locale: es,
                      })}
                    </time>
                  </h2>
                  <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                    {
                      <div
                        id="accordion-collapse-body-1"
                        aria-labelledby="accordion-collapse-heading-1"
                      >
                        <form onSubmit={onSubmitForm}>
                          <select
                            id="disponibilidad"
                            className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none  block w-full p-2.5"
                            name="disponibilidad"
                            onChange={handleChangeHorarios}
                            value={`${horaInicio}-${horaFin}`}
                          >
                            <option value="">Disponibilidad</option>
                            {newHourArray.map((hora, index) => (
                              <option
                                key={index}
                                value={`${hora.horaInicio}-${hora.horaFin}`}
                              >
                                {`${hora.horaInicio} - ${hora.horaFin}`}
                              </option>
                            ))}
                          </select>

                          {horariosForm?.length > 0 && (
                            <div className="my-4 flex flex-wrap gap-4">
                              {horariosForm.map((horario, index) => (
                                <p
                                  key={index}
                                  className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
                                >
                                  {horario.hora}
                                  <AiFillCloseCircle
                                    className="ml-2"
                                    onClick={() =>
                                      eliminarHorario(horario.hora)
                                    }
                                  />
                                </p>
                              ))}
                            </div>
                          )}

                          {loadingProfessional ? (
                            <ButtonSpinner />
                          ) : (
                            <button
                              type="submit"
                              className="w-full block bg-primary hover:bg-bgHover focus:bg-bgHover text-white font-semibold rounded-lg px-4 py-3 mt-6"
                            >
                              Confirmar Horario
                            </button>
                          )}
                        </form>
                      </div>
                    }
                  </ol>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;

// import React, { useEffect, useState } from "react";
// import { addDays, format } from "date-fns";
// import { es } from "date-fns/locale";
// import { AiFillCloseCircle } from "react-icons/ai";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import ButtonSpinner from "../../../components/ButtonSpinner";
// import getScheduleProfessional from "../../../helpers/Components/getScheduleProfessional";
// import clienteAxios from "../../../config/axios";
// import { createSchedule } from "../../../redux/features/professionalSlice";
// import { deleteError } from "../../../redux/features/authSlice";
// import { newHourArray } from "../../../data";

// const dateCurrent = new Date();

// const Schedule = () => {
//   const dispatch = useDispatch();

//   const { loadingProfessional, errorProfessional } = useSelector((state) => ({
//     ...state.professional,
//   }));

//   const [dateInput, setDateInput] = useState("");
//   // const [valueForm, setValueForm] = useState({
//   //   horario: "",
//   //   date: "",
//   // });
//   const [horaInicio, setHoraInicio] = useState("");
//   const [horaFin, setHoraFin] = useState("");
//   const [horariosForm, setHorariosForm] = useState([]);
//   const { horario, date } = valueForm;

//   useEffect(() => {
//     errorProfessional && toast.error(errorProfessional);
//     dispatch(deleteError());
//   }, [errorProfessional]);

//   const handleChangeHorarios = (e) => {
//     if (!horariosForm.includes(e.target.value) && e.target.value !== "") {
//       setHorariosForm([...horariosForm, { hora: e.target.value, stock: true }]);
//     }

//     setValueForm({ ...valueForm, horario: e.target.value });
//   };

//   const eliminarHorario = (horario) => {
//     setHorariosForm(
//       horariosForm.filter((horarioState) => horarioState.hora !== horario)
//     );
//   };

//   const onChangeInputDate = async (e) => {
//     setHorariosForm([]);

//     try {
//       const { data } = await clienteAxios.get(
//         `/api/profesional/${e.target.value}`
//       );

//       if (data) {
//         let dataRequest = {
//           horario: data.hora,
//           date: data.fecha,
//         };

//         setDateInput(e.target.value);
//         setValueForm({ ...valueForm, dataRequest });
//         setHorariosForm(data.horarios);
//       } else {
//         setDateInput(e.target.value);
//         setHorariosForm([]);
//       }
//     } catch (err) {
//       let error = err.response?.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   const onSubmitForm = async (e) => {
//     e.preventDefault();

//     getScheduleProfessional(horariosForm);

//     const dataP = {
//       fecha: dateInput,
//       horarios: horariosForm,
//     };

//     try {
//       await clienteAxios.post(`/api/profesional`, dataP);
//     } catch (err) {
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }

//     toast.success("Disponibilidad agregada");

//     setValueForm({
//       horario: "",
//       date: "",
//     });

//     setHorariosForm([]);

//     setDateInput("");

//     //dispatch(createSchedule({ valueForm, toast }));
//   };

//   return (
//     <div className="flex items-center justify-center mt-5">
//       <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//         <div className="grid gap-8 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
//           <div className="mb-4">
//             <p className="font-medium text-xl mb-2">Horarios</p>
//             <p className="text-gray-600 leading-loose">
//               Selecciona tus horarios según tu disponibilidad.
//             </p>
//           </div>

//           <div className="lg:col-span-2">
//             <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h5 className="text-xl font-medium leading-none mb-2">
//                   Selecciona tus horarios
//                 </h5>
//               </div>

//               <input
//                 type="date"
//                 onChange={onChangeInputDate}
//                 min={dateCurrent.toISOString().split("T")[0]}
//                 max={
//                   dateCurrent.getFullYear() +
//                   "-0" +
//                   (dateCurrent.getMonth() + 2) +
//                   "-" +
//                   dateCurrent.getDate()
//                 }
//                 className="w-full block bg-gray-100 border-gray-400 font-semibold rounded-lg px-4 py-3 mt-6"
//               />

//               {dateInput && (
//                 <section className="mt-6 ">
//                   <h2 className="font-semibold text-gray-900">
//                     Horario para{" "}
//                     <time>
//                       {format(addDays(new Date(dateInput), 1), "MMM dd, yyy", {
//                         locale: es,
//                       })}
//                     </time>
//                   </h2>
//                   <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
//                     {
//                       <div
//                         id="accordion-collapse-body-1"
//                         aria-labelledby="accordion-collapse-heading-1"
//                       >
//                         <form onSubmit={onSubmitForm}>
//                           <select
//                             id="disponibilidad"
//                             className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none  block w-full p-2.5"
//                             name="disponibilidad"
//                             onChange={handleChangeHorarios}
//                             value={horario}
//                           >
//                             <option value="">Disponibilidad</option>
//                             {newHourArray.map((hora, index) => (
//                               <option key={index} value={hora.valueHoraInicio}>
//                                 {hora.horaInicio}
//                               </option>
//                             ))}
//                           </select>

//                           {/* <Hour key={hour.id} id={hour.id} hour={hour.hour} handleChange={handleChange}/> */}
//                           {horariosForm?.length > 0 && (
//                             <div className="my-4 flex flex-wrap gap-4">
//                               {horariosForm.map((horario, index) => (
//                                 <p
//                                   key={index}
//                                   className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
//                                 >
//                                   {horario.hora}
//                                   <AiFillCloseCircle
//                                     className="ml-2"
//                                     onClick={() => eliminarHorario(horario.hora)}
//                                   />
//                                 </p>
//                               ))}
//                             </div>
//                           )}

//                           {loadingProfessional ? (
//                             <ButtonSpinner />
//                           ) : (
//                             <button
//                               type="submit"
//                               className="w-full block bg-primary hover:bg-bgHover focus:bg-bgHover text-white font-semibold rounded-lg px-4 py-3 mt-6"
//                             >
//                               Confirmar Horario
//                             </button>
//                           )}
//                         </form>
//                       </div>
//                     }
//                   </ol>
//                 </section>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Schedule;

// import React, { useEffect, useState } from "react";
// import { hours, hoursArray, newHoursArray } from "../../../data";
// import Hour from "./components/Hour";
// import { addDays, format } from "date-fns";
// import { es } from "date-fns/locale";
// import { AiFillCloseCircle } from "react-icons/ai";
// import { createSchedule } from "../../../redux/features/professionalSlice";
// import { deleteError } from "../../../redux/features/authSlice";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import ButtonSpinner from "../../../components/ButtonSpinner";
// import getScheduleProfessional from "../../../helpers/Components/getScheduleProfessional";
// import { current } from "@reduxjs/toolkit";
// import clienteAxios from "../../../config/axios";

// const dateCurrent = new Date();

// const Schedule = () => {
//   const dispatch = useDispatch();

//   const { loadingProfessional, errorProfessional } = useSelector((state) => ({
//     ...state.professional,
//   }));

//   const [dateInput, setDateInput] = useState("");

//   const [valueForm, setValueForm] = useState({
//     horario: "",
//     date: "",
//   });

//   const [horariosForm, setHorariosForm] = useState([]);

//   const { horario, date } = valueForm;

//   useEffect(() => {
//     errorProfessional && toast.error(errorProfessional);
//     dispatch(deleteError());
//   }, [errorProfessional]);

//   const handleChangeHorarios = (e) => {
//     if (!horariosForm.includes(e.target.value) && e.target.value !== "") {
//       setHorariosForm([...horariosForm, { hora: e.target.value, stock: true }]);
//     }

//     setValueForm({ ...valueForm, horario: e.target.value });
//   };

//   const eliminarHorario = (horario) => {
//     setHorariosForm(
//       horariosForm.filter((horarioState) => horarioState.hora !== horario)
//     );
//   };

//   const onChangeInputDate = async (e) => {
//     setHorariosForm([]);

//     try {
//       const { data } = await clienteAxios.get(
//         `/api/profesional/${e.target.value}`
//       );

//       if (data) {
//         let dataRequest = {
//           horario: data.hora,
//           date: data.fecha,
//         };

//         setDateInput(e.target.value);
//         setValueForm({ ...valueForm, dataRequest });
//         setHorariosForm(data.horarios);
//       } else {
//         setDateInput(e.target.value);
//         setHorariosForm([]);
//       }
//     } catch (err) {
//       let error = err.response?.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   const onSubmitForm = async (e) => {
//     e.preventDefault();

//     getScheduleProfessional(horariosForm);

//     const dataP = {
//       fecha: dateInput,
//       horarios: horariosForm,
//     };

//     try {
//       await clienteAxios.post(`/api/profesional`, dataP);
//     } catch (err) {
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }

//     toast.success("Disponibilidad agregada");

//     setValueForm({
//       horario: "",
//       date: "",
//     });

//     setHorariosForm([]);

//     setDateInput("");

//     //dispatch(createSchedule({ valueForm, toast }));
//   };

//   return (
//     <div className="flex items-center justify-center mt-5">
//       <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//         <div className="grid gap-8 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
//           <div className="mb-4">
//             <p className="font-medium text-xl mb-2">Horarios</p>
//             <p className="text-gray-600 leading-loose">
//               Selecciona tus horarios según tu disponibilidad.
//             </p>
//           </div>

//           <div className="lg:col-span-2">
//             <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h5 className="text-xl font-medium leading-none mb-2">
//                   Selecciona tus horarios
//                 </h5>
//               </div>

//               <input
//                 type="date"
//                 onChange={onChangeInputDate}
//                 min={dateCurrent.toISOString().split("T")[0]}
//                 max={
//                   dateCurrent.getFullYear() +
//                   "-0" +
//                   (dateCurrent.getMonth() + 2) +
//                   "-" +
//                   dateCurrent.getDate()
//                 }
//                 className="w-full block bg-gray-100 border-gray-400 font-semibold rounded-lg px-4 py-3 mt-6"
//               />

//               {dateInput && (
//                 <section className="mt-6 ">
//                   <h2 className="font-semibold text-gray-900">
//                     Horario para{" "}
//                     <time>
//                       {format(addDays(new Date(dateInput), 1), "MMM dd, yyy", {
//                         locale: es,
//                       })}
//                     </time>
//                   </h2>
//                   <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
//                     {
//                       <div
//                         id="accordion-collapse-body-1"
//                         aria-labelledby="accordion-collapse-heading-1"
//                       >
//                         <form onSubmit={onSubmitForm}>
//                           <select
//                             id="disponibilidad"
//                             className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none  block w-full p-2.5"
//                             name="disponibilidad"
//                             onChange={handleChangeHorarios}
//                             value={horario}
//                           >
//                             <option value="">Disponibilidad</option>
//                             {newHoursArray.map((hora, index) => (
//                               <option key={index} value={hora.value}>
//                                 {hora.hora}
//                               </option>
//                             ))}
//                           </select>

//                           {/* <Hour key={hour.id} id={hour.id} hour={hour.hour} handleChange={handleChange}/> */}
//                           {horariosForm?.length > 0 && (
//                             <div className="my-4 flex flex-wrap gap-4">
//                               {horariosForm.map((horario, index) => (
//                                 <p
//                                   key={index}
//                                   className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
//                                 >
//                                   {horario.hora}
//                                   <AiFillCloseCircle
//                                     className="ml-2"
//                                     onClick={() => eliminarHorario(horario.hora)}
//                                   />
//                                 </p>
//                               ))}
//                             </div>
//                           )}

//                           {loadingProfessional ? (
//                             <ButtonSpinner />
//                           ) : (
//                             <button
//                               type="submit"
//                               className="w-full block bg-primary hover:bg-bgHover focus:bg-bgHover text-white font-semibold rounded-lg
//             px-4 py-3 mt-6"
//                             >
//                               Confirmar Horario
//                             </button>
//                           )}
//                         </form>
//                       </div>
//                     }
//                   </ol>
//                 </section>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Schedule;
