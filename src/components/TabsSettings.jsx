import React, { useEffect, useState } from "react";

import { GiSettingsKnobs } from "react-icons/gi";
import { CiViewList } from "react-icons/ci";
import { MdDirections, MdFavorite } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import RoleGuardComponent from "../guards/RoleGuardComponent";
import { ROLES } from "../helpers/Logic/roles";

const TabsSettings = () => {
  let location = useLocation();

  const { user } = useSelector((state) => ({ ...state.auth }));

  console.log(user)

  return (
    <div className="border-b border-gray-200">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center justify-center items-center text-gray-500 ">
        <li className="mr-2">
          <Link
            to="/ajustes"
            className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
              location.pathname === "/ajustes"
                ? "border-primary text-primary"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
          >
            <GiSettingsKnobs className="mr-2 w-5 h-5" />
            Ajustes
          </Link>
        </li>

        <li className="mr-2">
          <Link
            to="/direcciones"
            className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
              location.pathname === "/direcciones"
                ? "border-primary text-primary"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
          >
            <MdDirections className="mr-2 w-5 h-5" />
            Direcciones
          </Link>
        </li>

        {/* Acceso solo para clientes y admin */}
        <RoleGuardComponent rol={[ROLES.USER, ROLES.ADMIN]}>
          <li className="mr-2">
            <Link
              to="/historial"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/historial"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <CiViewList className="mr-2 w-5 h-5" />
              Historial de servicios
            </Link>
          </li>

          <li className="mr-2">
            <Link
              to="/favoritos"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/favoritos"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <MdFavorite className="mr-2 w-5 h-5" />
              Favoritos
            </Link>
          </li>

          <li className="mr-2">
            <Link
              to="/fidelidad"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/fidelidad"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <MdFavorite className="mr-2 w-5 h-5" />
              Fidelidad
            </Link>
          </li>
        </RoleGuardComponent>

        <RoleGuardComponent rol={[ROLES.PROFESSIONAL, ROLES.ADMIN]}>
          <li className="mr-2">
            <Link
              to="/historial-servicios"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/historial-servicios"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <CiViewList className="mr-2 w-5 h-5" />
              Historial de servicios
            </Link>
          </li>

          <li className="mr-2">
            <Link
              to="/horarios"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/horarios"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <AiFillClockCircle className="mr-2 w-5 h-5" />
              Horarios
            </Link>
          </li>

          <li className="mr-2">
            <Link
              to="/calendario"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/calendario"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <AiFillCalendar className="mr-2 w-5 h-5" />
              Calendario
            </Link>
          </li>

          <li className="mr-2">
            <Link
              to="/perfil-profesional"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/perfil-profesional"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <CiViewList className="mr-2 w-5 h-5" />
              Perfil Profesional
            </Link>
          </li>

          <li className="mr-2">
            <Link
              to="/fidelidad-profesional"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/fidelidad-profesional"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <MdFavorite className="mr-2 w-5 h-5" />
              Fidelidad
            </Link>
          </li>

          <li className="mr-2">
            <Link
              to="/referidos"
              className={`inline-flex p-4 rounded-t-lg border-b-2 border-transparent group ${
                location.pathname === "/referidos"
                  ? "border-primary text-primary"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <MdFavorite className="mr-2 w-5 h-5" />
              Referidos
            </Link>
          </li>
        </RoleGuardComponent>
      </ul>
    </div>
  );
};

export default TabsSettings;
