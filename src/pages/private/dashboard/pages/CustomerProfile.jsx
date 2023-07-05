import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import bg3 from "../../../../assets/bg-3-auth.jpg";
import clienteAxios from "../../../../config/axios";
import { localidades } from "../../../../data";

const CustomerProfile = () => {
  const { id } = useParams();

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
    ultimaConexion: "",
  });

  const {
    nombre,
    apellido,
    sexo,
    email,
    telefono,
    direccionDefault,
    direcciones,
    cedula,
    reviews,
    reservas,
    estado,
    confirmado,
    ultimaConexion,
  } = valueForm;

  useEffect(() => {
    const getUser = async () => {
      try {
        let { data } = await clienteAxios.get(`api/usuarios/perfil/${id}`);

        setValueForm({ ...valueForm, ...data });
      } catch (err) {
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getUser();
  }, [id]);

  return (
    <>
      <div className="bg-white  shadow rounded mx-auto w-full">
        <div className="relative">
          <img
            className="h-56 shadow rounded-t w-full object-cover object-center"
            src={bg3}
            alt
          />
          <div className="inset-0 m-auto w-24 h-24 absolute bottom-0 -mb-12  rounded border-2 shadow border-white">
            <img
              className="w-full h-full overflow-hidden object-cover rounded"
              src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
              alt
            />
          </div>
        </div>
        <div className="px-5 pb-10">
          <div className="flex justify-center  w-full pt-16 "></div>
          <div className="pt-18  flex flex-col  items-start  justify-between">
            <div className=" w-full ">
              <div className="text-center   flex flex-col  items-center justify-between ">
                <h2 className="  text-2xl text-gray-800  font-medium tracking-normal">
                  {nombre} {apellido}
                </h2>
              </div>
            </div>
            <div className=" w-full py-5 flex items-start justify-center ">
              <div className="mr-6 ">
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  {reviews}
                </h2>
                <p className="text-gray-800  text-sm leading-5">
                  Reviews
                </p>
              </div>
              <div className="mr-6 ">
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  {reservas.length}
                </h2>
                <p className="text-gray-800  text-sm leading-5">
                  Servicos
                </p>
              </div>
              <div>
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  {reservas.length}
                </h2>
                <p className="text-gray-800  text-sm  leading-5">
                  Completados
                </p>
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
                {telefono && (
                  <button className="focus:outline-none ml-0 md:ml-5 bg-indigo-700  transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-3 md:px-6 py-2 text-sm">
                    Mensaje
                  </button>
                )}
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
          <h3>Datos personales</h3>

          <div className="flex lg:flex-row md:flex-col-reverse flex-col-reverse justify-between mt-4  ">
            <div className="text">
              <div className=" lg:mt-0 mt-6">
                <p className="text-base text-gray-800">Nombres</p>
                <input
                  type="text"
                  name="nombre"
                  id="nombres"
                  value={nombre}
                  className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                  placeholder="No registrado"
                  disabled={true}
                />
              </div>

              <div className>
                <div className="mt-6">
                  <p className="text-base text-gray-800">Apellidos</p>
                  <input
                    type="text"
                    name="apellidos"
                    id="apellidos"
                    value={apellido}
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                    placeholder="No registrado"
                    disabled={true}
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
                  className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                  placeholder="No registrado"
                  disabled={true}
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
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                    placeholder="No registrado"
                    disabled={true}
                  />
                </div>
                <div className="lg:mt-0 md:mt-0 mt-4 w-full">
                  <p className="text-base text-gray-800">Cédula</p>
                  <input
                    type="text"
                    name="cedula"
                    id="cedula"
                    value={cedula}
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
                disabled={true}
              >
                <option value="">No registrado</option>
                <option value={direccionDefault.ciudad}>
                  {direccionDefault.ciudad}
                </option>
              </select>
            </div>
            <div className="lg:mt-0 md:mt-0 mt-4 w-full">
              <p className="text-base leading-none text-gray-800">Nombre</p>
              <select
                id="ciudad"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                value={direccionDefault.nombre}
                name="ciudad"
                disabled={true}
              >
                <option value="">No registrado</option>
                <option value={direccionDefault.nombre}>
                  {direccionDefault.nombre}
                </option>
              </select>
            </div>
          </div>

          <div className="lg:flex md:flex block gap-8  mt-6">
            <div className="w-full">
              <p className="text-base leading-none text-gray-800">ID</p>
              <input
                type="text"
                name="cedula"
                id="cedula"
                value={direccionDefault._id}
                placeholder="No registrado"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                disabled={true}
              />
            </div>
            <div className="lg:mt-0 md:mt-0 mt-4 w-full">
              <p className="text-base leading-none text-gray-800">Localidad</p>
              <select
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                name="localidad"
                id="localidad"
                value={direccionDefault.localidad}
                disabled={true}
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
                disabled={true}
              />
            </div>
            <div className="lg:mt-0 md:mt-0 mt-4 w-full">
              <p className="text-base leading-none text-gray-800">Localidad</p>
              <input
                type="text"
                name="cedula"
                id="cedula"
                value={direccionDefault.info}
                placeholder="No registrado"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                disabled={true}
              />
            </div>
          </div>
        </div>

        <div className="bg-white  shadow p-8">
          <h3>Últimos servicios</h3>

          <div className="flex gap-6 justify-center mx-auto  flex-wrap lg:flex-col mt-4">
            <div className="w-full">
            <Link
                to="/reserva/1"className="bg-white  shadow xl:flex lg:flex md:flex p-5 rounded cursor-pointer">
                <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 mb-4 xl:mb-0 lg:mb-0 md:mb-0">
                  <p className="text-lg text-gray-800  mb-3 font-normal">
                    Depilación
                  </p>
                  <p className="text-sm text-gray-600  font-normal">
                    10 Abril 2023 - 08:00 am
                  </p>
                </div>
                <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 flex justify-end flex-col xl:items-end lg:items-end md:items-end items-start">
                  <p className="text-xs text-white bg-green-400 px-3 rounded mb-2 font-normal py-1">
                    Completado
                  </p>
                  <p className="text-sm text-gray-600  font-normal">
                    Atendido por: Andrea Gomez
                  </p>
                </div>
              </Link>
            </div>
            <div className="w-full">
            <Link
                to="/reserva/1" className="bg-white  shadow xl:flex lg:flex md:flex p-5 rounded cursor-pointer">
                <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 mb-4 xl:mb-0 lg:mb-0 md:mb-0">
                  <p className="text-lg text-gray-800  mb-3 font-normal">
                    Depilación
                  </p>
                  <p className="text-sm text-gray-600  font-normal">
                    10 Abril 2023 - 08:00 am
                  </p>
                </div>
                <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 flex justify-end flex-col xl:items-end lg:items-end md:items-end items-start">
                  <p className="text-xs text-white bg-yellow-400 px-3 rounded mb-2 font-normal py-1">
                    Pendiente
                  </p>
                  <p className="text-sm text-gray-600  font-normal">
                    Atendido por: Andrea Gomez
                  </p>
                </div>
              </Link>
            </div>

            <div className="w-full">
              <Link
                to="/reserva/1"
                className="bg-white  shadow xl:flex lg:flex md:flex p-5 rounded cursor-pointer"
              >
                <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 mb-4 xl:mb-0 lg:mb-0 md:mb-0 ">
                  <p className="text-lg text-gray-800  mb-3 font-normal">
                    Depilación
                  </p>
                  <p className="text-sm text-gray-600  font-normal">
                    10 Abril 2023 - 08:00 am
                  </p>
                </div>
                <div className="xl:w-3/6 lg:w-3/6 md:w-3/6 flex justify-end flex-col xl:items-end lg:items-end md:items-end items-start">
                  <p className="text-xs text-white bg-red-400 px-3 rounded mb-2 font-normal py-1">
                    Cancelado
                  </p>
                  <p className="text-sm text-gray-600  font-normal">
                    Atendido por: Andrea Gomez
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white  shadow p-8 mt-5">
        <div className="mx-2 my-2 px-6 flex flex-wrap justify-center">
          <Link
            to={`/historial-servicios/cliente/${id}`}
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
            Reservas
          </Link>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;
