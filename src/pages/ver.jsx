import React from "react";

const Ver = () => {
  return (
    <>
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
  <section className="bg-white shadow sm:rounded-lg">
    <header className="px-4 py-5 sm:px-6 bg-gray-100">
      <h2 className="text-lg leading-6 font-medium text-gray-900">
        Ajustes Generales
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Establece tus preferencias generales aquí.
      </p>
    </header>
    <div className="divide-y divide-gray-200">
      <div className="py-4 px-6 border-b">
        <label className="block font-medium text-gray-700 mb-2">
          Nombre
        </label>
        <input type="text" className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Ingresa tu nombre"/>

        <label className="block font-medium text-gray-700 mt-4 mb-2">
          Correo electrónico
        </label>
        <input type="email" className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Ingresa tu correo electrónico"/>

        <label className="block font-medium text-gray-700 mt-4 mb-2">
          Contraseña
        </label>
        <input type="password" className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Ingresa tu contraseña"/>

        <div className="flex items-center mt-4">
          <input id="remember_me" name="remember_me" type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"/>
          <label for="remember_me" className="ml-2 block text-sm text-gray-900">
            Recordarme
          </label>
        </div>

        <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md">
          Guardar cambios
        </button>
      </div>

    </div>
  </section>

  <section className="bg-gray-50 shadow sm:rounded-lg mt-4">
    <header className="px-4 py-5 sm:px-6">
      <h2 className="text-lg leading-6 font-medium text-gray-900">
        Ajustes Avanzados
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Establece tus preferencias avanzadas aquí.
      </p>
    </header>
    <div className="divide-y divide-gray-200">
      <div className="py-4 px-6 border-b">
        <label className="block font-medium text-gray-700 mb-2">
          Tema
        </label>
        <select className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
        </div>
        </div>
        </section>
        </div>

    </>
  );
};

export default Ver;
