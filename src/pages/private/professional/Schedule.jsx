import React, { useEffect, useState, useRef } from "react";
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
//import HorariosTabla from "./components/tablaHorariosProfesionales";
import { Table } from 'antd';


const HorariosTabla = ({ _id }) => {
  console.log('HORARIOSTABLA', _id);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerDisponibilidades = async () => {
      try {
        setLoading(true);
        const response = await clienteAxios.post(
          `/api/profesional/disponibilidad-por-id`,
          { _id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setDisponibilidades(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las disponibilidades:', error);
        setLoading(false); // asegúrate de cambiar el estado de carga en caso de error también
      }
    };

    obtenerDisponibilidades();
  }, [_id]); // agrega _id a las dependencias de useEffect

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha'
    },
    {
      title: 'Horarios',
      dataIndex: 'horarios',
      key: 'horarios',
      render: horarios => (
        <ul>
          {horarios.map(horario => (
            <li key={horario._id}>{horario.hora}</li>
          ))}
        </ul>
      )
    }
  ];

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (        
        <Table dataSource={disponibilidades} columns={columns} pagination={false} />
      )}
    </div>
  );
};

const dateCurrent = new Date();

function verificarHorario(horario, arrayObjetos) {
  return arrayObjetos.some((objeto) => {
    const horas = objeto.hora.split("-");
    const horaInicio = horas[0].trim();
    const horaFin = horas[1].trim();
    return horario >= horaInicio && horario <= horaFin && objeto.stock;
  });
}

const Schedule = ({ profesionalSelect }) => {
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
  ].sort();

  const jornadaDeSeisADoce = [
    "06:00-07:00",
    "07:00-08:00",
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
  ].sort();

  const jornadaDeDoceAVentiDos = [
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
    "18:00-19:00",
    "19:00-20:00",
    "20:00-21:00",
    "21:00-22:00",
  ].sort();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const dispatch = useDispatch();
  const dateInputRef = useRef(null); // Ref para el input date

  const { loadingProfessional, errorProfessional } = useSelector((state) => ({
    ...state.professional,
  }));
  const _id = useSelector((state) => state.auth.user.profesionalId);
  console.log(_id, "id");


  const [dateInput, setDateInput] = useState("");
  const [horariosForm, setHorariosForm] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);  

  useEffect(() => {
    errorProfessional && toast.error(errorProfessional);
    dispatch(deleteError());
  }, [errorProfessional]);

  const eliminarHorario = (horario) => {
    setHorariosForm((prevHorariosForm) =>
      prevHorariosForm.filter((horarioState) => horarioState.hora !== horario)
    );
  };

  const onChangeInputDate = async (e) => {
    setHorariosForm([]);
    try {
      let info = "";
      //console.log(profesionalSelect, "aaa");
      if (profesionalSelect) {
        const { data } = await clienteAxios.get(
          `/api/profesional/disponibilidad-profesional-admin-dash?fecha=${e.target.value}&_id=${profesionalSelect.profesional._id}`
        );
        info = data;
      } else {
        const { data } = await clienteAxios.get(
          `/api/profesional/${e.target.value}`
        );
        info = data;
      }
      if (info) {
        setDateInput(e.target.value);
        setHorariosForm(info.horarios);
      } else {
        setDateInput(e.target.value);
        setHorariosForm([]);
      }
    } catch (err) {
      let error = err.response?.data.msg
        ? err.response.data.msg
        : err.response && "Limpiando Formulario";
      return toast.error(error);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const scheduleData = getScheduleProfessional(horariosForm);
    const dataP = {
      fecha: dateInput,
      horarios: horariosForm,
      _id,
      scheduleData,
    };
    if (profesionalSelect) {
      dataP._id = profesionalSelect.profesional._id;
    }
    try {
      await clienteAxios.post(`/api/profesional`, dataP);
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
    toast.success("Disponibilidad agregada");
    setHorariosForm([]);
    setDateInput("");
    setSelectedOptions([]);
    // Después de enviar el formulario, scroll al input dateInput
    scrollToTop();
    // dateInputRef.current.scrollIntoView({
    //   behavior: "smooth",
    //   block: "start",
    // });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setHorariosForm((prevHorariosForm) => [
        ...prevHorariosForm,
        { hora: value, stock: true },
      ]);
      setSelectedOptions((prevSelectedOptions) => [
        ...prevSelectedOptions,
        value,
      ]);
    } else {
      setHorariosForm((prevHorariosForm) =>
        prevHorariosForm.filter((option) => option.hora !== value)
      );
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.filter((option) => option !== value)
      );
    }
  };

  /*inicio selects*/
  const selectAll = () => {
    if (selectedOptions.length === newHourArray.length) {
      setHorariosForm([]);
      setSelectedOptions([]);
    } else {
      setHorariosForm(newHourArray.map((hora) => ({ hora, stock: true })));
      setSelectedOptions([...newHourArray]);
    }
  };

  const selectAlljornadaDeDoceAVentiDos = () => {
    if (selectedOptions.length === jornadaDeDoceAVentiDos.length) {
      setHorariosForm([]);
      setSelectedOptions([]);
    } else {
      setHorariosForm(
        jornadaDeDoceAVentiDos.map((hora) => ({ hora, stock: true }))
      );
      setSelectedOptions([...jornadaDeDoceAVentiDos]);
    }
  };

  const selectAlljornadaDeSeisADoce = () => {
    if (selectedOptions.length === jornadaDeSeisADoce.length) {
      setHorariosForm([]);
      setSelectedOptions([]);
    } else {
      setHorariosForm(
        jornadaDeSeisADoce.map((hora) => ({ hora, stock: true }))
      );
      setSelectedOptions([...jornadaDeSeisADoce]);
    }
  };
  /* fin selects*/

  return (
    <div className="flex flex-col items-center justify-center my-32 max-lg:my-12">
  <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-8 gap-y-2 text-sm grid-cols-1 lg:grid-cols-1">
          <div className="mb-4">
            <p className="font-medium text-xl mb-2">Horarios</p>
            <p className="text-gray-600 leading-loose">
              Selecciona tus horarios según tu disponibilidad.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
              <input
                type="date"
                onChange={onChangeInputDate}
                className="w-full block bg-gray-100 border-gray-400 font-semibold rounded-lg px-4 py-3 mt-6"
              />

              {dateInput && (
                <section className="mt-6 w-full">
                  <h2 className="font-semibold text-gray-900">
                    Horario para{" "}
                    <time>
                      {format(addDays(new Date(dateInput), 1), "MMM dd, yyy", {
                        locale: es,
                      })}
                    </time>
                  </h2>
                  {/* aca esta la botonera de opciones */}
                  
                  {/* <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-medium leading-none mb-2">
                      Selecciona tus horarios
                    </h5>

                    <button
                      onClick={selectAlljornadaDeDoceAVentiDos}
                      className="bg-primary text-white rounded-lg px-2 py-1"
                    >
                      Selecc. 12 a 22 hs
                    </button>                    

                    <button
                      onClick={selectAll}
                      className="bg-primary text-white rounded-lg px-2 py-1"
                    >
                      Seleccionar todos
                    </button>

                    <button
                      onClick={selectAlljornadaDeSeisADoce}
                      className="bg-primary text-white rounded-lg px-2 py-1"
                    >
                      Selecc. 06 a 12 hs
                    </button>
                    

                  </div> */}

                  <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
                    <h5 className="text-xl font-medium leading-none mb-2 sm:mb-0">
                      Selecciona tus horarios
                    </h5>

                    <button
                      onClick={selectAlljornadaDeSeisADoce}
                      className="bg-primary text-white rounded-lg px-2 py-1 mb-2 sm:mb-0 sm:mr-2"
                    >
                      Selecc. 06 a 12 hs
                    </button>

                    <button
                      onClick={selectAlljornadaDeDoceAVentiDos}
                      className="bg-primary text-white rounded-lg px-2 py-1 mb-2 sm:mb-0 sm:mx-2"
                    >
                      Selecc. 12 a 22 hs
                    </button>

                    <button
                      onClick={selectAll}
                      className="bg-primary text-white rounded-lg px-2 py-1"
                    >
                      Selecciona todos
                    </button>
                  </div>

                  <ol className="flex flex-col items-center justify-between mb-4 sm:flex-row text-gray-500">
                    <div
                      id="accordion-collapse-body-1"
                      aria-labelledby="accordion-collapse-heading-1"
                      className="w-full"
                    >
                      <form onSubmit={onSubmitForm}>
                        <div className="my-4 m-auto flex flex-col flex-wrap content-around max-h-72">
                          {newHourArray.map((hora, index) => (
                            <label
                              key={index}
                              className="block mt-2 text-base text-gray-900"
                            >
                              <input
                                type="checkbox"
                                name="horarios"
                                value={hora}
                                onChange={handleCheckboxChange}
                                checked={selectedOptions.includes(hora)}
                              />
                              {hora}
                            </label>
                          ))}
                        </div>
                        <div className="my-4 m-auto flex flex-wrap gap-4 max-w-x justify-center">
                          {horariosForm.map((horario, index) => (
                            <p
                              key={index}
                              className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
                            >
                              {horario.hora}
                              <AiFillCloseCircle
                                className="ml-2"
                                onClick={() => eliminarHorario(horario.hora)}
                              />
                            </p>
                          ))}
                        </div>
                        {loadingProfessional ? (
                          <ButtonSpinner />
                        ) : (
                          <button
                            type="submit"
                            className="w-96 m-auto block bg-primary hover:bg-bgHover focus:bg-bgHover text-white font-semibold rounded-lg px-4 py-3 mt-6"
                          >
                            Confirmar Horario
                          </button>
                        )}
                      </form>
                    </div>
                  </ol>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        {profesionalSelect ? (
        <HorariosTabla _id={profesionalSelect.profesional._id} />
        ) : (
        <HorariosTabla _id={_id} />
        )}
      </div>
    </div>
  );
};

export default Schedule;

// import React, { useEffect, useState, useRef } from "react";
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

// const dateCurrent = new Date();

// function verificarHorario(horario, arrayObjetos) {
//   for (let i = 0; i < arrayObjetos.length; i++) {
//     const objeto = arrayObjetos[i];
//     const horas = objeto.hora.split("-");

//     const horaInicio = horas[0].trim();
//     const horaFin = horas[1].trim();

//     if (horario >= horaInicio && horario <= horaFin && objeto.stock) {
//       return true;
//     }
//   }

//   return false;
// }

// const newHourArray = [
//   "06:00-07:00",
//   "07:00-08:00",
//   "08:00-09:00",
//   "09:00-10:00",
//   "10:00-11:00",
//   "11:00-12:00",
//   "12:00-13:00",
//   "13:00-14:00",
//   "14:00-15:00",
//   "15:00-16:00",
//   "16:00-17:00",
//   "17:00-18:00",
//   "18:00-19:00",
//   "19:00-20:00",
//   "20:00-21:00",
//   "21:00-22:00",
// ].sort();

// const Schedule = () => {
//   const dispatch = useDispatch();
//   const dateInputRef = useRef(null); // Ref para el input date

//   const { loadingProfessional, errorProfessional } = useSelector((state) => ({
//     ...state.professional,
//   }));

//   const [dateInput, setDateInput] = useState("");
//   const [horariosForm, setHorariosForm] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   useEffect(() => {
//     errorProfessional && toast.error(errorProfessional);
//     dispatch(deleteError());
//   }, [errorProfessional]);

//   const eliminarHorario = (horario) => {
//     setHorariosForm(
//       horariosForm.filter((horarioState) => horarioState.hora !== horario)
//     );
//   };

//   const onChangeInputDate = async (e) => {
//     setHorariosForm([]);

//     try {
//       const { data } = await clienteAxios.get(`/api/profesional/${e.target.value}`);

//       if (data) {
//         let dataRequest = {
//           horario: data.hora,
//           date: data.fecha,
//         };

//         setDateInput(e.target.value);
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

//     const scheduleData = getScheduleProfessional(horariosForm);

//     const dataP = {
//       fecha: dateInput,
//       horarios: horariosForm,
//       scheduleData,
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

//     setHorariosForm([]);
//     setDateInput("");
//     setSelectedOptions([]);
//     // Después de enviar el formulario, scroll al input dateInput
//     dateInputRef.current.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   };

//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setHorariosForm([...horariosForm, { hora: value, stock: true }]);
//       setSelectedOptions([...selectedOptions, value]);
//     } else {
//       setHorariosForm(horariosForm.filter((option) => option.hora !== value));
//       setSelectedOptions(selectedOptions.filter((option) => option !== value));
//     }
//   };

//   const selectAll = () => {
//     if (selectedOptions.length === newHourArray.length) {
//       setHorariosForm([]);
//       setSelectedOptions([]);
//     } else {
//       setHorariosForm(newHourArray.map((hora) => ({ hora, stock: true })));
//       setSelectedOptions([...newHourArray]);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center my-32 max-lg:my-12">
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

//               <input
//                 type="date"
//                 onChange={onChangeInputDate}
//                 className="w-full block bg-gray-100 border-gray-400 font-semibold rounded-lg px-4 py-3 mt-6"
//               />

//               {dateInput && (
//                 <section className="mt-6">
//                   <h2 className="font-semibold text-gray-900">
//                     Horario para{" "}
//                     <time>
//                       {format(
//                         addDays(new Date(dateInput), 1),
//                         "MMM dd, yyy",
//                         {
//                           locale: es,
//                         }
//                       )}
//                     </time>
//                   </h2>

//                   <div className="flex items-center justify-between mb-4">
//                 <h5 className="text-xl font-medium leading-none mb-2">
//                   Selecciona tus horarios
//                 </h5>
//                 <button
//                   onClick={selectAll}
//                   className="bg-primary text-white rounded-lg px-2 py-1"
//                 >
//                   Seleccionar todos
//                 </button>
//               </div>

//                   <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
//                     {
//                       <div
//                         id="accordion-collapse-body-1"
//                         aria-labelledby="accordion-collapse-heading-1"
//                       >
//                         <form onSubmit={onSubmitForm}>
//                           {newHourArray.map((hora, index) => (
//                             <label key={index} className="block mt-1 text-sm text-gray-900">
//                               <input
//                                 type="checkbox"
//                                 name="horarios"
//                                 value={hora}
//                                 onChange={handleCheckboxChange}
//                                 checked={selectedOptions.includes(hora)}
//                               />
//                               {hora}
//                             </label>
//                           ))}
//                           <div className="my-4 flex flex-wrap gap-4">
//                             {horariosForm.map((horario, index) => (
//                               <p
//                                 key={index}
//                                 className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
//                               >
//                                 {horario.hora}
//                                 <AiFillCloseCircle
//                                   className="ml-2"
//                                   onClick={() => eliminarHorario(horario.hora)}
//                                 />
//                               </p>
//                             ))}
//                           </div>
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

// const dateCurrent = new Date();

// function verificarHorario(horario, arrayObjetos) {
//   for (let i = 0; i < arrayObjetos.length; i++) {
//     const objeto = arrayObjetos[i];
//     const horas = objeto.hora.split("-");

//     const horaInicio = horas[0].trim();
//     const horaFin = horas[1].trim();

//     if (horario >= horaInicio && horario <= horaFin && objeto.stock) {
//       return true;
//     }
//   }

//   return false;
// }

// const newHourArray = [
//   "06:00-07:00",
//   "07:00-08:00",
//   "08:00-09:00",
//   "09:00-10:00",
//   "10:00-11:00",
//   "11:00-12:00",
//   "12:00-13:00",
//   "13:00-14:00",
//   "14:00-15:00",
//   "15:00-16:00",
//   "16:00-17:00",
//   "17:00-18:00",
//   "18:00-19:00",
//   "19:00-20:00",
//   "20:00-21:00",
//   "21:00-22:00",
// ];

// const Schedule = () => {
//   const dispatch = useDispatch();

//   const { loadingProfessional, errorProfessional } = useSelector((state) => ({
//     ...state.professional,
//   }));

//   const [dateInput, setDateInput] = useState("");
//   const [horariosForm, setHorariosForm] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   useEffect(() => {
//     errorProfessional && toast.error(errorProfessional);
//     dispatch(deleteError());
//   }, [errorProfessional]);

//   const eliminarHorario = (horario) => {
//     setHorariosForm(
//       horariosForm.filter((horarioState) => horarioState.hora !== horario)
//     );
//   };

//   const onChangeInputDate = async (e) => {
//     setHorariosForm([]);

//     try {
//       const { data } = await clienteAxios.get(`/api/profesional/${e.target.value}`);

//       if (data) {
//         let dataRequest = {
//           horario: data.hora,
//           date: data.fecha,
//         };

//         setDateInput(e.target.value);
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

//     const scheduleData = getScheduleProfessional(horariosForm);

//     const dataP = {
//       fecha: dateInput,
//       horarios: horariosForm,
//       scheduleData,
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

//     setHorariosForm([]);
//     setDateInput("");
//   };

//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setHorariosForm([...horariosForm, { hora: value, stock: true }]);
//       setSelectedOptions([...selectedOptions, value]);
//     } else {
//       setHorariosForm(horariosForm.filter((option) => option.hora !== value));
//       setSelectedOptions(selectedOptions.filter((option) => option !== value));
//     }
//   };

//   return (
//     <div className="flex items-center justify-center my-32 max-lg:my-12">
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
//                 className="w-full block bg-gray-100 border-gray-400 font-semibold rounded-lg px-4 py-3 mt-6"
//               />

//               {dateInput && (
//                 <section className="mt-6">
//                   <h2 className="font-semibold text-gray-900">
//                     Horario para{" "}
//                     <time>
//                       {format(
//                         addDays(new Date(dateInput), 1),
//                         "MMM dd, yyy",
//                         {
//                           locale: es,
//                         }
//                       )}
//                     </time>
//                   </h2>
//                   <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
//                     {
//                       <div
//                         id="accordion-collapse-body-1"
//                         aria-labelledby="accordion-collapse-heading-1"
//                       >
//                         <form onSubmit={onSubmitForm}>
//                           {newHourArray.map((hora, index) => (
//                             <label key={index} className="block mt-1 text-sm text-gray-900">
//                               <input
//                                 type="checkbox"
//                                 name="horarios"
//                                 value={hora}
//                                 onChange={handleCheckboxChange}
//                                 checked={selectedOptions.includes(hora)}
//                               />
//                               {hora}
//                             </label>
//                           ))}
//                           <div className="my-4 flex flex-wrap gap-4">
//                             {horariosForm.map((horario, index) => (
//                               <p
//                                 key={index}
//                                 className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
//                               >
//                                 {horario.hora}
//                                 <AiFillCloseCircle
//                                   className="ml-2"
//                                   onClick={() => eliminarHorario(horario.hora)}
//                                 />
//                               </p>
//                             ))}
//                           </div>
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

// function verificarHorario(horario, arrayObjetos) {
//   for (let i = 0; i < arrayObjetos.length; i++) {
//     const objeto = arrayObjetos[i];
//     const horas = objeto.hora.split("-");

//     const horaInicio = horas[0].trim();
//     const horaFin = horas[1].trim();

//     if (horario >= horaInicio && horario <= horaFin && objeto.stock) {
//       return true;
//     }
//   }

//   return false;
// }

// const Schedule = () => {
//   const dispatch = useDispatch();

//   const { loadingProfessional, errorProfessional } = useSelector((state) => ({
//     ...state.professional,
//   }));

//   const [dateInput, setDateInput] = useState("");
//   const [horaInicio, setHoraInicio] = useState("");
//   const [horaFin, setHoraFin] = useState("");
//   const [horariosForm, setHorariosForm] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   useEffect(() => {
//     errorProfessional && toast.error(errorProfessional);
//     dispatch(deleteError());
//   }, [errorProfessional]);

//   const handleChangeHorarios = (e) => {
//     const selectedOption = e.target.value;
//     if (!verificarHorario(selectedOption, horariosForm) && selectedOption !== "") {
//       setHorariosForm([...horariosForm, { hora: selectedOption, stock: true }]);
//     }
//     setHoraInicio(selectedOption.split("-")[0]);
//     setHoraFin(selectedOption.split("-")[1]);
//   };

//   const eliminarHorario = (horario) => {
//     setHorariosForm(
//       horariosForm.filter((horarioState) => horarioState.hora !== horario)
//     );
//   };

//   const onChangeInputDate = async (e) => {
//     setHorariosForm([]);

//     try {
//       const { data } = await clienteAxios.get(`/api/profesional/${e.target.value}`);

//       if (data) {
//         let dataRequest = {
//           horario: data.hora,
//           date: data.fecha,
//         };

//         setDateInput(e.target.value);
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

//     const scheduleData = getScheduleProfessional(horariosForm);

//     const dataP = {
//       fecha: dateInput,
//       horaInicio,
//       horaFin,
//       horarios: horariosForm,
//       scheduleData,
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

//     setHoraInicio("");
//     setHoraFin("");
//     setHorariosForm([]);
//     setDateInput("");
//   };

//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedOptions([...selectedOptions, value]);
//     } else {
//       setSelectedOptions(selectedOptions.filter((option) => option !== value));
//     }
//   };

//   return (
//     <div className="flex items-center justify-center my-32 max-lg:my-12">
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
//                 className="w-full block bg-gray-100 border-gray-400 font-semibold rounded-lg px-4 py-3 mt-6"
//               />

//               {dateInput && (
//                 <section className="mt-6">
//                   <h2 className="font-semibold text-gray-900">
//                     Horario para{" "}
//                     <time>
//                       {format(
//                         addDays(new Date(dateInput), 1),
//                         "MMM dd, yyy",
//                         {
//                           locale: es,
//                         }
//                       )}
//                     </time>
//                   </h2>
//                   <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
//                     {
//                       <div
//                         id="accordion-collapse-body-1"
//                         aria-labelledby="accordion-collapse-heading-1"
//                       >
//                         <form onSubmit={onSubmitForm}>
//                           {newHourArray.map((hora, index) => (
//                             <label key={index} className="block mt-1 text-sm text-gray-900">
//                               <input
//                                 type="checkbox"
//                                 name="horarios"
//                                 value={`${hora.horaInicio}-${hora.horaFin}`}
//                                 onChange={handleCheckboxChange}
//                                 checked={selectedOptions.includes(
//                                   `${hora.horaInicio}-${hora.horaFin}`
//                                 )}
//                               />
//                               {`${hora.horaInicio} - ${hora.horaFin}`}
//                             </label>
//                           ))}
//                           <div className="my-4 flex flex-wrap gap-4">
//                             {horariosForm.map((horario, index) => (
//                               <p
//                                 key={index}
//                                 className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
//                               >
//                                 {horario.hora}
//                                 <AiFillCloseCircle
//                                   className="ml-2"
//                                   onClick={() => eliminarHorario(horario.hora)}
//                                 />
//                               </p>
//                             ))}
//                           </div>
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

// // const dateCurrent = new Date(); // Obténemos la fecha y hora actual
// // dateCurrent.setHours(dateCurrent.getHours() + 5); // Agrega 5 horas a la fecha actual por solicitud de comerciales para anticipar las visitas a domicilio

// function verificarHorario(horario, arrayObjetos) {
//   for (let i = 0; i < arrayObjetos.length; i++) {
//     const objeto = arrayObjetos[i];
//     const horas = objeto.hora.split("-"); // Divide el rango de horas en dos partes

//     const horaInicio = horas[0].trim(); // Obtiene la hora de inicio sin espacios en blanco
//     const horaFin = horas[1].trim(); // Obtiene la hora de fin sin espacios en blanco

//     if (horario >= horaInicio && horario <= horaFin && objeto.stock) {
//       return true; // El horario está dentro del objeto y hay stock disponible
//     }
//   }

//   return false; // El horario no se encontró en ninguno de los objetos o no hay stock disponible
// }

// const Schedule = () => {
//   const dispatch = useDispatch();

//   const { loadingProfessional, errorProfessional } = useSelector((state) => ({
//     ...state.professional,
//   }));

//   const [dateInput, setDateInput] = useState("");
//   const [horaInicio, setHoraInicio] = useState("");
//   const [horaFin, setHoraFin] = useState("");
//   const [horariosForm, setHorariosForm] = useState([]);

//   useEffect(() => {
//     errorProfessional && toast.error(errorProfessional);
//     dispatch(deleteError());
//   }, [errorProfessional]);

//   const handleChangeHorarios = (e) => {
//     if (
//       !verificarHorario(e.target.value, horariosForm) &&
//       e.target.value !== ""
//     ) {
//       setHorariosForm([...horariosForm, { hora: e.target.value, stock: true }]);
//     }
//     setHoraInicio(e.target.value.split("-")[0]);
//     setHoraFin(e.target.value.split("-")[1]);
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

//     const scheduleData = getScheduleProfessional(horariosForm);

//     const dataP = {
//       fecha: dateInput,
//       horaInicio,
//       horaFin,
//       horarios: horariosForm,
//       scheduleData,
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

//     setHoraInicio("");
//     setHoraFin("");
//     setHorariosForm([]);
//     setDateInput("");
//   };

//   return (
//     <div className="flex items-center justify-center my-32 max-lg:my-12">
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
//                 //se comenta para cambiar la agenda.
//                 // min={
//                 //   dateCurrent.toISOString().split("T")[0]
//                 // } /*para definir solamente reservas hacia adelante*/
//                 // max={
//                 //   dateCurrent.getFullYear() +
//                 //   "-0" +
//                 //   (dateCurrent.getMonth() + 2) +
//                 //   "-" +
//                 //   dateCurrent.getDate()
//                 // }
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
//                             value={`${horaInicio}-${horaFin}`}
//                           >
//                             <option value="">Disponibilidad</option>
//                             {newHourArray.map((hora, index) => (
//                               <option
//                                 key={index}
//                                 value={`${hora.horaInicio}-${hora.horaFin}`}
//                               >
//                                 {`${hora.horaInicio} - ${hora.horaFin}`}
//                               </option>
//                             ))}
//                           </select>

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
//                                     onClick={() =>
//                                       eliminarHorario(horario.hora)
//                                     }
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
