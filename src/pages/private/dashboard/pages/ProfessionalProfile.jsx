import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import clienteAxios from "../../../../config/axios";
import { localidades } from "../../../../data";
import { AiOutlineEdit, AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { updateProfileAdminDash } from "../../../../redux/features/professionalSlice";

// const ProfessionalProfile = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const [valueForm, setValueForm] = useState({
//     nombre: "",
//     apellido: "",
//     sexo: "",
//     email: "",
//     telefono: "",
//     direccionDefault: "",
//     direcciones: "",
//     cedula: "",
//     reviews: 0,
//     reservas: [],
//     estado: "",
//     img: "",
//     profesional: "",
//     ultimaConexion: "",
//   });
//   const [forEdit, setForEdit] = useState(false);

//   const {
//     nombre,
//     apellido,
//     sexo,
//     email,
//     telefono,
//     img,
//     direccionDefault,
//     direcciones,
//     cedula,
//     reviews,
//     reservas,
//     estado,
//     confirmado,
//     ultimaConexion,
//     profesional,
//   } = valueForm;

//   const handleChange = (e) => {
//     setValueForm({
//       ...valueForm,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if ([nombre, apellido, email].includes("")) {
//       return toast.error(
//         "Los campos nombres,apellidos y correo electrónico son obligatorios"
//       );
//     }
//     console.log("dispachado", valueForm);
//     dispatch(updateProfileAdminDash({ valueForm, toast }));
//     setForEdit(false);
//     return toast.success("Enviando...");
//   };

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         let { data } = await clienteAxios.get(
//           `api/profesional/perfil-profesional/${id}`
//         );

//         console.log(data);

//         setValueForm({ ...valueForm, ...data });
//       } catch (err) {
//         let error = err.response.data.msg
//           ? err.response.data.msg
//           : err.response && "Estamos presentando problemas internos";
//         return toast.error(error);
//       }
//     };
//     getUser();
//   }, [id]);

const ProfessionalProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [forEdit, setForEdit] = useState(false);

  const [valueForm, setValueForm] = useState({
    nombre: "",
    apellido: "",
    sexo: "",
    email: "",
    telefono: "",
    direccionDefault: "",
    direcciones: "",
    cedula: "",
    reviews: 0,
    reservas: [],
    estado: "",
    img: "",
    profesional: {},
    ultimaConexion: "",
  });

  // const getUser = async () => {
  //   try {
  //     const { data } = await clienteAxios.get(
  //       `api/profesional/perfil-profesional/${id}`
  //     );
  //     console.log(data, "informacion de la peticion");
  //     setValueForm({ ...valueForm, ...data });
  //   } catch (err) {
  //     const error =
  //       err.response?.data.msg || "Estamos experimentando problemas internos";
  //     toast.error(error);
  //   }
  // };

  const getUser = async () => {
    try {
      const { data } = await clienteAxios.get(
        `api/profesional/perfil-profesional/${id}`
      );

      setValueForm((prevState) => ({
        ...prevState,
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        sexo: data.sexo || "",
        email: data.email || "",
        telefono: data.telefono || "",
        direccionDefault: data.direccionDefault || "",
        direcciones: data.direcciones || "",
        cedula: data.cedula || "",
        reviews: data.reviews || 0,
        reservas: data.reservas || [],
        estado: data.estado || "",
        img: data.img || "",
        profesional: data.profesional || {},
        ultimaConexion: data.ultimaConexion || "",
      }));
    } catch (err) {
      const error =
        err.response?.data.msg || "Estamos experimentando problemas internos";
      toast.error(error);
    }
  };

  function insertarSaltosDeLinea(texto, caracteresPorLinea) {
    if (!texto) return [];

    const palabras = texto.split(" ");
    let lineaActual = "";
    const lineas = [];

    for (let i = 0; i < palabras.length; i++) {
      const palabra = palabras[i];
      const nuevaLinea = lineaActual + " " + palabra;

      if (nuevaLinea.length > caracteresPorLinea) {
        lineas.push(lineaActual.trim());
        lineaActual = palabra;
      } else {
        lineaActual = nuevaLinea;
      }
    }

    if (lineaActual.trim() !== "") {
      lineas.push(lineaActual.trim());
    }

    return lineas;
  }

  useEffect(() => {
    getUser();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "profesional") {
      return setValueForm((prevState) => ({
        ...prevState,
        profesional: {
          ...prevState.profesional,
          descripcion: e.target.value,
        },
      }));
    }
    setValueForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // console.log(valueForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (![nombre, apellido, email].every(Boolean)) {
      return toast.error(
        "Los campos nombres, apellidos y correo electrónico son obligatorios"
      );
    }

    try {
      dispatch(updateProfileAdminDash({ valueForm, toast }));
      setForEdit(false);
      toast.success("Enviando...");
    } catch (error) {
      toast.error("Ha ocurrido un error al enviar los datos");
    }
  };

  const {
    nombre,
    apellido,
    sexo,
    email,
    telefono,
    img,
    direccionDefault,
    direcciones,
    cedula,
    reviews,
    reservas,
    estado,
    confirmado,
    ultimaConexion,
    profesional,
  } = valueForm;
  // console.log(valueForm);
  return (
    <>
      <div className="bg-white  shadow rounded mx-auto w-full">
        <div className="relative">
          <img
            className="h-56 shadow rounded-t w-full object-cover object-center"
            src="https://img.freepik.com/foto-gratis/peines-tijeras-copia-espacio_23-2148352839.jpg"
            alt
          />
          <div className="inset-0 m-auto w-32 h-32 absolute bottom-0 -mb-12  rounded border-2 shadow border-white">
            {img ? (
              <img
                className="h-full w-full object-cover shadow"
                src={img}
                alt="Imagen de usuario"
              />
            ) : (
              <img
                className="h-full w-full object-cover  shadow"
                src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                alt="Imagen de usuario"
              />
            )}
          </div>
        </div>
        <div className="px-5 pb-10">
          <div className="flex justify-center  w-full pt-16 ">
            {/* <div className="flex items-center">
              <svg
                className="w-4 mr-1 text-yellow-400 icon icon-tabler icon-tabler-star"
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" fill="none" d="M0 0h24v24H0z" />
                <path
                  fill="currentColor"
                  d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"
                />
              </svg>
              <svg
                className="w-4 mr-1 text-yellow-400 icon icon-tabler icon-tabler-star"
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" fill="none" d="M0 0h24v24H0z" />
                <path
                  fill="currentColor"
                  d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"
                />
              </svg>
              <svg
                className="w-4 mr-1 text-yellow-400 icon icon-tabler icon-tabler-star"
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" fill="none" d="M0 0h24v24H0z" />
                <path
                  fill="currentColor"
                  d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"
                />
              </svg>
              <svg
                className="w-4 mr-1 text-yellow-400 icon icon-tabler icon-tabler-star"
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" fill="none" d="M0 0h24v24H0z" />
                <path
                  fill="currentColor"
                  d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"
                />
              </svg>
              <svg
                className="w-4 text-gray-200 icon icon-tabler icon-tabler-star"
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" fill="none" d="M0 0h24v24H0z" />
                <path
                  fill="currentColor"
                  d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"
                />
              </svg>
            </div> */}
          </div>
          <div className="pt-3  flex flex-col  items-start  justify-between">
            <div className=" w-full ">
              <div className="text-center  mb-3  flex flex-col  items-center justify-between ">
                <h2 className="mb-3  text-2xl text-gray-800  font-medium tracking-normal">
                  {nombre} {apellido}
                </h2>
              </div>
              <p className="text-center mt-2 text-sm tracking-normal text-gray-600 leading-5">
                {insertarSaltosDeLinea(profesional?.descripcion, 170).map(
                  (linea, index) => (
                    <span key={index}>
                      {linea}
                      <br />
                    </span>
                  )
                )}
              </p>
              {/* <p className="text-center mt-2 text-sm tracking-normal text-gray-600 leading-5">
                {profesional?.descripcion
                  ? insertarSaltosDeLinea(profesional.descripcion, 170)
                  : "Descripción no disponible"}
              </p> */}
            </div>
            <div className=" w-full py-5 flex items-start justify-center ">
              <div className="mr-6 ">
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  0
                </h2>
                <p className="text-gray-800  text-sm leading-5">Reviews</p>
              </div>
              <div className="mr-6 ">
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  {profesional?.reservas?.length}
                </h2>
                <p className="text-gray-800  text-sm leading-5">Servicos</p>
              </div>
              <div>
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  {profesional?.reservas?.length}
                </h2>
                <p className="text-gray-800  text-sm  leading-5">Completados</p>
              </div>
            </div>
            <div className="w-full flex-col  justify-center  ">
              <div className="flex items-center justify-center  mt-1 md:mt-0 mb-5 md:mb-0">
                <div className="ml-5 rounded-full bg-green-200 text-green-500 text-sm px-6 py-2 flex justify-center items-center">
                  {confirmado ? "Activo" : "Inactivo"}
                </div>
                <div className="ml-5 rounded-full bg-green-200 text-green-500 text-sm px-6 py-2 flex justify-center items-center">
                  {estado ? "Cuenta Verificada" : "Cuenta Sin Verificada"}
                </div>
              </div>
            </div>
            <p className="text-gray-800  text-sm text-center w-full mt-4  leading-5">
              Última conexión {ultimaConexion?.split("T")[0]} -{" "}
              {ultimaConexion?.split("T")[1]?.slice(0, 5)}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8">
        <div className="bg-white  shadow p-8">
          <div
            className={`grid ${
              forEdit ? "grid-cols-3" : "grid-cols-2"
            } justify-items-end items-center`}
          >
            <h3 className="text-2xl font tracking-widest mr-auto">
              Datos personales
            </h3>
            {forEdit && (
              <AiOutlineCheck
                size={30}
                className="cursor-pointer"
                onClick={(e) => handleSubmit(e)}
              />
            )}
            {!forEdit ? (
              <AiOutlineEdit
                size={30}
                className="cursor-pointer"
                onClick={() => setForEdit(!forEdit)}
              />
            ) : (
              <AiOutlineClose
                size={30}
                className="cursor-pointer"
                onClick={() => setForEdit(!forEdit)}
              />
            )}
          </div>

          <div className="flex lg:flex-row md:flex-col-reverse flex-col-reverse justify-between mt-4  ">
            <div className="text">
              <div className=" lg:mt-0 mt-6">
                <p className="text-base text-gray-800">Nombres</p>
                <input
                  type="text"
                  name="nombre"
                  id="nombres"
                  value={nombre}
                  onChange={handleChange}
                  className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                  placeholder="No registrado"
                  disabled={!forEdit}
                />
              </div>

              <div className>
                <div className="mt-6">
                  <p className="text-base text-gray-800">Apellidos</p>
                  <input
                    type="text"
                    name="apellido"
                    id="apellidos"
                    value={apellido}
                    onChange={handleChange}
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                    placeholder="No registrado"
                    disabled={!forEdit}
                  />
                </div>
              </div>
              <div className="  mt-6">
                <p className="text-base text-gray-800">Correo electrónico</p>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                  placeholder="No registrado"
                  disabled={!forEdit}
                />
              </div>

              <div className="lg:flex md:flex block gap-8  mt-6">
                <div className="w-full">
                  <p className="text-base text-gray-800">Teléfono</p>
                  <input
                    type="text"
                    name="telefono"
                    id="telefono"
                    value={telefono}
                    onChange={handleChange}
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                    placeholder="No registrado"
                    disabled={!forEdit}
                  />
                </div>
                <div className="lg:mt-0 md:mt-0 mt-4 w-full">
                  <p className="text-base text-gray-800">Cédula</p>
                  <input
                    type="text"
                    name="cedula"
                    id="cedula"
                    value={cedula}
                    onChange={handleChange}
                    placeholder="No registrado"
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-base leading-none text-gray-800">Sexo</p>
            <select
              id="sexo"
              className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
              value={sexo}
              onChange={handleChange}
              name="sexo"
              disabled={true}
            >
              <option value="">No registrado</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <h3 className="mt-6">Dirección por defecto </h3>

          <div className="lg:flex md:flex block gap-8  mt-6">
            <div className="w-full">
              <p className="text-base leading-none text-gray-800">Ciudad</p>
              <select
                id="ciudad"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                value={direccionDefault.ciudad}
                name="ciudad"
                disabled={!forEdit}
              >
                <option value="">No registrado</option>
                <option value={direccionDefault.ciudad}>
                  {direccionDefault.ciudad}
                </option>
              </select>
            </div>
            {/* <div className="lg:mt-0 md:mt-0 mt-4 w-full">
              <p className="text-base leading-none text-gray-800">Nombre</p>
              <select
                id="ciudad"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                value={direccionDefault.nombre}
                name="ciudad"
                disabled={!forEdit}
              >
                <option value="">No registrado</option>
                <option value={direccionDefault.nombre}>
                  {direccionDefault.nombre}
                </option>
              </select>
            </div> */}
          </div>

          <div className="lg:flex md:flex block gap-8  mt-6">
            {/* <div className="w-full">
              <p className="text-base leading-none text-gray-800">ID</p>
              <input
                type="text"
                name="cedula"
                id="cedula"
                value={direccionDefault._id}
                placeholder="No registrado"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                disabled={!forEdit}
              />
            </div> */}
            <div className="lg:mt-0 md:mt-0 mt-4 w-full">
              <p className="text-base leading-none text-gray-800">Localidad</p>
              <select
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                name="localidad"
                id="localidad"
                value={direccionDefault.localidad}
                disabled={!forEdit}
              >
                <option value="">No registrado</option>
                {localidades.map((localidad, index) => (
                  <option key={index} value={localidad.split(" ")[1]}>
                    {localidad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:flex md:flex block gap-8  mt-6">
            <div className="w-full">
              <p className="text-base leading-none text-gray-800">Dirección</p>
              <input
                type="text"
                name="cedula"
                id="cedula"
                value={direccionDefault.direccion}
                placeholder="No registrado"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                disabled={!forEdit}
              />
            </div>
            {/* <div className="lg:mt-0 md:mt-0 mt-4 w-full">
              <p className="text-base leading-none text-gray-800">Localidad</p>
              <input
                type="text"
                name="cedula"
                id="cedula"
                value={direccionDefault.info}
                placeholder="No registrado"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                disabled={!forEdit}
              />
            </div> */}
          </div>
        </div>

        <div className="bg-white  shadow container grid p-8 gap-6">
          <div className="flex  justify-center  flex-wrap lg:flex-col">
            <h3>Datos Profesionales</h3>

            <div className="flex lg:flex-row md:flex-col-reverse w-full flex-col-reverse justify-between mt-4  ">
              <div className="text w-full">
                <div className>
                  <div className="">
                    <p className="text-base my-4 text-gray-800">
                      Codigo de referido
                    </p>
                    <input
                      type="text"
                      name="apellidos"
                      id="apellidos"
                      value={profesional?.codigoreferido}
                      className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                      placeholder="No registrado"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="mt-4  ">
                  <p className="text-base leading-none my-4 text-gray-800">
                    Referidos
                  </p>
                  <div className=" flex flex-wrap gap-4">
                    {profesional?.referidos?.length > 0 ? (
                      profesional?.referidos.map((referido, index) => (
                        <p
                          key={index}
                          className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded  bg-gray-100 text-gray-800 border-gray-500 "
                        >
                          {referido}
                        </p>
                      ))
                    ) : (
                      <p className="text-center text-xs mt-3 font-medium flex items-center px-2.5 py-3 rounded  bg-gray-100 text-gray-800 border-gray-500 ">
                        No tiene referidos
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-base my-4 text-gray-800">Descripción</p>
                  <input
                    type="text"
                    name="profesional"
                    id="descripcion"
                    onChange={handleChange}
                    value={profesional?.descripcion}
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                    placeholder="No registrado"
                    disabled={!forEdit}
                  />
                </div>

                <div className="mt-4 w-full">
                  <p className="text-base my-4 text-gray-800">Especialidades</p>
                  <div className="flex gap-6 justify-center  flex-wrap lg:flex-col">
                    {profesional?.especialidad?.length > 0 ? (
                      profesional?.especialidad.map((especialidad, index) => (
                        <div className="w-5/6 mx-auto">
                          <div className="bg-white  p-5 shadow flex rounded">
                            <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 mb-4 xl:mb-0 lg:mb-0 md:mb-0 ">
                              <p className="text-lg text-gray-800  font-normal">
                                {especialidad}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-xs mt-3 font-medium flex items-center px-2.5 py-3 rounded  bg-gray-100 text-gray-800 border-gray-500 ">
                        No tiene registrado
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="  mt-4">
              <p className="text-base my-4 text-gray-900">
                Localidades Laborales
              </p>
              <div className=" flex flex-wrap gap-4">
                {profesional?.localidadesLaborales?.length > 0 ? (
                  profesional?.localidadesLaborales?.map((localidad, index) => (
                    <p
                      key={index}
                      className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded  bg-gray-100 text-gray-800 border-gray-500 "
                    >
                      {localidad}
                    </p>
                  ))
                ) : (
                  <p className="text-center text-xs mt-3 font-medium flex items-center px-2.5 py-3 rounded  bg-gray-100 text-gray-800 border-gray-500 ">
                    No tiene registrado
                  </p>
                )}
              </div>
            </div>

            {/* <div className="lg:flex md:flex block gap-8  mt-4">
              <div className="w-full">
                <p className="text-base leading-none text-gray-800">
                  Dirección
                </p>
                <input
                  type="text"
                  name="cedula"
                  id="cedula"
                  value={direccionDefault.direccion}
                  placeholder="No registrado"
                  className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                  disabled={!forEdit}
                />
              </div>
              <div className="lg:mt-0 md:mt-0 mt-4 w-full">
                <p className="text-base leading-none text-gray-800">
                  Localidad
                </p>
                <input
                  type="text"
                  name="cedula"
                  id="cedula"
                  value={direccionDefault.info}
                  placeholder="No registrado"
                  className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                  disabled={!forEdit}
                />
              </div>
            </div> */}
          </div>

          {profesional.reservas?.length > 0 && (
            <div className="flex gap-6 justify-center  flex-wrap lg:flex-col">
              <h3>Últimos servicios</h3>
              {profesional?.reservas?.map((h) => (
                <div className="w-full">
                  <Link
                    to={`/resumen-admin/${h._id}`}
                    className="bg-white  shadow xl:flex lg:flex md:flex p-5 rounded cursor-pointer"
                  >
                    <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 mb-4 xl:mb-0 lg:mb-0 md:mb-0">
                      <p className="text-lg text-gray-800  mb-3 font-normal">
                        {h.servicio}
                      </p>
                      <p className="text-sm text-gray-600  font-normal">
                        {h.dia_servicio} - {h.hora_servicio}
                      </p>
                    </div>
                    <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 flex justify-end flex-col xl:items-end lg:items-end md:items-end items-start">
                      <p
                        className={`text-xs text-white px-3 rounded mb-2 font-normal py-1 bg-yellow-400  ${
                          h.estadoServicio === "Completado"
                            ? "bg-green-400"
                            : h.estadoServicio === "Cancelado" && "bg-red-400"
                        } `}
                      >
                        {h.estadoServicio}
                      </p>
                      <p className="text-sm text-gray-600  font-normal">
                        Atiende a: {h.cliente_nombre}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white  shadow p-8 mt-5">
        <div className="mx-2 my-2 px-6 flex flex-wrap justify-center">
          <Link
            to={`/calendario-semanal/${id}`}
            className="mx-2 my-2 flex items-center bg-white transition duration-150 ease-in-out hover:border-indigo-600 border border-indigo-700 rounded text-indigo-700 hover:text-indigo-600 pl-3 pr-6 py-2 text-sm"
          >
            <span className="h-4 w-4 mr-2">
              <svg
                xmlns="www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x={3} y={5} width={18} height={14} rx={2} />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </span>
            Calendario semanal
          </Link>
          <Link
            to={`/calendario/diario/${id}`}
            className="mx-2 my-2 flex items-center bg-white transition duration-150 ease-in-out hover:border-indigo-600 border border-indigo-700 rounded text-indigo-700 hover:text-indigo-600 pl-3 pr-6 py-2 text-sm"
          >
            <span className="h-4 w-4 mr-2">
              <svg
                xmlns="www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x={3} y={5} width={18} height={14} rx={2} />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </span>
            Agenda hoy
          </Link>{" "}
          <Link
            to={`/historial-servicios/profesional/${id}`}
            className="mx-2 my-2 flex items-center bg-white transition duration-150 ease-in-out hover:border-indigo-600 border border-indigo-700 rounded text-indigo-700 hover:text-indigo-600 pl-3 pr-6 py-2 text-sm"
          >
            <span className="h-4 w-4 mr-2">
              <svg
                xmlns="www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x={3} y={5} width={18} height={14} rx={2} />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </span>
            Servicios
          </Link>
          <Link
            to="/horarios/1"
            className="mx-2 my-2 flex items-center bg-white transition duration-150 ease-in-out hover:border-indigo-600 border border-indigo-700 rounded text-indigo-700 hover:text-indigo-600 pl-3 pr-6 py-2 text-sm"
          >
            <span className="h-4 w-4 mr-2">
              <svg
                xmlns="www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x={3} y={5} width={18} height={14} rx={2} />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </span>
            Horarios
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProfessionalProfile;
