import React, { useState } from "react";
import { AiOutlineBell, AiOutlineShoppingCart } from "react-icons/ai";
import { RiSettings3Line } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLogout } from "../redux/features/authSlice";
import RoleGuardComponent from "../guards/RoleGuardComponent";
import { ROLES } from "../helpers/Logic/roles";

const Header2 = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state.auth }));

  const handleMenu = () => {
    setOpen(!open);
  };

  const logout = () => {
    dispatch(setLogout());
  };

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 pt-8 pb-4 sm:py-8">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/servicio">
            <LazyLoadImage
              effect="blur"
              width="150"
              height="80"
              alt="Logo fondo trasparente"
              src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/Logo-Calyaan2.png"
            />
          </Link>
          <div className="flex items-center lg:order-2">
          <Link to="/servicio">
          <AiOutlineShoppingCart className="w-6 h-6 mr-2 text-gray-400 hover:text-primary cursor-pointer"/>
          </Link>
            {user ? (
              <div className="flex items-center space-x-2 justify-center">
               {/*  <div className="dropdown inline-block relative">
                  <AiOutlineBell className="w-6 h-6 text-gray-400 hover:text-primary cursor-pointer" />
                  <div className="z-40 w-64 right-4 p-1  bg-white divide-y dropdown-menu absolute hidden  text-gray-700  border    divide-gray-100 rounded-lg shadow ">
                    <div className=" px-4 py-2 z-40 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50">
                      Notificaciones
                    </div>
                  
                    <div className="divide-y divide-gray-100">
                      <Link
                        to={
                          user?.rol === "PROFESIONAL"
                            ? "/resumen-profesional"
                            : user?.rol === "CLIENTE"
                            ? "/resumen"
                            : "/resumen-admin"
                        }
                        className="flex px-4 py-3 hover:bg-gray-100"
                      >
                        <div className="flex-shrink-0">
                          <div className="cursor-pointer font-semibold w-10 h-10 bg-blue-200 text-blue-600 flex items-center justify-center rounded-full">
                            {user?.nombre.split("")[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="w-full pl-3">
                          <div className="text-gray-500 text-sm mb-1.5 ">
                            {user?.rol === "PROFESIONAL"
                              ? "Nueva reserva"
                              : "Se genero una nueva serva"}

                            <div className="text-xs text-blue-600 ">
                              Hace 1 minuto
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <a
                      href="#"
                      className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 "
                    >
                      <div className="inline-flex items-center ">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-500"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Ver todas
                      </div>
                    </a>
                  </div>
                </div> */}

                <Link to="/ajustes">
                  <RiSettings3Line className="w-6 h-6 text-gray-400 hover:text-primary" />
                </Link>

                <div className="dropdown inline-block relative">
                  <button className="text-gray-700 font-semibold rounded inline-flex items-center mb-2">
                    <span className="text-gray-700 flex items-center ">
                      <div className="cursor-pointer font-semibold w-10 h-10 bg-blue-200 text-blue-600 flex items-center justify-center rounded-full">
                        {user?.nombre.split("")[0].toUpperCase()}
                      </div>
                    </span>
                  </button>
                  <ul className="dropdown-menu absolute hidden z-40 text-gray-700 bg-white border rounded-lg right-5 p-1 ">
                    <li>
                      <Link
                        className="rounded-t py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                        to="/ajustes"
                      >
                        Ajustes
                      </Link>
                    </li>

                    <RoleGuardComponent rol={[ROLES.CLIENTE]}>
                      <li>
                        <Link
                          className="py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                          to="/direcciones"
                        >
                          Direcciones
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                          to="/historial"
                        >
                          Historial
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                          to="/favoritos"
                        >
                          Favoritos
                        </Link>
                      </li>
                    </RoleGuardComponent>

                    <RoleGuardComponent rol={[ROLES.ADMIN]}>
                      <li>
                        <Link
                          className="py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                          to="/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                          to="/"
                        >
                          Usuarios
                        </Link>
                      </li>
                    </RoleGuardComponent>

                    <RoleGuardComponent rol={[ROLES.PROFESIONAL]}>
                      <li>
                        <Link
                          className="py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                          to="/direcciones"
                        >
                          Direcciones
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                          to="/historial-servicios"
                        >
                          Historial
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="py-2 px-4 block whitespace-no-wrap text-left hover:text-primary hover:bg-gray-200"
                          to="/horarios"
                        >
                          Horarios
                        </Link>
                      </li>
                    </RoleGuardComponent>

                    <li>
                      <button
                        className="rounded-b w-full text-left py-2 px-4 block whitespace-no-wrap hover:text-red-600  hover:bg-red-200"
                        onClick={logout}
                      >
                        Salir
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="text-white bg-primary hover:bg-bgHover focus:ring-4 focus:ring-primary-300 rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Registrarme
                </Link>
              </>
            )}

            {/* <button
              onClick={handleMenu}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Menu Abierto</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button> */}
          </div>
       {/*    <div
            className={`"justify-between items-center w-full lg:flex lg:w-auto lg:order-1" ${
              !open && "hidden"
            }`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a
                  href="https://calyaan.com/"
                  className="block py-2 pr-4 pl-3 text-md text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
                >
                  Centro de estética
                </a>
              </li>
              <li>
                <a
                  href="https://calyaan.com/masajes-empresariales/"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
                >
                  Empresas
                </a>
              </li>
              <li>
                <a
                  href="https://calyaan.com/blog/"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="https://calyaan.com/quienes-somos/"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="https://calyaan.com/colaboradores/"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
                >
                  Trabaja con nosotros
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </nav>
    </header>
  );
};

export default Header2;
