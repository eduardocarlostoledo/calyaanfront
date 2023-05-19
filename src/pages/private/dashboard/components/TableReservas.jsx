import fileDownload from "js-file-download";
import React from "react";
import { useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../../../../components/Spinner";
import clienteAxios from "../../../../config/axios";
import useGetDateTable from "../../../../hooks/useGetDateTable";
import useGetDateTableReservas from "../../../../hooks/useGetDateTableReservas";
import { estadoAction } from "../../../../redux/features/authSlice";
import ModalUser from "./ModalUser";
import ModalUserInfo from "./ModalUserInfo";

const TableReservas = () => {
  const { paginado, setLimite, limite, pagina, setPagina, loading } =
    useGetDateTableReservas();

  const [userState, setUserState] = useState({});
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();

  const { estado } = useSelector((state) => ({ ...state.auth }));

  const handleDownload = (url, filename) => {
    clienteAxios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  const handleState = () => {
    dispatch(estadoAction());
  };

  const handleUser = (user) => {
    setUserState(user);
    setModal(true);
  };

  const handleModalView = () => {
    setModal(!modal);
  };

  console.log(paginado)

  return (
    <>
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">Reservas</h2>
        <div className="my-2 flex justify-between mx-4">
          <div className="flex sm:flex-row flex-col">
            <div className="flex flex-row mb-1 sm:mb-0">
              <div className="relative">
                <select
                  value={limite}
                  onChange={(e) => setLimite(e.target.value)}
                  className="appearance-none h-full rounded-l border block a w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <MdKeyboardArrowDown className="fill-current h-4 w-4" />
                </div>
              </div>
              <div className="relative">
                <select className="h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                  <option>Todos</option>
                  <option>Activo</option>
                  <option>Inactivo</option>
                  <option>Suspendido</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <MdKeyboardArrowDown className="fill-current h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="block relative">
              <p className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-500"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </p>
              <input
                placeholder="Buscar"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/reservar"
              className="flex justify-center items-center  text-center  w-full text-sm font-medium leading-none  text-white px-6  bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out"
            >
              Crear reserva
            </Link>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() =>
                handleDownload(`api/usuarios/excel-horarios`, `horarios.xlsx`)
              }
            >
              <AiOutlineCloudDownload />
              <span className="sr-only">Exportar Excel</span>
            </button>
          </div>
        </div>
        <div className="-mx-4 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Día
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado del Servicio
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hora del Servicio
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="h-48 flex items-center">
                        <Spinner />
                      </td>
                    </tr>
                  </>
                ) : paginado?.resultados?.length <= 0 ? (
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="h-48 flex items-center">
                      <p>No hay reservas registradas</p>
                    </td>
                  </tr>
                ) : (
                  paginado?.resultados?.map((reserva) => (
                    <tr key={reserva._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">{reserva._id}</div>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            {reserva?.cliente?.img ? (
                              <img
                                className="w-full h-full rounded-full"
                                src={user?.img}
                                alt="Imagen de usuario"
                                onClick={() => handleUser(reserva?.cliente_id)}
                              />
                            ) : (
                              <BsPersonCircle
                                className="w-full h-full text-gray-300"
                                onClick={() => handleUser(reserva?.cliente_id)}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            {reserva?.profesional?.img ? (
                              <img
                                className="w-full h-full rounded-full"
                                src={user?.img}
                                alt="Imagen de usuario"
                                onClick={() => handleUser(reserva?.cliente_id)}
                              />
                            ) : (
                              <BsPersonCircle
                                className="w-full h-full text-gray-300"
                                onClick={() => handleUser(reserva?.cliente_id)}
                              />
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {reserva.createdAt.split("T")[0]}
                        </p>
                      </td>

                      <td className="px-5 py-5  text-sm border-b border-gray-200 bg-white">
                        <div
                          className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight"
                          onClick={handleState}
                        >
                          <p
                            aria-hidden
                            className={`absolute inset-0 opacity-50 rounded-full ${reserva.estadoPago === "approved" ? "bg-green-200" : reserva.estadoPago === "pending" ? "bg-yellow-200" : "bg-red-200"}`}
                          ></p>
                          <p className="relative">{reserva.estadoPago}</p>
                        </div>
                      </td>


                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {reserva.estadoServicio}
                        </p>
                      </td>


                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {reserva.hora_servicio}
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex">
                    
                        <Link to={`/resumen-admin/${reserva._id}`} className="text-gray-900 whitespace-no-wrap">
                          Ver reserva
                        </Link>

                        <Link to={`/reservar?id=${reserva._id}`} className="text-gray-900 whitespace-no-wrap">
                          Ver reserva Formulario
                        </Link>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {!loading && paginado?.resultados?.length !== 0 && (
              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <p className="text-xs xs:text-sm text-gray-900 mb-1">
                  Pag {pagina} de {paginado.totalPaginas}
                </p>
                <p className="text-xs xs:text-sm text-gray-900">
                  Mostrando 1 a {limite} de {paginado.totalUsuarios} entradas
                </p>

                <div className="inline-flex mt-2 xs:mt-0">
                  <button
                    onClick={() => pagina !== 1 && setPagina(pagina - 1)}
                    className={`text-sm font-semibold py-2 px-4 rounded-r ${pagina !== 1
                      ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                      : "disabled:opacity-25"
                      }`}
                    disabled={pagina !== 1 ? false : true}
                  >
                    Ant
                  </button>
                  <button
                    onClick={() =>
                      pagina < paginado.totalPaginas && setPagina(pagina + 1)
                    }
                    className={`text-sm font-semibold py-2 px-4 rounded-r ${pagina < paginado.totalPaginas
                      ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                      : "disabled:opacity-25"
                      }`}
                    disabled={pagina < paginado.totalPaginas ? false : true}
                  >
                    Sig
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <ModalUserInfo userState={userState} handleModalView={handleModalView} />
      )}
    </>
  );
};

export default TableReservas;
