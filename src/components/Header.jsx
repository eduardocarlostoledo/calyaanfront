import React, { useState } from "react";
import { AiOutlineBell, AiOutlineShoppingCart } from "react-icons/ai";
import { RiSettings3Line } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLogout } from "../redux/features/authSlice";
import RoleGuardComponent from "../guards/RoleGuardComponent";
import { ROLES } from "../helpers/Logic/roles";
import { useNavigate } from 'react-router-dom';

const Header2 = () => {  
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { user } = useSelector((state) => ({ ...state.auth }));
//console.log(user, "USUARIO HEADER")
  const handleMenu = () => {
    setOpen(!open);
  };

  const logout = () => {
    dispatch(setLogout());    
    navigate('/');
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
              <AiOutlineShoppingCart className="w-6 h-6 mr-2 text-gray-400 hover:text-primary cursor-pointer" />
            </Link>
            {user ? (
              <div className="flex items-center space-x-2 justify-center">           
                <Link to="/ajustes">
                  <RiSettings3Line className="w-6 h-6 text-gray-400 hover:text-primary" />
                </Link>

                <div className="dropdown inline-block relative">
                  <button className="text-gray-700 font-semibold rounded inline-flex items-center mb-2">
                    <span className="text-gray-700 flex items-center ">
                      <div className="cursor-pointer font-semibold w-10 h-10 bg-blue-200 text-blue-600 flex items-center justify-center rounded-full">
                        
                        
                      {user && user.nombre && user.nombre.length > 0 ? user.nombre[0].toUpperCase() : ''}



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

          </div>         
        </div>
      </nav>
    </header>
  );
};

export default Header2;
