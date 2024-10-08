import React, { useEffect, useState } from "react";
import clienteAxios from "../../../../config/axios";
import { toast } from "react-toastify";

import { motion, AnimatePresence } from "framer-motion";
import { NumericFormat } from "react-number-format";

const Tools = () => {
    const [minDate, setMinDate] = useState("");

    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const minDateString = today.toISOString().split("T")[0];
        setMinDate(minDateString);
    }, []);

    const [coupon, setCoupon] = useState({
        codigo: "",
        tipoDescuento: "",
        descuento: "",
        vencimiento: "",
    });

    const [cuponesNoVigentes, setCuponesNoVigentes] = useState([]);
    const [cuponesVigentes, setCuponesVigentes] = useState([]);

    const { codigo, tipoDescuento, descuento, vencimiento } = coupon;

    const handleChange = (e) => {
        setCoupon({
            ...coupon,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if ([codigo, tipoDescuento, descuento].includes("")) {
                return toast.error("Todos los campos son obligatorios");
            }

            let { data } = await clienteAxios.post(`/api/coupon`, coupon);

            toast.success(data.msg);

            setCoupon({
                codigo: "",
                tipoDescuento: "",
                descuento: "",
                vencimiento: "",
            });

            setCuponesVigentes([...cuponesVigentes, data.coupon]);
        } catch (error) {
            console.log(error);
            const errorMsg =
                error.response?.data?.msg ||
                error.response?.data?.message ||
                "Estamos presentando problemas internos";
            toast.error(errorMsg);
        }
    };

    const eliminarCupon = async (coupon) => {
        try {
            let { data } = await clienteAxios.patch(
                `/api/coupon/delete/${coupon._id}`
            );

            toast.success(data.msg);

            if (coupon.vigente) {
                const cuponesVigentesActualizados = cuponesVigentes.filter(
                    (cupon) => cupon._id !== coupon._id
                );
                setCuponesVigentes(cuponesVigentesActualizados);
            } else {
                const cuponesNoVigentesActualizados = cuponesNoVigentes.filter(
                    (cupon) => cupon._id !== coupon._id
                );
                setCuponesNoVigentes(cuponesNoVigentesActualizados);
            }
        } catch (error) {
            console.log(error);
            const errorMsg =
                error.response?.data?.msg ||
                error.response?.data?.message ||
                "Estamos presentando problemas internos";
            toast.error(errorMsg);
        }
    };

    useEffect(() => {
        const obtenerCupones = async () => {
            try {
                let { data } = await clienteAxios.get(`/api/coupon/list-coupons`);

                setCuponesVigentes(data.cuponesVigentes);
                setCuponesNoVigentes(data.cuponesNoVigentes);
            } catch (error) {
                console.log(error);
                const errorMsg =
                    error.response?.data?.msg ||
                    error.response?.data?.message ||
                    "Estamos presentando problemas internos";
                toast.error(errorMsg);
            }
        };
        obtenerCupones();
    }, []);

    const handleCopyCoupon = (text) => {
        navigator.clipboard.writeText(text);
    };


    const [selectedAccordion, setSelectedAccordion] = useState(null);

    const toggleAccordion = (accordionId) => {
        setSelectedAccordion(
            selectedAccordion === accordionId ? null : accordionId
        );
    };

    const isAccordionOpen = (accordion) => {
        return selectedAccordion === accordion;
    };

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold mb-6">Herramientas</h2>

            <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8">
                <div className="rounded bg-white  shadow p-6">
                    <div className="relative w-full mb-10">
                        <h3 className="focus:outline-none text-gray-800  leading-4 tracking-normal text-base mb-6 font-bold">
                            Cupones
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4"
                        >
                            <div>
                                <label
                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Código*
                                </label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    name="codigo"
                                    value={codigo}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="CUP2021"
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Tipo de Descuento*
                                </label>
                                <select
                                    type="text"
                                    onChange={handleChange}
                                    value={tipoDescuento}
                                    name="tipoDescuento"
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="porcentaje">Porcentaje</option>
                                    <option value="valor">Valor</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Descuento*
                                </label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    name="descuento"
                                    value={descuento}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Porcentaje 25 / Valor 25.000 "
                                />
                            </div>

                            <div>
                                <label
                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Vencimiento
                                </label>
                                <input
                                    type="date"
                                    value={vencimiento}
                                    onChange={handleChange}
                                    min={minDate}
                                    name="vencimiento"
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                />
                            </div>

                            <div>
                                <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
                                    <p className="text-sm font-medium leading-none text-white">
                                        Crear Cupón
                                    </p>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className=" mb-10 w-full">
                        <h3 className="focus:outline-none text-gray-800  leading-4 tracking-normal text-base mb-6 font-bold">
                            Cupones vigentes
                        </h3>
                        {cuponesVigentes.length > 0 ? (
                            <>
                                {cuponesVigentes.map((cupon, index) => (
                                    <div
                                        className="bg-white mt-2  border border-gray-200 rounded-md transition-all duration-1000"
                                        key={cupon._id}
                                    >
                                        <ul className="shadow-box transition-all duration-1000">
                                            <li
                                                className="relative border-b border-gray-200"
                                                key={cupon._id}
                                            >
                                                <button
                                                    type="button"
                                                    className="w-full px-8 py-6 text-left"
                                                    onClick={() => toggleAccordion(cupon._id)}
                                                >
                                                    <div className="flex items-center justify-between transition-all duration-1000">
                                                        <div className="flex items-center">

                                                            <p className="focus:outline-none font-medium text-gray-600  text-base tracking-normal leading-4">
                                                                {cupon.codigo} -{" "}
                                                                {cupon.vencimiento.split("T")[0]} -{" "}
                                                            </p>
                                                            {cupon.tipoDescuento === "valor" ?
                                                                <NumericFormat
                                                                    value={cupon.descuento}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                    prefix={"$"}
                                                                />
                                                                :
                                                                <>
                                                                    {cupon.descuento}%
                                                                </>

                                                            }
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={(e) =>
                                                                handleCopyCoupon(cupon.codigo)
                                                            }
                                                                className="px-2 py-2 bg-primary hover:bg-bgHover focus:bg-bgHover  text-white focus:outline-none font-normal text-xs leading-3 rounded">
                                                                Copiar Código
                                                            </button>
                                                            <button
                                                                onClick={(e) =>
                                                                    eliminarCupon({ _id: cupon._id, vigente: true })
                                                                }
                                                                className="focus:ring-2 focus:ring-offset-2 focus:ring-red-700 focus:outline-none px-6 py-2 bg-white  hover:bg-red-700 hover:text-white border border-red-700 text-red-700 font-normal text-xs leading-3 rounded"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>

                                                    </div>
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {isAccordionOpen(cupon._id) && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <div className="p-6 border-b border-gray-200">

                                                                {cupon.reclamados.length > 0 ?
                                                                    cupon.reclamados.map((usuario) => (
                                                                        <div className="w-full flex items-center justify-between" key={usuario._id}>
                                                                            <div className="flex items-center">
                                                                                <img src={usuario.img} className="w-10 h-10 bg-gray-300 rounded-full" />
                                                                                <div className="pl-3">
                                                                                    <p className="text-sm font-medium leading-normal text-gray-800">
                                                                                        {usuario.nombre} {usuario.apellido}
                                                                                    </p>
                                                                                    <p className="text-xs leading-3 pt-2 text-gray-600">
                                                                                        {usuario.email}  - {usuario.telefono}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))

                                                                    :
                                                                    <p className="text-sm font-medium leading-normal text-gray-800">
                                                                        No hay usuarios que hayan redimido el cupón
                                                                    </p>
                                                                }


                                                            </div>


                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p>No se encontraron cupones</p>
                        )}
                    </div>

                    <div className="  w-full">
                        <h3 className="focus:outline-none text-gray-800  leading-4 tracking-normal text-base mb-6 font-bold">
                            Cupones vencidos
                        </h3>
                        {cuponesNoVigentes.length > 0 ? (
                            <>
                                {cuponesNoVigentes.map((cupon, index) => (
                                    <div
                                        className="bg-white mt-2  border border-gray-200 rounded-md transition-all duration-1000"
                                        key={cupon._id}
                                    >
                                        <ul className="shadow-box transition-all duration-1000">
                                            <li
                                                className="relative border-b border-gray-200"
                                                key={cupon._id}
                                            >
                                                <button
                                                    type="button"
                                                    className="w-full px-8 py-6 text-left"
                                                    onClick={() => toggleAccordion(cupon._id)}
                                                >
                                                    <div className="flex items-center justify-between transition-all duration-1000">
                                                        <div className="flex items-center">

                                                            <p className="focus:outline-none font-medium text-gray-600  text-base tracking-normal leading-4">
                                                                {cupon.codigo} -{" "}
                                                                {cupon.vencimiento.split("T")[0]} -{" "}
                                                            </p>
                                                            {cupon.tipoDescuento === "valor" ?
                                                                <NumericFormat
                                                                    value={cupon.descuento}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                    prefix={"$"}
                                                                />
                                                                :
                                                                <>
                                                                    {cupon.descuento}%
                                                                </>

                                                            }
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={(e) =>
                                                                handleCopyCoupon(cupon.codigo)
                                                            }
                                                                className="px-2 py-2 bg-primary hover:bg-bgHover focus:bg-bgHover  text-white focus:outline-none font-normal text-xs leading-3 rounded">
                                                                Copiar Código
                                                            </button>
                                                            <button
                                                                onClick={(e) =>
                                                                    eliminarCupon({ _id: cupon._id, vigente: true })
                                                                }
                                                                className="focus:ring-2 focus:ring-offset-2 focus:ring-red-700 focus:outline-none px-6 py-2 bg-white  hover:bg-red-700 hover:text-white border border-red-700 text-red-700 font-normal text-xs leading-3 rounded"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {isAccordionOpen(cupon._id) && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <div className="p-6 border-b border-gray-200">

                                                                {cupon.reclamados.length > 0 ?
                                                                    cupon.reclamados.map((usuario) => (
                                                                        <div className="w-full flex items-center justify-between" key={usuario._id}>
                                                                            <div className="flex items-center">
                                                                                <img src={usuario.img} className="w-10 h-10 bg-gray-300 rounded-full" />
                                                                                <div className="pl-3">
                                                                                    <p className="text-sm font-medium leading-normal text-gray-800">
                                                                                        {usuario.nombre} {usuario.apellido}
                                                                                    </p>
                                                                                    <p className="text-xs leading-3 pt-2 text-gray-600">
                                                                                        {usuario.email}  - {usuario.telefono}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))

                                                                    :
                                                                    <p className="text-sm font-medium leading-normal text-gray-800">
                                                                        No hay usuarios que hayan redimido el cupón
                                                                    </p>
                                                                }

                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p>No se encontraron cupones</p>
                        )}
                    </div>
                </div>

                <div className="rounded border-gray-300  border-dashed border-2 h-24"></div>
            </div>
        </div>
    );
};

export default Tools;
