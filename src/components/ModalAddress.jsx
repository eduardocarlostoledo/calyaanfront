import React, { useEffect, useState } from "react";
import { AiOutlineArrowDown, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { localidades } from "../data";

const ModalAddress = ({
  handleModalAddress,
  crearDireccion,
  actualizarDireccion,
  addressEdit = false,
}) => {
  const [direccionState, setDireccionState] = useState({
    nombre: "",
    direccion: "",
    info: "",
    localidad: "",
  });



  const { nombre, direccion, info, localidad } = direccionState;

  useEffect(()=>{
    if(addressEdit){
      setDireccionState(addressEdit)
    }
  },[addressEdit])

  const handleChange = (e) => {
    setDireccionState({
      ...direccionState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !direccion || !info || !localidad) {
      return toast.error(
        "Los campos nombre, dirección, información adicional y localidad son obligatorios"
      );
    }

    if (!addressEdit) {
      crearDireccion(direccionState);
    } else {
      actualizarDireccion(direccionState);
    }

    setDireccionState({
      nombre: "",
      direccion: "",
      info: "",
      localidad: "",
    });

    handleModalAddress();
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="flex items-start justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                Direcciones
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-cente"
                data-modal-hide="staticModal"
                onClick={handleModalAddress}
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Nombre de Dirección
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      placeholder="Casa"
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={nombre}
                      onChange={handleChange}
                    />
                    {/* <p className="text-red-500 text-xs italic">Por favor rellene este campo.</p> */}
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="direccion"
                    >
                      Dirección
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      name="direccion"
                      id="direccion"
                      value={direccion}
                      onChange={handleChange}
                      placeholder="Dirección"
                    />
                    {/* <p className="text-red-500 text-xs italic">Por favor rellene este campo.</p> */}
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="info"
                    >
                      Información adicional
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      name="info"
                      id="info"
                      value={info}
                      onChange={handleChange}
                      placeholder="Información adicional"
                    />
                    <p className="text-gray-600 text-xs italic">
                      Ejemplo: Conjunto Int 4...
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-2">
                  <div className="w-full md:w-1/2 px-3 mb-4">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="ciudad"
                    >
                      Ciudad
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="ciudad"
                      type="text"
                      placeholder="Bogota"
                      disabled={true}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="localidad"
                    >
                      Localidad
                    </label>
                    <div className="relative">
                      <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        name="localidad"
                        id="localidad"
                        value={localidad}
                        onChange={handleChange}
                      >
                        <option value="">Localidades</option>{" "}
                        {/* Opción por defecto */}
                        {localidades.map((localidad) => (
                          <option value={localidad} key={localidad}>
                            {localidad}
                          </option>
                        ))}
                      </select>

                      {/* <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        name="localidad"
                        id="localidad"
                        value={localidad}
                        onChange={handleChange}
                      >
                        {localidades.map((localidad, index) => (
                          <option key={index} value={localidad.split(" ")[1]}>
                            {localidad}
                          </option>
                        ))}
                      </select> */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <AiOutlineArrowDown className="fill-current h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center py-6 space-x-2 border-t border-gray-200 rounded-b">
                  <button
                    type="submit"
                    className="text-white bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Guardar
                  </button>
                  <button
                    data-modal-hide="staticModal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                    onClick={handleModalAddress}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAddress;
