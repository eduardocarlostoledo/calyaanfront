import fileDownload from "js-file-download";
import React from "react";
import { useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import Spinner from "../../../../components/Spinner";
import clienteAxios from "../../../../config/axios";
import useGetDateTable from "../../../../hooks/useGetDateTable";

import ModalUser from "./ModalUser";

const TableSchedule = () => {
  const { paginado, setLimite, limite, pagina, setPagina, loading } =
    useGetDateTable("PROFESIONAL");

  const [userState, setUserState] = useState({});
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();

  const handleDownload = (url, filename) => {
    clienteAxios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  const handleUser = async (user) => {
   

    try {
      const { data } = await clienteAxios.get(
        `api/profesional/perfil-profesional-id/${user.profesional}`
      );
 
      setUserState({
        nombre:user.nombre,
        horarios:data.disponibilidad
      });

    } catch (err) {
      console.log(err);
    }

    setModal(true);
  };

  const handleModalView = () => {
    setModal(!modal);
  };

  return (
    <>
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">Horarios de profesionales</h2>
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
                  <option value="todos">Todos</option>
                  <option value={true}>Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value={false}>Suspendido</option>
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

          <div>
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
                    Usuario
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Registrado en
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
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
                      <p>No hay usuarios registrados</p>
                    </td>
                  </tr>
                ) : (
                  paginado?.resultados?.map((user) => (
                    <tr key={user._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            {user?.img ? (
                              <img
                                className="w-full h-full rounded-full cursor-pointer"
                                src={user.img}
                                alt="Imagen de usuario"
                                onClick={() => handleUser(user)}
                              />
                            ) : (
                              <BsPersonCircle
                                className="w-full h-full text-gray-300 cursor-pointer"
                                onClick={() => handleUser(user)}
                              />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {user.nombre} {user.apellido}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.rol}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.createdAt.split("T")[0]}
                        </p>
                      </td>
                      {user.estado ? (
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <p
                              aria-hidden
                              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                            ></p>
                            <p className="relative">Activo</p>
                          </div>
                        </td>
                      ) : (
                        <td className="px-5 py-5  text-sm border-b border-gray-200 bg-white">
                          <div className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                            <p
                              aria-hidden
                              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                            ></p>
                            <p className="relative">Inactivo</p>
                          </div>
                        </td>
                      )}
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
                    className={`text-sm font-semibold py-2 px-4 rounded-r ${
                      pagina !== 1
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
                    className={`text-sm font-semibold py-2 px-4 rounded-r ${
                      pagina < paginado.totalPaginas
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
        <ModalUser userState={userState} handleModalView={handleModalView} />
      )}
    </>
  );
};

export default TableSchedule;
