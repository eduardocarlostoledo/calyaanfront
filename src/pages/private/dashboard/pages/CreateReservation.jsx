import React, { useEffect } from "react";
import { hourSelect } from "../../../../data";
import { useState } from "react";
import { toast } from "react-toastify";
import clienteAxios from "../../../../config/axios";
import Spinner from "../../../../components/Spinner";
import { AiFillCloseCircle } from "react-icons/ai";
import limpiarHorarios from "../../../../helpers/Logic/limpiarHorarios";
import { localidadesLaborales } from "../../../../data";
import swal from "sweetalert";
import { NumericFormat } from "react-number-format";

import { FaArrowsAltV } from "react-icons/fa"

const CreateReservation = () => {
  const querystring = window.location.search;
  const params = new URLSearchParams(querystring);
  let id = params.get("id");
  const [editarReserva, setEditarReserva] = useState(false);
  const [linkPago, setLinkPago] = useState("");
  const [estado, setEstado] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargando2, setCargando2] = useState(false);
  const [reserva, setReserva] = useState({
    cliente_id: "",
    cliente_email: "",
    cliente_nombre: "",
    cliente_apellido: "",
    cliente_cedula: "",
    cliente_telefono: "",
    profesional_id: "",
    servicio: "",
    cantidad: "",
    precio: "",
    cita_servicio: "",
    hora_servicio: " ",
    direccion_servicio: "",
    info_direccion_servicio: "",
    localidad_serivicio: "",
    telefono_servicio: "",
    nuevo: true,
    coupon: "",
  });

  const [productos, setProdcutos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [liberar, setLiberar] = useState({}); //se va a guardar el dato de la reserva si existe en caso de reprogramacion

  useEffect(() => {
    if (id) {
      const getHistorial = async () => {
        try {
          let { data } = await clienteAxios.get(`/ordenes/getordenbyid/${id}`);

          let product = await clienteAxios.get(
            `/api/products/name/${data.servicio}`
          );

          setReserva(data);

          setServicios([product.data]);

          setEstado("nuevo");

          if (data.hora_servicio && data.dia_servicio) {
            console.log("Se han resguardado los datos de la reserva.");
            setLiberar({
              ...data,
              liberar_hora_servicio: data.hora_servicio,
              liberar_dia_servicio: data.dia_servicio,
              liberar_profesional_id: data.profesional_id,
              liberar_profesional_email: data.profesional_email,
              liberar_profesional_telefono: data.profesional_telefono,
            });
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
      getHistorial();
    }
  }, [id]);

  const handleSubmitUserEmail = async (e) => {
    setCargando(true);

    e.preventDefault();

    if (userEmail === "") {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      let { data } = await clienteAxios.post(`api/usuarios/email`, {
        email: userEmail,
      });

      setEstado("nuevo");

      setReserva({
        ...reserva,
        cliente_id: data?._id,
        cliente_email: data?.email,
        cliente_nombre: data?.nombre,
        cliente_apellido: data?.apellido,
        cliente_cedula: data?.cedula,
        cliente_telefono: data?.telefono,
        direccion_Servicio: data?.direccionDefault?.direccion,
        adicional_direccion_Servicio: data?.direccionDefault?.info,
        ciudad_Servicio: data?.direccionDefault?.ciudad,
        localidad_Servicio: data?.direccionDefault?.localidad,
        telefono_Servicio: data?.telefono,
        nuevo: false,
      });

      setCargando(false);
      setUserEmail("");
    } catch (err) {
      console.log(err);
      setCargando(false);
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  };

  const {
    // username,
    cliente_id,
    cliente_email,
    cliente_nombre,
    cliente_apellido,
    cliente_cedula,
    cliente_telefono,
    user_profesional_id,
    profesional_id,
    profesional_email,
    profesional_nombre,
    profesional_apellido,
    profesional_telefono,
    servicio,
    //servicio_img,
    cantidad,
    precio,
    dia_servicio,
    hora_servicio,
    direccion_Servicio,
    adicional_direccion_Servicio,
    ciudad_Servicio,
    localidad_Servicio,
    telefono_Servicio,
  } = reserva;

  // Ordenar los productos alfabéticamente por nombre
   const productosOrdenados = productos?.sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  ); 

  const [coupon, setCoupon] = useState("")

  const applyCoupon = async (e) => {
    e.preventDefault()

    try {
      let { data } = await clienteAxios.post(`/api/coupon/discount`, { coupon, valor: servicios[0]?.precio });

      servicios[0].valorTotal = data.valorTotal
      servicios[0]._idCodigo = data._idCodigo

      setReserva({
        ...reserva,
        coupon: data._idCodigo,
        valorTotal: servicios[0].valorTotal = data.valorTotal
      });

    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Estamos presentando problemas internos";
      toast.error(errorMsg);
    }
  };

  const handleChangeServicio = (e) => {
    if (!servicios.includes(e.target.value) && e.target.value !== "" && servicios.length < 1) {
      let busqueda = productos.filter(
        (servicio) => servicio._id === e.target.value
      );

      setServicios([...servicios, ...busqueda]);
    }
  };
  // console.log("PRODCTOS", productos)
  // console.log("servicio", servicios)

  useEffect(() => {
    const getProductos = async () => {
      try {
        let { data } = await clienteAxios.get(`/api/products`);
console.log(data)
        setProdcutos(data);
      } catch (err) {
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getProductos();
  }, []);

  const [orderId, setOrderId] = useState("");

  function generarPreferencias() {
    let producto = servicios[0].nombre;
    let precio = servicios[0].valorTotal ? servicios[0].valorTotal : servicios[0].precio;

    setCargando2(true);

    const clienteNuevo = {
      email: reserva.cliente_email,
      nombre: reserva.cliente_nombre,
      apellido: reserva.cliente_apellido,
      cedula: reserva.cliente_cedula,
      telefono: reserva.cliente_telefono,
      direccion: reserva.direccion_Servicio,
      info: reserva.adicional_direccion_Servicio,
      ciudad: "Bogotá",
      localidad: reserva.localidad_Servicio,
    };

    console.log(reserva)

    if (reserva.nuevo) {
      clienteAxios
        .post(
          `${import.meta.env.VITE_APP_BACK}/api/usuarios/reserva-usuario`,
          clienteNuevo
        )
        .then((datos1) => {
          let reservaRequest = {
            ...reserva,
            serviciosIds: servicios[0].idWP,
            cliente_id: datos1.data._id,
          };

          return fetch(
            `${import.meta.env.VITE_APP_BACK}/pay/preference-manual`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reservaRequest),
            }
          ).catch(console.log);
        })
        .then((respuesta1) => respuesta1.json())
        .then((datos1) => {
          return fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN
                }`,
            },
            body: JSON.stringify({
              items: [
                {
                  title: producto,
                  unit_price: Number(precio),
                  quantity: Number(1),
                },
              ],
              back_urls: {
                success: `${import.meta.env.VITE_APP_BACK
                  }/api/pay/feedback/success/manual`,
                failure: `${import.meta.env.VITE_APP_BACK
                  }/api/pay/feedback/failure/manual`,
                pending: `${import.meta.env.VITE_APP_BACK
                  }/api/pay/feedback/pending/manual`,
              },
              auto_return: "approved",
              payment_methods: {
                excluded_payment_types: [
                  { id: "ticket" },
                  { id: "bank_transfer" },
                ],
              },
              statement_descriptor: "CALYAAN COLOMBIA",
              external_reference: `${datos1.newOrder}`,
            }),
          });
        })
        .then((respuesta2) => respuesta2.json())
        .then((datos2) => {
          setLinkPago(datos2.init_point);
          setCargando2(false);
        })
        .catch((error) => {
          console.error(error);
          setCargando2(false);
        });
      return;
    }

    const serviciosRequest = servicios.map((servicio) => servicio.idWP);

    console.log(servicios)
    console.log("productos",productos)

    let reservaRequest = {
      cliente_id: reserva.cliente_id,
      servicios: serviciosRequest,
      direccion_servicio: reserva.direccion_servicio,
      info_direccion_servicio: reserva.info_direccion_servicio,
      localidad_serivicio: reserva.localidad_serivicio,
      telefono_servicio: reserva.telefono_servicio,
      coupon: reserva.coupon,
    };

    console.log(reserva.coupon)
    fetch(`${import.meta.env.VITE_APP_BACK}/api/pay/preference-manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservaRequest),
    })
      .then((respuesta1) => respuesta1.json())
      .then((datos1) => {
        return fetch("https://api.mercadopago.com/checkout/preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN
              }`,
          },
          body: JSON.stringify({
            items: [
              {
                title: producto,
                unit_price: Number(precio),
                quantity: Number(1),
              },
            ],
            back_urls: {
              success: `${import.meta.env.VITE_APP_BACK
                }/pay/feedback/success/manual`,
              failure: `${import.meta.env.VITE_APP_BACK
                }/pay/feedback/failure/manual`,
              pending: `${import.meta.env.VITE_APP_BACK
                }/pay/feedback/pending/manual`,
            },
            auto_return: "approved",
            payment_methods: {
              excluded_payment_types: [
                { id: "ticket" },
                { id: "bank_transfer" },
              ],
            },
            statement_descriptor: "CALYAAN COLOMBIA",
            external_reference: `${datos1.newOrder}`,
          }),
        })
          .then((respuesta2) => respuesta2.json())
          .then((datos2) => {
            setLinkPago(datos2.init_point);
            setCargando2(false);
          });
      })
      .catch((error) => {
        console.error(error);
        setCargando2(false);
      });
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkPago);
  };

  const handleChange = (e) => {
    setReserva({
      ...reserva,
      [e.target.name]: e.target.value,
    });
  };

  const [inputValue, setInputValue] = useState({
    address: "",
    date: "",
    time: "",
  });
  const [cargando3, setCargando3] = useState(false);
  const [profesionalesRequest, setProfesionalesRequest] = useState([]);
  let { date, time } = inputValue;

  const handleChangeProfesional = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
    setReserva({
      ...reserva,
      hora_servicio: e.target.value,
    });
  };

  useEffect(() => {
    const obtenerProfesional = async () => {
      setCargando3(true);
      try {
        const { data } = await clienteAxios.post(
          "api/reservas/profesionales/fecha",
          {
            fecha: date,
            especialidad: servicios[0]?.nombre,
            localidad: reserva?.localidad_Servicio,
          }
        );
        // console.log(data);
        if (data?.length > 0) {
          const filteredData = data.filter((obj) => obj.creador !== null); // Filtrar objetos con creador distinto de null
          const updatedArray = filteredData.map((obj) => ({
            ...obj,
            styles: false,
          }));
          // const updatedArray = data.map((obj) => ({ ...obj, styles: false }));
          setProfesionalesRequest(updatedArray);
        } else {
          setProfesionalesRequest(data);
        }
        setCargando3(false);
      } catch (err) {
        console.log(err);
      }
    };
    obtenerProfesional();
  }, [date]);

  function eliminarDelCarrito() {
    setServicios([]);
  }

  const [confirmarReserva, setConfirmarReserva] = useState(false);
  const [profesional, setProfesional] = useState({});
  const [hourSelect, setHoursSelect] = useState([]); // mapea la disponibilidad.horarios del profesional

  const handleProfesional = (profesional) => {
    const updatedArray = profesionalesRequest.map((obj) =>
      obj._id === profesional._id
        ? { ...obj, styles: true }
        : { ...obj, styles: false }
    );

    setProfesionalesRequest(updatedArray);
    // console.log("Updated Array", updatedArray)
    setProfesional(profesional);

    // console.log("PROFESIONAL.HORARIOS",profesional.horarios)
    let horarios = profesional.horarios;

    setHoursSelect(limpiarHorarios(horarios));
    // console.log("setHoursSelect HOURSELECT", hourSelect)

    setReserva({
      ...reserva,
      dia_servicio: date,
      hora_servicio: time,
      user_profesional_id: profesional.creador.creador._id,
      profesional_id: profesional.creador._id,
      profesional_email: profesional.creador.creador.email,
      profesional_nombre: profesional.creador.creador.nombre,
      profesional_apellido: profesional.creador.creador.apellido,
      profesional_telefono: profesional.creador.creador.telefono,
    });
    swal({
      title: "Profesional seleccionado",
      text: "Has seleccionado un profesional para tu servicio",
      icon: "success",
      button: "Aceptar",
    });
    setConfirmarReserva(true);
  };

  const guardarReserva = async () => {
    try {
      if (liberar && Object.keys(liberar).length > 0) {
        // console.log("liberando reserva")
        let { dataFree } = await clienteAxios.post(
          `/pay/finish/liberar`,
          liberar
        );
        let { data } = await clienteAxios.post(`/pay/finish/order`, reserva);
        setConfirmarReserva(false);

        toast.success(dataFree.msg);
        toast.success(data.msg);
      }
      // console.log("asignando reserva")

      let { data } = await clienteAxios.post(`/pay/finish/order`, reserva);

      setConfirmarReserva(false);

      toast.success(dataFree.msg);
      toast.success(data.msg);
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  };

  console.log(servicios)
  console.log(typeof productos)


  // console.log("LIBERAR", liberar)
  return (
    <div className="w-full mx-auto ">
      <div className="relative flex flex-col  break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">
              Crear nueva reserva
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <div className="flex justify-between py-2 mb-5">
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Información de usuario
            </h6>
            <div className="border border-gray-300  shadow-sm w-56 rounded flex relative">
              <select
                onChange={(e) => setEstado(e.target.value)}
                value={estado}
                className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded"
              >
                <option value="">Estado</option>
                <option value="registrado">Registrado</option>
                <option value="nuevo">Nuevo usuario</option>
              </select>
              <div
                className="px-4 flex items-center border-l border-gray-300  flex-col justify-center text-gray-500
                                       absolute right-0 bottom-0 top-0 mx-auto z-20 pointer-events-none "
              >
                <FaArrowsAltV className="w-4 h-4" />
              </div>
            </div>
          </div>

          {estado === "nuevo" ? (
            <>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      correo electrónico
                    </label>
                    <input
                      type="email"
                      name="cliente_email"
                      onChange={handleChange}
                      value={cliente_email}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Correo Electrónico"
                    />
                  </div>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Nombres
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Nombres"
                      value={cliente_nombre}
                      name="cliente_nombre"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Cédula
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Cédula"
                      value={cliente_cedula}
                      name="cliente_cedula"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Apellidos
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Apellidos"
                      name="cliente_apellido"
                      value={cliente_apellido}
                      onChange={handleChange}
                    />
                  </div>

                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="cliente_telefono"
                      onChange={handleChange}
                      value={cliente_telefono}
                      placeholder="Teléfono"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                INFORMACIÓN DE Contacto
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="direccion_Servicio"
                      onChange={handleChange}
                      value={direccion_Servicio}
                      placeholder="Dirección del cliente"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      INFORMACIÓN ADICIONAL
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Información adicional"
                      name="adicional_direccion_Servicio"
                      onChange={handleChange}
                      value={adicional_direccion_Servicio}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Ciudad
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Ciudad"
                      name="ciudad_Servicio"
                      onChange={handleChange}
                      value={ciudad_Servicio}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Localidad
                    </label>

                    <select
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={localidad_Servicio}
                      onChange={handleChange}
                      name="localidad_Servicio"
                    >
                      <option value="">Localidades</option>
                      {localidadesLaborales?.map((localidad, index) => (
                        <option key={index} value={localidad}>
                          {localidad}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-2 mb-4"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              {!cargando ? (
                <form onSubmit={handleSubmitUserEmail}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Correo Electrónico de usuario
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Correo Electrónico"
                    />
                  </div>
                  <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
                    <p className="text-sm font-medium leading-none text-white">
                      Buscar Usuario
                    </p>
                  </button>
                </form>
              ) : (
                <Spinner />
              )}
            </>
          )}

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          <div className="flex justify-between py-2 mb-5">
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Información de servicio
            </h6>
          </div>

          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-6">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  Servicios
                </label>

                <select
                  id="servicios"
                  className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded"
                  //value={especialidad}
                  onChange={handleChangeServicio}
                  name="servicios"
                >
                  <option value="">Servicios</option>
                  {productosOrdenados?.map((servicio, index) => (
                    <option key={index} value={servicio._id}>
                      {servicio.nombre}
                    </option>
                  ))} 
                </select>
              </div>
              {servicios?.length > 0 &&
                <div className="relative w-full mb-3">
                  <form onSubmit={applyCoupon}>
                    <div>
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Cupón
                      </label>
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Ingresa Cupón"
                      />
                    </div>
                    <div>
                      <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
                        <p className="text-sm font-medium leading-none text-white">
                          Aplicar Cupón
                        </p>
                      </button>
                    </div>
                  </form>
                </div>
              }
            </div>

            {servicios?.length > 0 && (
              <div id="menu" className={`w-full px-4 flex`}>
                <div className="pt-11 sm:px-6 px-4 pb-4 sm:pb-6 flex-row space-y-12 w-full relative ">
                  {servicios.map((servicio, index) => (
                    <div
                      key={index}
                      className=" flex flex-row w-full justify-between sm:space-x-4 "
                    >
                      <div className="flex gap-4">
                        <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={servicio?.img}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="flex justify-center items-start flex-col mt-4 sm:mt-0">
                          <p className="text-base leading-4 text-gray-800">
                            {servicio.nombre}
                          </p>
                          <p className="text-sm leading-none my-2 text-gray-600">
                            Cantidad: 1
                          </p>
                          <NumericFormat
                            value={servicio.precio}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                          />
                        </div>
                      </div>

                      <div className="  sm:right-0 sm:inset-y-3">
                        <button
                          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 "
                          onClick={() => eliminarDelCarrito()}
                        >
                          <svg
                            className="text-gray-800 hover:text-black fill-stroke"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center items-center w-full flex-col space-y-2">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">
                        Total
                      </p>
                      <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">
                        {
                          !servicios[0]._idCodigo ?


                            servicios.length > 1 ? (
                              <p>
                                {" "}
                                <NumericFormat
                                  value={servicios.reduce(
                                    (a, b) =>
                                      Number(a.precio) +
                                      Number(b.precio)
                                  )}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  prefix={"$"}
                                />
                              </p>
                            ) : (
                              <NumericFormat
                                value={servicios?.map((a) => a.precio)[0]}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                              />
                            )
                            :
                            <NumericFormat
                              value={servicios[0].valorTotal}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"$"}
                            />
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {linkPago ? (
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <div className="flex justify-between py-2 mb-5">
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Link de pago
                </h6>
              </div>

              <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-3/4 px-4">
                  <div className="w-full">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Link de pago
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={linkPago}
                      readOnly
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/5 px-4 mt-5">
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none text-white"
                  >
                    {" "}
                    Copiar Link{" "}
                  </button>
                </div>
              </div>
            </>
          ) : cargando2 ? (
            <Spinner />
          ) : (
            reserva.cliente_email &&
            servicios.length > 0 && (
              <button
                onClick={generarPreferencias}
                className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
              >
                <p className="text-sm font-medium leading-none text-white">
                  Generar Link de Pago
                </p>
              </button>
            )
          )}

          {reserva?.profesional_id && reserva?.estadoPago === "approved" && (
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Información de reserva - profesional Asignado
              </h6>

              <div className="flex flex-col items-center p-6">
                <img
                  src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                  className="w-24 h-24 mb-3 rounded-full shadow-lg"
                />
                <h5 className="mb-1 text-xl font-medium text-gray-900">
                  {reserva?.profesional_nombre} {reserva?.profesional_apellido}
                </h5>
                <span className="text-sm text-gray-500 text-center">
                  {reserva?.profesional_email}
                </span>
                <span className="text-sm text-gray-500"></span>
              </div>
            </>
          )}

          {reserva?.dia_servicio && reserva?.hora_servicio && (
            <div className="flex flex-col items-center p-6">
              <h5>Reserva Asignada</h5>
              <strong>
                {" "}
                Hora: {reserva?.hora_servicio || "N/A"} Dia:{" "}
                {reserva?.dia_servicio || "N/A"}{" "}
              </strong>
            </div>
          )}

          {id && reserva?.estadoPago === "approved" && (
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Información de reserva
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="date"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Fecha
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5"
                        placeholder="username.example"
                        required=""
                        onChange={handleChangeProfesional}
                      // value={date}
                      />
                    </div>

                    {hourSelect.length > 0 && (
                      <div>
                        <label
                          htmlFor="time"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Hora
                        </label>

                        <select
                          type="time"
                          name="time"
                          id="time"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5 "
                          required=""
                          onChange={handleChangeProfesional}
                        //value={time}
                        >
                          <option value="">Hora</option>
                          {hourSelect?.map((hour, index) => (
                            <option key={index} value={hour}>
                              {hour}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {date && (
                    <div className="mx-auto mt-6 flex bg-whitefull-screen flex-wrap items-center justify-around">
                      {!cargando3 ? (
                        profesionalesRequest.length > 0 ? (
                          profesionalesRequest.map((profesional) => (
                            <div
                              key={profesional._id} // Agregando la clave 'key'
                              className={`w-full max-w-sm rounded-lg shadow-md ${profesional.styles &&
                                "bg-gray-100 border border-gray-200 "
                                }`}
                            >
                              <div className="flex flex-col items-center p-6">
                                <img
                                  className="w-24 h-24 mb-3 rounded-full shadow-lg"
                                  src={
                                    profesional?.creador.creador.img
                                      ? profesional?.creador.creador.img
                                      : "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                                  }
                                />
                                <h5 className="mb-1 text-xl font-medium text-gray-900">
                                  {profesional.creador.creador.nombre}
                                </h5>
                                <span className="text-sm text-gray-500 text-center">
                                  {profesional.creador.descripcion}
                                </span>
                                <span className="text-sm text-gray-500"></span>
                                <div className="flex mt-4 space-x-3 md:mt-6">
                                  <div
                                    onClick={() =>
                                      handleProfesional(profesional)
                                    }
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover"
                                  >
                                    Seleccionar
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>{profesionalesRequest.msg}</>
                        )
                      ) : (
                        <Spinner />
                      )}
                    </div>
                  )}

                  {confirmarReserva && (
                    <button
                      onClick={guardarReserva}
                      className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
                    >
                      <p className="text-sm font-medium leading-none text-white">
                        Confirmar Reserva
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReservation;

// import React, { useEffect } from "react";
// import { hourSelect } from "../../../../data";
// import { useState } from 'react';
// import { toast } from "react-toastify";
// import clienteAxios from "../../../../config/axios";
// import Spinner from "../../../../components/Spinner";
// import { AiFillCloseCircle } from "react-icons/ai";

// const CreateReservation = () => {
// //  let producto = 'Camiseta de React';

//   const querystring = window.location.search
//   const params = new URLSearchParams(querystring)

//   let id = params.get('id')

//   const [editarReserva, setEditarReserva] = useState(false)

//   const [linkPago, setLinkPago] = useState('');

//   const [estado, setEstado] = useState("")

//   const [userEmail, setUserEmail] = useState("")

//   const [cargando, setCargando] = useState(false)
//   const [cargando2, setCargando2] = useState(false)

//   const [reserva, setReserva] = useState({
//     // username: "",
//     cliente_id: "",
//     cliente_email: "",
//     cliente_nombre: "",
//     cliente_apellido: "",
//     cliente_cedula: "",
//     cliente_telefono: "",
//     user_profesional_id: "",
//     profesional_id: "",
//     profesional_email: "",
//     profesional_nombre: "",
//     profesional_apellido: "",
//     profesional_telefono: "",
//     servicio: "",
//     //servicio_img,
//     cantidad: "",
//     precio: "",
//     dia_servicio: "",
//     hora_servicio: "",
//     direccion_Servicio: "",
//     adicional_direccion_Servicio: "",
//     ciudad_Servicio: "",
//     localidad_Servicio: "",
//     ciudad: "Bogota",
//     telefono_Servicio: "",
//     nuevo: true
//   })

//   const [productos, setProdcutos] = useState([])
//   const [servicios, setServicios] = useState([])

//   useEffect(() => {
//     if (id) {
//       const getHistorial = async () => {
//         try {

//           let { data } = await clienteAxios.get(
//             `/ordenes/getordenbyid/${id}`
//           );

//           let product = await clienteAxios.get(`/api/products/name/${data.servicio}`);

//           setReserva(data)

//           setServicios([product.data])

//           setEstado("nuevo")

//         } catch (error) {
//           console.log(error);
//           const errorMsg =
//             error.response?.data?.msg || error.response?.data?.message || "Estamos presentando problemas internos";
//           toast.error(errorMsg);
//         }
//       };
//       getHistorial();
//     }

//   }, [id]);

//   const handleSubmitUserEmail = async (e) => {

//     setCargando(true)

//     e.preventDefault()

//     if (userEmail === "") {
//       toast.error("Todos los campos son obligatorios")
//       return
//     }

//     try {
//       let { data } = await clienteAxios.post(`api/usuarios/email`, { email: userEmail });

//       setEstado("nuevo")

//       setReserva({
//         ...reserva,
//         cliente_id: data._id,
//         cliente_email: data.email,
//         cliente_nombre: data.nombre,
//         cliente_apellido: data.apellido,
//         cliente_cedula: data.cedula,
//         cliente_telefono: data.telefono,
//         direccion_Servicio: data.direccionDefault.direccion,
//         adicional_direccion_Servicio: data.direccionDefault.info,
//         ciudad_Servicio: data.direccionDefault.ciudad,
//         localidad_Servicio: data.direccionDefault.localidad,
//         telefono_Servicio: data.telefono,
//         nuevo: false
//       })
//       setCargando(false)
//       setUserEmail("")

//     } catch (err) {
//       console.log(err)
//       setCargando(false)
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   }

//   const {
//     // username,
//     cliente_id,
//     cliente_email,
//     cliente_nombre,
//     cliente_apellido,
//     cliente_cedula,
//     cliente_telefono,
//     user_profesional_id,
//     profesional_id,
//     profesional_email,
//     profesional_nombre,
//     profesional_apellido,
//     profesional_telefono,
//     servicio,
//     //servicio_img,
//     cantidad,
//     precio,
//     dia_servicio,
//     hora_servicio,
//     direccion_Servicio,
//     adicional_direccion_Servicio,
//     ciudad_Servicio,
//     localidad_Servicio,
//     telefono_Servicio } = reserva

//   const handleChangeServicio = (e) => {

//     if (!servicios.includes(e.target.value) && e.target.value !== "") {

//       let busqueda = productos.filter((servicio) => servicio._id === e.target.value)

//       setServicios([...servicios, ...busqueda]);
//     }

//   };

//   useEffect(() => {
//     const getProductos = async () => {
//       try {
//         let { data } = await clienteAxios.get(`/api/products`);

//         setProdcutos(data)
//       } catch (err) {
//         let error = err.response.data.msg
//           ? err.response.data.msg
//           : err.response && "Estamos presentando problemas internos";
//         return toast.error(error);
//       }
//     };
//     getProductos();
//   }, [])

//   const [orderId, setOrderId] = useState("");

//   function generarPreferencias() {

//     let producto = servicios[0].nombre;
//     let precio = servicios[0].precio;
//     console.log("CARRITO", producto, precio);

//     setCargando2(true)

//     const clienteNuevo = {
//       email: reserva.cliente_email,
//       nombre: reserva.cliente_nombre,
//       apellido: reserva.cliente_apellido,
//       cedula: reserva.cliente_cedula
//     }

//     if (reserva.nuevo) {

//       clienteAxios.post(`${import.meta.env.VITE_APP_BACK}/api/usuarios/reserva-usuario`, clienteNuevo)
//         .then(datos1 => {

//           let reservaRequest = {
//             ...reserva,
//             cliente_id: datos1.data._id
//           }

//           return fetch(`${import.meta.env.VITE_APP_BACK}/pay/preference-manual`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(reservaRequest),
//           }).catch(console.log)
//         })
//         .then(respuesta1 => respuesta1.json())
//         .then(datos1 => {
//           return fetch('https://api.mercadopago.com/checkout/preferences', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN}`,
//             },
//             body: JSON.stringify({
//               items: [
//                 {
//                   title: producto,
//                   unit_price: Number(precio),
//                   quantity: Number(1),
//                 }
//               ],
//               back_urls: {
//                 success: `${import.meta.env.VITE_APP_BACK}/pay/feedback/success/manual`,
//                 failure: `${import.meta.env.VITE_APP_BACK}/pay/feedback/failure/manual`,
//                 pending: `${import.meta.env.VITE_APP_BACK}/pay/feedback/pending/manual`,
//               },
//               auto_return: 'approved',
//               payment_methods: {
//                 excluded_payment_types: [
//                   { id: "ticket" },
//                   { id: "bank_transfer" }
//                 ],
//               },
//               statement_descriptor: "CALYAAN COLOMBIA",
//               external_reference: `${datos1.newOrder}`,
//             }),
//           });
//         })
//         .then(respuesta2 => respuesta2.json())
//         .then(datos2 => {
//           setLinkPago(datos2.init_point);
//           setCargando2(false);
//         })
//         .catch(error => {
//           console.error(error);
//           setCargando2(false);
//         });
//       return
//     }

//     const serviciosRequest = servicios.map((servicio) => servicio.idWP)

//     let reservaRequest = {
//       cliente_id: reserva.cliente_id,
//       usuario: {
//         cliente_email: reserva.cliente_email,
//         cliente_nombre: reserva.cliente_nombre,
//         cliente_apellido: reserva.cliente_apellido,
//         cliente_cedula: reserva.cliente_cedula,
//         cliente_telefono: reserva.cliente_telefono,
//       },
//       serviciosIds: serviciosRequest,
//       //servicio: serviciosSearch[0].nombre,
//       //servicio_img: serviciosSearch[0].img,
//       cantidad: 1,
//       precio: servicios[0].precio,
//       direccion_Servicio: reserva.direccion_Servicio,
//       adicional_direccion_Servicio: reserva.adicional_direccion_Servicio,
//       ciudad_Servicio: reserva.ciudad,
//       localidad_Servicio: reserva.localidad_Servicio,
//       telefono_Servicio: reserva.cliente_telefono,
//     }

//     fetch(`${import.meta.env.VITE_APP_BACK}/pay/preference-manual`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(reservaRequest),
//     })
//       .then(respuesta1 => respuesta1.json())
//       .then(datos1 => {

//         return fetch('https://api.mercadopago.com/checkout/preferences', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN}`,
//           },
//           body: JSON.stringify({
//             items: [
//               {
//                 title: producto,
//                 unit_price: Number(precio),
//                 quantity: Number(1),
//               }
//             ],
//             back_urls: {
//               success: `${import.meta.env.VITE_APP_BACK}/pay/feedback/success/manual`,
//               failure: `${import.meta.env.VITE_APP_BACK}/pay/feedback/failure/manual`,
//               pending: `${import.meta.env.VITE_APP_BACK}/pay/feedback/pending/manual`,
//             },
//             auto_return: 'approved',
//             payment_methods: {
//               excluded_payment_types: [
//                 { id: "ticket" },
//                 { id: "bank_transfer" }
//               ],
//             },
//             statement_descriptor: "CALYAAN COLOMBIA",
//             external_reference: `${datos1.newOrder}`,
//           }),
//         })
//           .then(respuesta2 => respuesta2.json())
//           .then(datos2 => {
//             setLinkPago(datos2.init_point);
//             setCargando2(false);
//           })
//       })
//       .catch(error => {
//         console.error(error);
//         setCargando2(false);
//       });
//   }

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(linkPago);
//   };

//   const handleChange = (e) => {
//     setReserva({
//       ...reserva,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const [inputValue, setInputValue] = useState({
//     address: "",
//     date: "",
//     time: "",
//   });

//   const [cargando3, setCargando3] = useState(false)

//   let { date, time } = inputValue;

//   const [profesionalesRequest, setProfesionalesRequest] = useState([]);

//   const handleChangeProfesional = (e) => {
//     setInputValue({
//       ...inputValue,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const obtenerProfesional = async () => {

//     try {

//       setCargando3(true)

//       const { data } = await clienteAxios.post("api/reservas", {
//         fecha: date,
//         citaHora: time,
//         especialidad: servicios[0].nombre,
//         localidad: reserva.localidad_Servicio,
//       });

//       setProfesionalesRequest(data)

//       setCargando3(false)

//     } catch (err) {
//       setCargando3(false)
//       console.log(err)
//     }

//   }

//   function eliminarDelCarrito() {
//     setServicios([]);
//   }

//   const [confirmarReserva, setConfirmarReserva] = useState(false)

//   const handleProfesional = (profesional) => {

//     setReserva({
//       ...reserva,
//       user_profesional_id: profesional.creador.creador._id,
//       profesional_id: profesional.creador._id,
//       profesional_email: profesional.creador.creador.email,
//       profesional_nombre: profesional.creador.creador.nombre,
//       profesional_apellido: profesional.creador.creador.apellido,
//       profesional_telefono: profesional.creador.creador.telefono,
//       dia_servicio: date,
//       hora_servicio: time,
//     })

//     setConfirmarReserva(true)

//   }
//   console.log("RESERVA", reserva)

//   const guardarReserva = async () => {
//     try {
//       let { data } = await clienteAxios.post(`/pay/finish/order`, reserva);

//       setConfirmarReserva(false)

//       toast.success(data.msg);

//     } catch (err) {
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   return (

//     <div className="w-full mx-auto ">

//       <div className="relative flex flex-col  break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
//         <div className="rounded-t bg-white mb-0 px-6 py-6">
//           <div className="text-center flex justify-between">
//             <h6 className="text-blueGray-700 text-xl font-bold">
//               Crear nueva reserva
//             </h6>
//           </div>
//         </div>
//         <div className="flex-auto px-4 lg:px-10 py-10 pt-0">

//           <div className="flex justify-between py-2 mb-5">
//             <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//               Información de usuario
//             </h6>
//             <div className="border border-gray-300  shadow-sm w-56 rounded flex relative">
//               <select
//                 onChange={(e) => setEstado(e.target.value)}
//                 value={estado}
//                 className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded">
//                 <option value="">Estado</option>
//                 <option value="registrado">Registrado</option>
//                 <option value="nuevo">Nuevo usuario</option>
//               </select>
//               <div
//                 className="px-4 flex items-center border-l border-gray-300  flex-col justify-center text-gray-500
//                                        absolute right-0 bottom-0 top-0 mx-auto z-20 pointer-events-none "
//               >
//                 <svg
//                   tabIndex={0}
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon icon-tabler icon-tabler-chevron-up"
//                   width={16}
//                   height={16}
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" />
//                   <polyline points="6 15 12 9 18 15" />
//                 </svg>
//                 <svg
//                   tabIndex={0}
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon icon-tabler icon-tabler-chevron-down"
//                   width={16}
//                   height={16}
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" />
//                   <polyline points="6 9 12 15 18 9" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {
//             estado === "nuevo" ?

//               <>
//                 <div className="flex flex-wrap">
//                   {/* <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Nombre de usuario
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Nombre de usuario"
//                         name="username"
//                         value={username}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div> */}

//                   <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         correo electrónico
//                       </label>
//                       <input
//                         type="email"
//                         name="cliente_email"
//                         onChange={handleChange}
//                         value={cliente_email}
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Correo Electrónico"
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Nombres
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Nombres"
//                         value={cliente_nombre}
//                         name="cliente_nombre"
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Cédula
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Cédula"
//                         value={cliente_cedula}
//                         name="cliente_cedula"
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Apellidos
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Apellidos"
//                         name="cliente_apellido"
//                         value={cliente_apellido}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Teléfono
//                       </label>
//                       <input
//                         type="text"
//                         name="cliente_telefono"
//                         onChange={handleChange}
//                         value={cliente_telefono}
//                         placeholder="Teléfono"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <hr className="mt-6 border-b-1 border-blueGray-300" />

//                 <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//                   INFORMACIÓN DE Contacto
//                 </h6>
//                 <div className="flex flex-wrap">
//                   <div className="w-full lg:w-12/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Dirección
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         name="direccion_Servicio"
//                         onChange={handleChange}
//                         value={direccion_Servicio}
//                         placeholder="Dirección del cliente"
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-4/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         INFORMACIÓN ADICIONAL
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Información adicional"
//                         name="adicional_direccion_Servicio"
//                         onChange={handleChange}
//                         value={adicional_direccion_Servicio}
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-4/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Ciudad
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Ciudad"
//                         name="ciudad_Servicio"
//                         onChange={handleChange}
//                         value={ciudad_Servicio}
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-4/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Localidad
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Localidad"
//                         name="localidad_Servicio"
//                         onChange={handleChange}
//                         value={localidad_Servicio}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </>
//               :
//               <>
//                 {
//                   !cargando ?
//                     <form onSubmit={handleSubmitUserEmail}>
//                       <div className="relative w-full mb-3">
//                         <label
//                           className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                           htmlFor="grid-password"
//                         >
//                           Correo Electrónico de usuario
//                         </label>
//                         <input
//                           type="email"
//                           value={userEmail}
//                           onChange={(e) => setUserEmail(e.target.value)}
//                           className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                           placeholder="Correo Electrónico"
//                         />
//                       </div>
//                       <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
//                         <p className="text-sm font-medium leading-none text-white">
//                           Buscar Usuario
//                         </p>
//                       </button>
//                     </form>
//                     :
//                     <Spinner />
//                 }
//               </>

//           }

//           <hr className="mt-6 border-b-1 border-blueGray-300" />

//           <div className="flex justify-between py-2 mb-5">
//             <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//               Información de servicio
//             </h6>
//           </div>

//           <div className="flex flex-wrap">
//             <div className="w-full lg:w-6/12 px-4">
//               <div className="relative w-full mb-3">
//                 <label
//                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                   htmlFor="grid-password"
//                 >
//                   Servicios
//                 </label>

//                 <select
//                   id="servicios"
//                   className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded"
//                   //value={especialidad}
//                   onChange={handleChangeServicio}
//                   name="servicios"
//                 >
//                   <option value="">Servicios</option>
//                   {productos?.map((servicio, index) => (
//                     <option key={index} value={servicio._id}>
//                       {servicio.nombre}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {servicios?.length > 0 && (
//               <div id="menu" className={`w-full px-4 flex`}>
//                 <div className="pt-11 sm:px-6 px-4 pb-4 sm:pb-6 flex-row space-y-12 w-full relative ">
//                   {servicios.map((servicio, index) => (
//                     <div key={index} className=" flex flex-row w-full justify-between sm:space-x-4 ">
//                       <div className="flex gap-4">

//                         <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
//                           <img
//                             src={servicio?.img}
//                             alt=""
//                             className="h-full w-full object-cover object-center"
//                           />
//                         </div>

//                         <div className="flex justify-center items-start flex-col mt-4 sm:mt-0">
//                           <p className="text-base leading-4 text-gray-800">{servicio.nombre}</p>
//                           <p className="text-sm leading-none mt-2 text-gray-600">Cantidad: 1 </p>
//                           <p className="text-xl font-semibold leading-5 mt-5 text-gray-800">${servicio.precio}</p>
//                         </div>

//                       </div>

//                       <div className="  sm:right-0 sm:inset-y-3">
//                         <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 "
//                         onClick={() => eliminarDelCarrito()}>
//                           <svg className="text-gray-800 hover:text-black fill-stroke" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path
//                               d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
//                               fill="currentColor"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="flex justify-center items-center w-full flex-col space-y-2">
//                     <div className="flex justify-between items-center w-full">
//                       <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">Total</p>
//                       <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">$ {servicios[0].precio}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {linkPago ? (
//             <>

//               <hr className="mt-6 border-b-1 border-blueGray-300" />

//               <div className="flex justify-between py-2 mb-5">
//                 <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//                   Link de pago
//                 </h6>
//               </div>

//               <div className="flex flex-wrap items-center">
//                 <div className="w-full lg:w-3/4 px-4">
//                   <div className="w-full">
//                     <label
//                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                       htmlFor="grid-password"
//                     >
//                       Link de pago
//                     </label>
//                     <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" value={linkPago} readOnly />
//                   </div>
//                 </div>

//                 <div className="w-full lg:w-1/5 px-4 mt-5">
//                   <button onClick={handleCopyLink} className="p-2 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none text-white"> Copiar Link </button>
//                 </div>

//               </div>

//             </>

//           ) : (
//             cargando2 ?
//               <Spinner />
//               :
//               reserva.cliente_email && servicios.length > 0 &&
//               <button
//                 onClick={generarPreferencias}
//                 className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
//                 <p className="text-sm font-medium leading-none text-white">
//                   Generar Link de Pago
//                 </p>
//               </button>
//           )}

//           {
//             reserva?.profesional_id  && reserva?.estadoPago === "approved" &&
//             <>
//               <hr className="mt-6 border-b-1 border-blueGray-300" />

//               <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//                 Información de reserva - profesional Asignado
//               </h6>

//               <div className="flex flex-col items-center p-6">
//                 <img
//                   src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
//                   className="w-24 h-24 mb-3 rounded-full shadow-lg"

//                 />
//                 <h5 className="mb-1 text-xl font-medium text-gray-900">
//                   {reserva?.profesional_nombre}   {reserva?.profesional_apellido}
//                 </h5>
//                 <span className="text-sm text-gray-500 text-center">
//                   {reserva?.profesional_email}
//                 </span>
//                 <span className="text-sm text-gray-500"></span>
//               </div>
//             </>
//           }

//           {
//             id && reserva?.estadoPago === "approved" &&
//             <>

//               <hr className="mt-6 border-b-1 border-blueGray-300" />

//               <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//                 Información de reserva
//               </h6>
//               <div className="flex flex-wrap">
//                 <div className="w-full lg:w-12/12 px-4">
//                   <div className="grid gap-4 mb-4 sm:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="date"
//                         className="block mb-2 text-sm font-medium text-gray-900"
//                       >
//                         Fecha
//                       </label>
//                       <input
//                         type="date"
//                         name="date"
//                         id="date"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5"
//                         placeholder="username.example"
//                         required=""
//                         onChange={handleChangeProfesional}
//                         value={date}
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="time"
//                         className="block mb-2 text-sm font-medium text-gray-900"
//                       >
//                         Hora
//                       </label>

//                       <select
//                         type="time"
//                         name="time"
//                         id="time"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5 "
//                         required=""
//                         onChange={handleChangeProfesional}
//                         value={time}
//                       >
//                         <option value="">Hora</option>
//                         {hourSelect?.map((hour, index) => (
//                           <option key={index} value={hour}>
//                             {hour}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {
//                     date && time &&
//                     <button
//                       onClick={obtenerProfesional}
//                       className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
//                       <p className="text-sm font-medium leading-none text-white">
//                         Buscar disponibilidad
//                       </p>
//                     </button>
//                   }

//                   <div className="mx-auto mt-6 flex bg-whitefull-screen flex-wrap items-center justify-around">
//                     {!cargando3 ? (
//                       profesionalesRequest.length > 0 ? (
//                         profesionalesRequest.map((profesional) => (
//                           <div
//                             className={`w-full max-w-sm rounded-lg shadow-md ${profesional.styles &&
//                               "bg-gray-100 border border-gray-200 "
//                               }`}
//                           >
//                             <div className="flex flex-col items-center p-6">
//                               <img
//                                 className="w-24 h-24 mb-3 rounded-full shadow-lg"
//                                 src={
//                                   profesional?.creador.creador.img
//                                     ? profesional?.creador.creador.img
//                                     : "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
//                                 }
//                               />
//                               <h5 className="mb-1 text-xl font-medium text-gray-900">
//                                 {profesional.creador.creador.nombre}
//                               </h5>
//                               <span className="text-sm text-gray-500 text-center">
//                                 {profesional.creador.descripcion}
//                               </span>
//                               <span className="text-sm text-gray-500"></span>
//                               <div className="flex mt-4 space-x-3 md:mt-6">
//                                 <div
//                                   onClick={() => handleProfesional(profesional)}
//                                   className="inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover"
//                                 >
//                                   Seleccionar
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <>{profesionalesRequest.msg}</>
//                       )
//                     ) : (
//                       <Spinner />
//                     )}
//                   </div>

//                   {confirmarReserva && <button
//                     onClick={guardarReserva}
//                     className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
//                     <p className="text-sm font-medium leading-none text-white">
//                       Confirmar Reserva
//                     </p>
//                   </button>}

//                 </div>
//               </div>
//             </>

//           }
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateReservation;

// import React, { useEffect } from "react";
// import { hourSelect } from "../../../../data";
// import { useState } from 'react';
// import { toast } from "react-toastify";
// import clienteAxios from "../../../../config/axios";
// import Spinner from "../../../../components/Spinner";
// import { AiFillCloseCircle } from "react-icons/ai";
// import limpiarHorarios from "../../../../helpers/Logic/limpiarHorarios"
// import swal from "sweetalert";

// const CreateReservation = () => {
//   const querystring = window.location.search
//   const params = new URLSearchParams(querystring)
//   let id = params.get('id')
//   const [editarReserva, setEditarReserva] = useState(false)
//   const [linkPago, setLinkPago] = useState('');
//   const [estado, setEstado] = useState("")
//   const [userEmail, setUserEmail] = useState("")
//   const [cargando, setCargando] = useState(false)
//   const [cargando2, setCargando2] = useState(false)
//   const [reserva, setReserva] = useState({
//     // username: "",
//     cliente_id: "",
//     cliente_email: "",
//     cliente_nombre: "",
//     cliente_apellido: "",
//     cliente_cedula: "",
//     cliente_telefono: "",
//     user_profesional_id: "",
//     profesional_id: "",
//     profesional_email: "",
//     profesional_nombre: "",
//     profesional_apellido: "",
//     profesional_telefono: "",
//     servicio: "",
//     //servicio_img,
//     cantidad: "",
//     precio: "",
//     dia_servicio: "",
//     hora_servicio: " ",
//     direccion_Servicio: "",
//     adicional_direccion_Servicio: "",
//     ciudad_Servicio: "",
//     localidad_Servicio: "",
//     ciudad: "Bogota",
//     telefono_Servicio: "",
//     nuevo: true,
//   });

//   const [productos, setProdcutos] = useState([])
//   const [servicios, setServicios] = useState([])
//   const [liberar, setLiberar] = useState({}) //se va a guardar el dato de la reserva si existe en caso de reprogramacion

//   useEffect(() => {
//     if (id) {
//       const getHistorial = async () => {
//         try {

//           let { data } = await clienteAxios.get(
//             `/ordenes/getordenbyid/${id}`
//           );

//           let product = await clienteAxios.get(`/api/products/name/${data.servicio}`);

//           setReserva(data)

//           setServicios([product.data])

//           setEstado("nuevo")

//           if (data.hora_servicio && data.dia_servicio) {
//             console.log("Se han resguardado los datos de la reserva.")
//             setLiberar({
//               ...data,
//               liberar_hora_servicio: data.hora_servicio,
//               liberar_dia_servicio: data.dia_servicio,
//               liberar_profesional_id: data.profesional_id,
//               liberar_profesional_email: data.profesional_email,
//               liberar_profesional_telefono: data.profesional_telefono,
//             })
//           }

//         } catch (error) {
//           console.log(error);
//           const errorMsg =
//             error.response?.data?.msg || error.response?.data?.message || "Estamos presentando problemas internos";
//           toast.error(errorMsg);
//         }
//       };
//       getHistorial();
//     }

//   }, [id]);

//   const handleSubmitUserEmail = async (e) => {

//     setCargando(true)

//     e.preventDefault()

//     if (userEmail === "") {
//       toast.error("Todos los campos son obligatorios")
//       return
//     }

//     try {
//       let { data } = await clienteAxios.post(`api/usuarios/email`, { email: userEmail });

//       setEstado("nuevo")

//       setReserva({
//         ...reserva,
//         cliente_id: data._id,
//         cliente_email: data.email,
//         cliente_nombre: data.nombre,
//         cliente_apellido: data.apellido,
//         cliente_cedula: data.cedula,
//         cliente_telefono: data.telefono,
//         direccion_Servicio: data.direccionDefault.direccion,
//         adicional_direccion_Servicio: data.direccionDefault.info,
//         ciudad_Servicio: data.direccionDefault.ciudad,
//         localidad_Servicio: data.direccionDefault.localidad,
//         telefono_Servicio: data.telefono,
//         nuevo: false,
//       })

//       setCargando(false)
//       setUserEmail("")

//     } catch (err) {
//       console.log(err)
//       setCargando(false)
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   }

//   const {
//     // username,
//     cliente_id,
//     cliente_email,
//     cliente_nombre,
//     cliente_apellido,
//     cliente_cedula,
//     cliente_telefono,
//     user_profesional_id,
//     profesional_id,
//     profesional_email,
//     profesional_nombre,
//     profesional_apellido,
//     profesional_telefono,
//     servicio,
//     //servicio_img,
//     cantidad,
//     precio,
//     dia_servicio,
//     hora_servicio,
//     direccion_Servicio,
//     adicional_direccion_Servicio,
//     ciudad_Servicio,
//     localidad_Servicio,
//     telefono_Servicio } = reserva

//   const handleChangeServicio = (e) => {

//     if (!servicios.includes(e.target.value) && e.target.value !== "") {

//       let busqueda = productos.filter((servicio) => servicio._id === e.target.value)

//       setServicios([...servicios, ...busqueda]);
//     }

//   };

//   useEffect(() => {
//     const getProductos = async () => {
//       try {
//         let { data } = await clienteAxios.get(`/api/products`);

//         setProdcutos(data)
//       } catch (err) {
//         let error = err.response.data.msg
//           ? err.response.data.msg
//           : err.response && "Estamos presentando problemas internos";
//         return toast.error(error);
//       }
//     };
//     getProductos();
//   }, [])

//   const [orderId, setOrderId] = useState("");

//   function generarPreferencias() {

//     let producto = servicios[0].nombre;
//     let precio = servicios[0].precio;

//     setCargando2(true)

//     const clienteNuevo = {
//       email: reserva.cliente_email,
//       nombre: reserva.cliente_nombre,
//       apellido: reserva.cliente_apellido,
//       cedula: reserva.cliente_cedula
//     }

//     if (reserva.nuevo) {

//       clienteAxios.post(`${import.meta.env.VITE_APP_BACK}/api/usuarios/reserva-usuario`, clienteNuevo)
//         .then(datos1 => {

//           let reservaRequest = {
//             ...reserva,
//             cliente_id: datos1.data._id
//           }

//           return fetch(`${import.meta.env.VITE_APP_BACK}/pay/preference-manual`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(reservaRequest),
//           }).catch(console.log)
//         })
//         .then(respuesta1 => respuesta1.json())
//         .then(datos1 => {
//           return fetch('https://api.mercadopago.com/checkout/preferences', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN}`,
//             },
//             body: JSON.stringify({
//               items: [
//                 {
//                   title: producto,
//                   unit_price: Number(precio),
//                   quantity: Number(1),
//                 }
//               ],
//               back_urls: {
//                 success: `${import.meta.env.VITE_APP_BACK}/pay/feedback/success/manual`,
//                 failure: `${import.meta.env.VITE_APP_BACK}/pay/feedback/failure/manual`,
//                 pending: `${import.meta.env.VITE_APP_BACK}/pay/feedback/pending/manual`,
//               },
//               auto_return: 'approved',
//               payment_methods: {
//                 excluded_payment_types: [
//                   { id: "ticket" },
//                   { id: "bank_transfer" }
//                 ],
//               },
//               statement_descriptor: "CALYAAN COLOMBIA",
//               external_reference: `${datos1.newOrder}`,
//             }),
//           });
//         })
//         .then(respuesta2 => respuesta2.json())
//         .then(datos2 => {
//           setLinkPago(datos2.init_point);
//           setCargando2(false);
//         })
//         .catch(error => {
//           console.error(error);
//           setCargando2(false);
//         });
//       return
//     }

//     const serviciosRequest = servicios.map((servicio) => servicio.idWP)

//     let reservaRequest = {
//       cliente_id: reserva.cliente_id,
//       usuario: {
//         cliente_email: reserva.cliente_email,
//         cliente_nombre: reserva.cliente_nombre,
//         cliente_apellido: reserva.cliente_apellido,
//         cliente_cedula: reserva.cliente_cedula,
//         cliente_telefono: reserva.cliente_telefono,
//       },
//       serviciosIds: serviciosRequest,
//       //servicio: serviciosSearch[0].nombre,
//       //servicio_img: serviciosSearch[0].img,
//       cantidad: 1,
//       precio: servicios[0].precio,
//       direccion_Servicio: reserva.direccion_Servicio,
//       adicional_direccion_Servicio: reserva.adicional_direccion_Servicio,
//       ciudad_Servicio: reserva.ciudad,
//       localidad_Servicio: reserva.localidad_Servicio,
//       telefono_Servicio: reserva.cliente_telefono,
//     }

//     fetch(`${import.meta.env.VITE_APP_BACK}/pay/preference-manual`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(reservaRequest),
//     })
//       .then(respuesta1 => respuesta1.json())
//       .then(datos1 => {

//         return fetch('https://api.mercadopago.com/checkout/preferences', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN}`,
//           },
//           body: JSON.stringify({
//             items: [
//               {
//                 title: producto,
//                 unit_price: Number(precio),
//                 quantity: Number(1),
//               }
//             ],
//             back_urls: {
//               success: `${import.meta.env.VITE_APP_BACK}/pay/feedback/success/manual`,
//               failure: `${import.meta.env.VITE_APP_BACK}/pay/feedback/failure/manual`,
//               pending: `${import.meta.env.VITE_APP_BACK}/pay/feedback/pending/manual`,
//             },
//             auto_return: 'approved',
//             payment_methods: {
//               excluded_payment_types: [
//                 { id: "ticket" },
//                 { id: "bank_transfer" }
//               ],
//             },
//             statement_descriptor: "CALYAAN COLOMBIA",
//             external_reference: `${datos1.newOrder}`,
//           }),
//         })
//           .then(respuesta2 => respuesta2.json())
//           .then(datos2 => {
//             setLinkPago(datos2.init_point);
//             setCargando2(false);
//           })
//       })
//       .catch(error => {
//         console.error(error);
//         setCargando2(false);
//       });
//   }

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(linkPago);
//   };

//   const handleChange = (e) => {
//     setReserva({
//       ...reserva,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const [inputValue, setInputValue] = useState({
//     address: "",
//     date: "",
//     time: "",
//   });
//   const [cargando3, setCargando3] = useState(false)
//   const [profesionalesRequest, setProfesionalesRequest] = useState([]);
//   let { date, time } = inputValue;

//   const handleChangeProfesional = (e) => {
//     setInputValue({
//       ...inputValue,
//       [e.target.name]: e.target.value,
//     });
//     setReserva({
//       ...reserva,
//       hora_servicio: e.target.value,
//     });

//   };

//   useEffect(() => {
//     const obtenerProfesional = async () => {
//       setCargando3(true);
//       try {
//         const { data } = await clienteAxios.post(
//           "api/reservas/profesionales/fecha",
//           {
//             fecha: date,
//             especialidad: servicios[0]?.nombre,
//             localidad: reserva?.localidad_Servicio,
//           }
//         );
//         console.log(data);
//         if (data?.length > 0) {
//           const filteredData = data.filter((obj) => obj.creador !== null); // Filtrar objetos con creador distinto de null
//           const updatedArray = filteredData.map((obj) => ({
//             ...obj,
//             styles: false,
//           }));
//           // const updatedArray = data.map((obj) => ({ ...obj, styles: false }));
//           setProfesionalesRequest(updatedArray);
//         } else {
//           setProfesionalesRequest(data);
//         }
//         setCargando3(false);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     obtenerProfesional();
//   }, [date]);

//   function eliminarDelCarrito() {
//     setServicios([]);
//   }

//   const [confirmarReserva, setConfirmarReserva] = useState(false)
//   const [profesional, setProfesional] = useState({});
//   const [hourSelect, setHoursSelect] = useState([]); // mapea la disponibilidad.horarios del profesional

//   const handleProfesional = (profesional) => {
//     const updatedArray = profesionalesRequest.map((obj) =>
//       obj._id === profesional._id
//         ? { ...obj, styles: true }
//         : { ...obj, styles: false }
//     );

//     setProfesionalesRequest(updatedArray);
// console.log("Updated Array", updatedArray)
//     setProfesional(profesional);

//   console.log("PROFESIONAL.HORARIOS",profesional.horarios)
//   let horarios = profesional.horarios

//     setHoursSelect(limpiarHorarios(horarios));
//     console.log("setHoursSelect HOURSELECT", hourSelect)

//     setReserva({
//       ...reserva,
//       dia_servicio: date,
//       hora_servicio: time,
//       user_profesional_id: profesional.creador.creador._id,
//       profesional_id: profesional.creador._id,
//       profesional_email: profesional.creador.creador.email,
//       profesional_nombre: profesional.creador.creador.nombre,
//       profesional_apellido: profesional.creador.creador.apellido,
//       profesional_telefono: profesional.creador.creador.telefono
//     })
//     swal({
//       title: "Profesional seleccionado",
//       text: "Has seleccionado un profesional para tu servicio",
//       icon: "success",
//       button: "Aceptar",
//     });
//     setConfirmarReserva(true)
//   }

//   const guardarReserva = async () => {

//     try {
//       let { dataFree } = await clienteAxios.post(`/pay/finish/liberar`, liberar);

//       let { data } = await clienteAxios.post(`/pay/finish/order`, reserva);

//       setConfirmarReserva(false)

//       toast.success(data.msg);
//       toast.success(dataFree.msg);

//     } catch (err) {
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   return (

//     <div className="w-full mx-auto ">

//       <div className="relative flex flex-col  break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
//         <div className="rounded-t bg-white mb-0 px-6 py-6">
//           <div className="text-center flex justify-between">
//             <h6 className="text-blueGray-700 text-xl font-bold">
//               Crear nueva reserva
//             </h6>
//           </div>
//         </div>
//         <div className="flex-auto px-4 lg:px-10 py-10 pt-0">

//           <div className="flex justify-between py-2 mb-5">
//             <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//               Información de usuario
//             </h6>
//             <div className="border border-gray-300  shadow-sm w-56 rounded flex relative">
//               <select
//                 onChange={(e) => setEstado(e.target.value)}
//                 value={estado}
//                 className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded">
//                 <option value="">Estado</option>
//                 <option value="registrado">Registrado</option>
//                 <option value="nuevo">Nuevo usuario</option>
//               </select>
//               <div
//                 className="px-4 flex items-center border-l border-gray-300  flex-col justify-center text-gray-500
//                                        absolute right-0 bottom-0 top-0 mx-auto z-20 pointer-events-none "
//               >
//                 <svg
//                   tabIndex={0}
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon icon-tabler icon-tabler-chevron-up"
//                   width={16}
//                   height={16}
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" />
//                   <polyline points="6 15 12 9 18 15" />
//                 </svg>
//                 <svg
//                   tabIndex={0}
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon icon-tabler icon-tabler-chevron-down"
//                   width={16}
//                   height={16}
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" />
//                   <polyline points="6 9 12 15 18 9" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {
//             estado === "nuevo" ?

//               <>
//                 <div className="flex flex-wrap">
//                   {/* <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Nombre de usuario
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Nombre de usuario"
//                         name="username"
//                         value={username}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div> */}

//                   <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         correo electrónico
//                       </label>
//                       <input
//                         type="email"
//                         name="cliente_email"
//                         onChange={handleChange}
//                         value={cliente_email}
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Correo Electrónico"
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Nombres
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Nombres"
//                         value={cliente_nombre}
//                         name="cliente_nombre"
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Cédula
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Cédula"
//                         value={cliente_cedula}
//                         name="cliente_cedula"
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Apellidos
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Apellidos"
//                         name="cliente_apellido"
//                         value={cliente_apellido}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Teléfono
//                       </label>
//                       <input
//                         type="text"
//                         name="cliente_telefono"
//                         onChange={handleChange}
//                         value={cliente_telefono}
//                         placeholder="Teléfono"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <hr className="mt-6 border-b-1 border-blueGray-300" />

//                 <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//                   INFORMACIÓN DE Contacto
//                 </h6>
//                 <div className="flex flex-wrap">
//                   <div className="w-full lg:w-12/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Dirección
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         name="direccion_Servicio"
//                         onChange={handleChange}
//                         value={direccion_Servicio}
//                         placeholder="Dirección del cliente"
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-4/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         INFORMACIÓN ADICIONAL
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Información adicional"
//                         name="adicional_direccion_Servicio"
//                         onChange={handleChange}
//                         value={adicional_direccion_Servicio}
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-4/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Ciudad
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Ciudad"
//                         name="ciudad_Servicio"
//                         onChange={handleChange}
//                         value={ciudad_Servicio}
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-4/12 px-4">
//                     <div className="relative w-full mb-3">
//                       <label
//                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                         htmlFor="grid-password"
//                       >
//                         Localidad
//                       </label>
//                       <input
//                         type="text"
//                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                         placeholder="Localidad"
//                         name="localidad_Servicio"
//                         onChange={handleChange}
//                         value={localidad_Servicio}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </>
//               :
//               <>
//                 {
//                   !cargando ?
//                     <form onSubmit={handleSubmitUserEmail}>
//                       <div className="relative w-full mb-3">
//                         <label
//                           className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                           htmlFor="grid-password"
//                         >
//                           Correo Electrónico de usuario
//                         </label>
//                         <input
//                           type="email"
//                           value={userEmail}
//                           onChange={(e) => setUserEmail(e.target.value)}
//                           className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                           placeholder="Correo Electrónico"
//                         />
//                       </div>
//                       <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
//                         <p className="text-sm font-medium leading-none text-white">
//                           Buscar Usuario
//                         </p>
//                       </button>
//                     </form>
//                     :
//                     <Spinner />
//                 }
//               </>

//           }

//           <hr className="mt-6 border-b-1 border-blueGray-300" />

//           <div className="flex justify-between py-2 mb-5">
//             <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//               Información de servicio
//             </h6>
//           </div>

//           <div className="flex flex-wrap">
//             <div className="w-full lg:w-6/12 px-4">
//               <div className="relative w-full mb-3">
//                 <label
//                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                   htmlFor="grid-password"
//                 >
//                   Servicios
//                 </label>

//                 <select
//                   id="servicios"
//                   className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded"
//                   //value={especialidad}
//                   onChange={handleChangeServicio}
//                   name="servicios"
//                 >
//                   <option value="">Servicios</option>
//                   {productos?.map((servicio, index) => (
//                     <option key={index} value={servicio._id}>
//                       {servicio.nombre}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {servicios?.length > 0 && (
//               <div id="menu" className={`w-full px-4 flex`}>
//                 <div className="pt-11 sm:px-6 px-4 pb-4 sm:pb-6 flex-row space-y-12 w-full relative ">
//                   {servicios.map((servicio, index) => (
//                     <div key={index} className=" flex flex-row w-full justify-between sm:space-x-4 ">
//                       <div className="flex gap-4">

//                         <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
//                           <img
//                             src={servicio?.img}
//                             alt=""
//                             className="h-full w-full object-cover object-center"
//                           />
//                         </div>

//                         <div className="flex justify-center items-start flex-col mt-4 sm:mt-0">
//                           <p className="text-base leading-4 text-gray-800">{servicio.nombre}</p>
//                           <p className="text-sm leading-none mt-2 text-gray-600">Cantidad: 1 </p>
//                           <p className="text-xl font-semibold leading-5 mt-5 text-gray-800">${servicio.precio}</p>
//                         </div>

//                       </div>

//                       <div className="  sm:right-0 sm:inset-y-3">
//                         <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 "
//                         onClick={() => eliminarDelCarrito()}>
//                           <svg className="text-gray-800 hover:text-black fill-stroke" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path
//                               d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
//                               fill="currentColor"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="flex justify-center items-center w-full flex-col space-y-2">
//                     <div className="flex justify-between items-center w-full">
//                       <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">Total</p>
//                       <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">$ {servicios[0].precio}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {linkPago ? (
//             <>

//               <hr className="mt-6 border-b-1 border-blueGray-300" />

//               <div className="flex justify-between py-2 mb-5">
//                 <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//                   Link de pago
//                 </h6>
//               </div>

//               <div className="flex flex-wrap items-center">
//                 <div className="w-full lg:w-3/4 px-4">
//                   <div className="w-full">
//                     <label
//                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                       htmlFor="grid-password"
//                     >
//                       Link de pago
//                     </label>
//                     <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" value={linkPago} readOnly />
//                   </div>
//                 </div>

//                 <div className="w-full lg:w-1/5 px-4 mt-5">
//                   <button onClick={handleCopyLink} className="p-2 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none text-white"> Copiar Link </button>
//                 </div>

//               </div>

//             </>

//           ) : (
//             cargando2 ?
//               <Spinner />
//               :
//               reserva.cliente_email && servicios.length > 0 &&
//               <button
//                 onClick={generarPreferencias}
//                 className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
//                 <p className="text-sm font-medium leading-none text-white">
//                   Generar Link de Pago
//                 </p>
//               </button>
//           )}

//           {
//             reserva?.profesional_id  && reserva?.estadoPago === "approved" &&
//             <>
//               <hr className="mt-6 border-b-1 border-blueGray-300" />

//               <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//                 Información de reserva - profesional Asignado
//               </h6>

//               <div className="flex flex-col items-center p-6">
//                 <img
//                   src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
//                   className="w-24 h-24 mb-3 rounded-full shadow-lg"

//                 />
//                 <h5 className="mb-1 text-xl font-medium text-gray-900">
//                   {reserva?.profesional_nombre}   {reserva?.profesional_apellido}
//                 </h5>
//                 <span className="text-sm text-gray-500 text-center">
//                   {reserva?.profesional_email}
//                 </span>
//                 <span className="text-sm text-gray-500"></span>
//               </div >
//             </>
//           }

//               {reserva?.dia_servicio && reserva?.hora_servicio &&

//               <div  className="flex flex-col items-center p-6">
//                 <h5>Reserva Asignada</h5>
//                <strong> Hora: {reserva?.hora_servicio || "N/A" } Dia: {reserva?.dia_servicio || "N/A" } </strong>

//               </div>
// }

//           {
//             id && reserva?.estadoPago === "approved" &&
//             <>

//               <hr className="mt-6 border-b-1 border-blueGray-300" />

//               <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
//                 Información de reserva
//               </h6>
//               <div className="flex flex-wrap">
//                 <div className="w-full lg:w-12/12 px-4">
//                   <div className="grid gap-4 mb-4 sm:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="date"
//                         className="block mb-2 text-sm font-medium text-gray-900"
//                       >
//                         Fecha
//                       </label>
//                       <input
//                         type="date"
//                         name="date"
//                         id="date"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5"
//                         placeholder="username.example"
//                         required=""
//                         onChange={handleChangeProfesional}
//                         // value={date}
//                       />
//                     </div>

//                     {hourSelect.length > 0 &&(
//                     <div>
//                       <label
//                         htmlFor="time"
//                         className="block mb-2 text-sm font-medium text-gray-900"
//                       >
//                         Hora
//                       </label>

//                       <select
//                         type="time"
//                         name="time"
//                         id="time"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5 "
//                         required=""
//                         onChange={handleChangeProfesional}
//                         //value={time}
//                       >
//                         <option value="">Hora</option>
//                         {hourSelect?.map((hour, index) => (
//                           <option key={index} value={hour}>
//                             {hour}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     )}
//                   </div>

//                   {date && (<div className="mx-auto mt-6 flex bg-whitefull-screen flex-wrap items-center justify-around">
//                     {!cargando3 ? (
//                       profesionalesRequest.length > 0 ? (
//                         profesionalesRequest.map((profesional) => (
//                           <div
//                           key={profesional._id} // Agregando la clave 'key'
//                             className={`w-full max-w-sm rounded-lg shadow-md ${profesional.styles &&
//                               "bg-gray-100 border border-gray-200 "
//                               }`}
//                           >
//                             <div className="flex flex-col items-center p-6">
//                               <img
//                                 className="w-24 h-24 mb-3 rounded-full shadow-lg"
//                                 src={
//                                   profesional?.creador.creador.img
//                                     ? profesional?.creador.creador.img
//                                     : "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
//                                 }
//                               />
//                               <h5 className="mb-1 text-xl font-medium text-gray-900">
//                                 {profesional.creador.creador.nombre}
//                               </h5>
//                               <span className="text-sm text-gray-500 text-center">
//                                 {profesional.creador.descripcion}
//                               </span>
//                               <span className="text-sm text-gray-500"></span>
//                               <div className="flex mt-4 space-x-3 md:mt-6">
//                                 <div
//                                   onClick={() => handleProfesional(profesional)}
//                                   className="inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover"
//                                 >
//                                   Seleccionar
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <>{profesionalesRequest.msg}</>
//                       )
//                     ) : (
//                       <Spinner />
//                     )}
//                   </div>)}

//                   {confirmarReserva && <button
//                     onClick={guardarReserva}
//                     className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
//                     <p className="text-sm font-medium leading-none text-white">
//                       Confirmar Reserva
//                     </p>
//                   </button>}

//                 </div>
//               </div>
//             </>

//           }
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateReservation;

// // import React, { useEffect } from "react";
// // import { hourSelect } from "../../../../data";
// // import { useState } from 'react';
// // import { toast } from "react-toastify";
// // import clienteAxios from "../../../../config/axios";
// // import Spinner from "../../../../components/Spinner";
// // import { AiFillCloseCircle } from "react-icons/ai";

// // const CreateReservation = () => {
// // //  let producto = 'Camiseta de React';

// //   const querystring = window.location.search
// //   const params = new URLSearchParams(querystring)

// //   let id = params.get('id')

// //   const [editarReserva, setEditarReserva] = useState(false)

// //   const [linkPago, setLinkPago] = useState('');

// //   const [estado, setEstado] = useState("")

// //   const [userEmail, setUserEmail] = useState("")

// //   const [cargando, setCargando] = useState(false)
// //   const [cargando2, setCargando2] = useState(false)

// //   const [reserva, setReserva] = useState({
// //     // username: "",
// //     cliente_id: "",
// //     cliente_email: "",
// //     cliente_nombre: "",
// //     cliente_apellido: "",
// //     cliente_cedula: "",
// //     cliente_telefono: "",
// //     user_profesional_id: "",
// //     profesional_id: "",
// //     profesional_email: "",
// //     profesional_nombre: "",
// //     profesional_apellido: "",
// //     profesional_telefono: "",
// //     servicio: "",
// //     //servicio_img,
// //     cantidad: "",
// //     precio: "",
// //     dia_servicio: "",
// //     hora_servicio: "",
// //     direccion_Servicio: "",
// //     adicional_direccion_Servicio: "",
// //     ciudad_Servicio: "",
// //     localidad_Servicio: "",
// //     ciudad: "Bogota",
// //     telefono_Servicio: "",
// //     nuevo: true
// //   })

// //   const [productos, setProdcutos] = useState([])
// //   const [servicios, setServicios] = useState([])

// //   useEffect(() => {
// //     if (id) {
// //       const getHistorial = async () => {
// //         try {

// //           let { data } = await clienteAxios.get(
// //             `/ordenes/getordenbyid/${id}`
// //           );

// //           let product = await clienteAxios.get(`/api/products/name/${data.servicio}`);

// //           setReserva(data)

// //           setServicios([product.data])

// //           setEstado("nuevo")

// //         } catch (error) {
// //           console.log(error);
// //           const errorMsg =
// //             error.response?.data?.msg || error.response?.data?.message || "Estamos presentando problemas internos";
// //           toast.error(errorMsg);
// //         }
// //       };
// //       getHistorial();
// //     }

// //   }, [id]);

// //   const handleSubmitUserEmail = async (e) => {

// //     setCargando(true)

// //     e.preventDefault()

// //     if (userEmail === "") {
// //       toast.error("Todos los campos son obligatorios")
// //       return
// //     }

// //     try {
// //       let { data } = await clienteAxios.post(`api/usuarios/email`, { email: userEmail });

// //       setEstado("nuevo")

// //       setReserva({
// //         ...reserva,
// //         cliente_id: data._id,
// //         cliente_email: data.email,
// //         cliente_nombre: data.nombre,
// //         cliente_apellido: data.apellido,
// //         cliente_cedula: data.cedula,
// //         cliente_telefono: data.telefono,
// //         direccion_Servicio: data.direccionDefault.direccion,
// //         adicional_direccion_Servicio: data.direccionDefault.info,
// //         ciudad_Servicio: data.direccionDefault.ciudad,
// //         localidad_Servicio: data.direccionDefault.localidad,
// //         telefono_Servicio: data.telefono,
// //         nuevo: false
// //       })
// //       setCargando(false)
// //       setUserEmail("")

// //     } catch (err) {
// //       console.log(err)
// //       setCargando(false)
// //       let error = err.response.data.msg
// //         ? err.response.data.msg
// //         : err.response && "Estamos presentando problemas internos";
// //       return toast.error(error);
// //     }
// //   }

// //   const {
// //     // username,
// //     cliente_id,
// //     cliente_email,
// //     cliente_nombre,
// //     cliente_apellido,
// //     cliente_cedula,
// //     cliente_telefono,
// //     user_profesional_id,
// //     profesional_id,
// //     profesional_email,
// //     profesional_nombre,
// //     profesional_apellido,
// //     profesional_telefono,
// //     servicio,
// //     //servicio_img,
// //     cantidad,
// //     precio,
// //     dia_servicio,
// //     hora_servicio,
// //     direccion_Servicio,
// //     adicional_direccion_Servicio,
// //     ciudad_Servicio,
// //     localidad_Servicio,
// //     telefono_Servicio } = reserva

// //   const handleChangeServicio = (e) => {

// //     if (!servicios.includes(e.target.value) && e.target.value !== "") {

// //       let busqueda = productos.filter((servicio) => servicio._id === e.target.value)

// //       setServicios([...servicios, ...busqueda]);
// //     }

// //   };

// //   useEffect(() => {
// //     const getProductos = async () => {
// //       try {
// //         let { data } = await clienteAxios.get(`/api/products`);

// //         setProdcutos(data)
// //       } catch (err) {
// //         let error = err.response.data.msg
// //           ? err.response.data.msg
// //           : err.response && "Estamos presentando problemas internos";
// //         return toast.error(error);
// //       }
// //     };
// //     getProductos();
// //   }, [])

// //   const [orderId, setOrderId] = useState("");

// //   function generarPreferencias() {

// //     let producto = servicios[0].nombre;
// //     let precio = servicios[0].precio;
// //     console.log("CARRITO", producto, precio);

// //     setCargando2(true)

// //     const clienteNuevo = {
// //       email: reserva.cliente_email,
// //       nombre: reserva.cliente_nombre,
// //       apellido: reserva.cliente_apellido,
// //       cedula: reserva.cliente_cedula
// //     }

// //     if (reserva.nuevo) {

// //       clienteAxios.post(`${import.meta.env.VITE_APP_BACK}/api/usuarios/reserva-usuario`, clienteNuevo)
// //         .then(datos1 => {

// //           let reservaRequest = {
// //             ...reserva,
// //             cliente_id: datos1.data._id
// //           }

// //           return fetch(`${import.meta.env.VITE_APP_BACK}/pay/preference-manual`, {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify(reservaRequest),
// //           }).catch(console.log)
// //         })
// //         .then(respuesta1 => respuesta1.json())
// //         .then(datos1 => {
// //           return fetch('https://api.mercadopago.com/checkout/preferences', {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'Authorization': `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN}`,
// //             },
// //             body: JSON.stringify({
// //               items: [
// //                 {
// //                   title: producto,
// //                   unit_price: Number(precio),
// //                   quantity: Number(1),
// //                 }
// //               ],
// //               back_urls: {
// //                 success: `${import.meta.env.VITE_APP_BACK}/pay/feedback/success/manual`,
// //                 failure: `${import.meta.env.VITE_APP_BACK}/pay/feedback/failure/manual`,
// //                 pending: `${import.meta.env.VITE_APP_BACK}/pay/feedback/pending/manual`,
// //               },
// //               auto_return: 'approved',
// //               payment_methods: {
// //                 excluded_payment_types: [
// //                   { id: "ticket" },
// //                   { id: "bank_transfer" }
// //                 ],
// //               },
// //               statement_descriptor: "CALYAAN COLOMBIA",
// //               external_reference: `${datos1.newOrder}`,
// //             }),
// //           });
// //         })
// //         .then(respuesta2 => respuesta2.json())
// //         .then(datos2 => {
// //           setLinkPago(datos2.init_point);
// //           setCargando2(false);
// //         })
// //         .catch(error => {
// //           console.error(error);
// //           setCargando2(false);
// //         });
// //       return
// //     }

// //     const serviciosRequest = servicios.map((servicio) => servicio.idWP)

// //     let reservaRequest = {
// //       cliente_id: reserva.cliente_id,
// //       usuario: {
// //         cliente_email: reserva.cliente_email,
// //         cliente_nombre: reserva.cliente_nombre,
// //         cliente_apellido: reserva.cliente_apellido,
// //         cliente_cedula: reserva.cliente_cedula,
// //         cliente_telefono: reserva.cliente_telefono,
// //       },
// //       serviciosIds: serviciosRequest,
// //       //servicio: serviciosSearch[0].nombre,
// //       //servicio_img: serviciosSearch[0].img,
// //       cantidad: 1,
// //       precio: servicios[0].precio,
// //       direccion_Servicio: reserva.direccion_Servicio,
// //       adicional_direccion_Servicio: reserva.adicional_direccion_Servicio,
// //       ciudad_Servicio: reserva.ciudad,
// //       localidad_Servicio: reserva.localidad_Servicio,
// //       telefono_Servicio: reserva.cliente_telefono,
// //     }

// //     fetch(`${import.meta.env.VITE_APP_BACK}/pay/preference-manual`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(reservaRequest),
// //     })
// //       .then(respuesta1 => respuesta1.json())
// //       .then(datos1 => {

// //         return fetch('https://api.mercadopago.com/checkout/preferences', {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN}`,
// //           },
// //           body: JSON.stringify({
// //             items: [
// //               {
// //                 title: producto,
// //                 unit_price: Number(precio),
// //                 quantity: Number(1),
// //               }
// //             ],
// //             back_urls: {
// //               success: `${import.meta.env.VITE_APP_BACK}/pay/feedback/success/manual`,
// //               failure: `${import.meta.env.VITE_APP_BACK}/pay/feedback/failure/manual`,
// //               pending: `${import.meta.env.VITE_APP_BACK}/pay/feedback/pending/manual`,
// //             },
// //             auto_return: 'approved',
// //             payment_methods: {
// //               excluded_payment_types: [
// //                 { id: "ticket" },
// //                 { id: "bank_transfer" }
// //               ],
// //             },
// //             statement_descriptor: "CALYAAN COLOMBIA",
// //             external_reference: `${datos1.newOrder}`,
// //           }),
// //         })
// //           .then(respuesta2 => respuesta2.json())
// //           .then(datos2 => {
// //             setLinkPago(datos2.init_point);
// //             setCargando2(false);
// //           })
// //       })
// //       .catch(error => {
// //         console.error(error);
// //         setCargando2(false);
// //       });
// //   }

// //   const handleCopyLink = () => {
// //     navigator.clipboard.writeText(linkPago);
// //   };

// //   const handleChange = (e) => {
// //     setReserva({
// //       ...reserva,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const [inputValue, setInputValue] = useState({
// //     address: "",
// //     date: "",
// //     time: "",
// //   });

// //   const [cargando3, setCargando3] = useState(false)

// //   let { date, time } = inputValue;

// //   const [profesionalesRequest, setProfesionalesRequest] = useState([]);

// //   const handleChangeProfesional = (e) => {
// //     setInputValue({
// //       ...inputValue,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const obtenerProfesional = async () => {

// //     try {

// //       setCargando3(true)

// //       const { data } = await clienteAxios.post("api/reservas", {
// //         fecha: date,
// //         citaHora: time,
// //         especialidad: servicios[0].nombre,
// //         localidad: reserva.localidad_Servicio,
// //       });

// //       setProfesionalesRequest(data)

// //       setCargando3(false)

// //     } catch (err) {
// //       setCargando3(false)
// //       console.log(err)
// //     }

// //   }

// //   function eliminarDelCarrito() {
// //     setServicios([]);
// //   }

// //   const [confirmarReserva, setConfirmarReserva] = useState(false)

// //   const handleProfesional = (profesional) => {

// //     setReserva({
// //       ...reserva,
// //       user_profesional_id: profesional.creador.creador._id,
// //       profesional_id: profesional.creador._id,
// //       profesional_email: profesional.creador.creador.email,
// //       profesional_nombre: profesional.creador.creador.nombre,
// //       profesional_apellido: profesional.creador.creador.apellido,
// //       profesional_telefono: profesional.creador.creador.telefono,
// //       dia_servicio: date,
// //       hora_servicio: time,
// //     })

// //     setConfirmarReserva(true)

// //   }
// //   console.log("RESERVA", reserva)

// //   const guardarReserva = async () => {
// //     try {
// //       let { data } = await clienteAxios.post(`/pay/finish/order`, reserva);

// //       setConfirmarReserva(false)

// //       toast.success(data.msg);

// //     } catch (err) {
// //       let error = err.response.data.msg
// //         ? err.response.data.msg
// //         : err.response && "Estamos presentando problemas internos";
// //       return toast.error(error);
// //     }
// //   };

// //   return (

// //     <div className="w-full mx-auto ">

// //       <div className="relative flex flex-col  break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
// //         <div className="rounded-t bg-white mb-0 px-6 py-6">
// //           <div className="text-center flex justify-between">
// //             <h6 className="text-blueGray-700 text-xl font-bold">
// //               Crear nueva reserva
// //             </h6>
// //           </div>
// //         </div>
// //         <div className="flex-auto px-4 lg:px-10 py-10 pt-0">

// //           <div className="flex justify-between py-2 mb-5">
// //             <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
// //               Información de usuario
// //             </h6>
// //             <div className="border border-gray-300  shadow-sm w-56 rounded flex relative">
// //               <select
// //                 onChange={(e) => setEstado(e.target.value)}
// //                 value={estado}
// //                 className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded">
// //                 <option value="">Estado</option>
// //                 <option value="registrado">Registrado</option>
// //                 <option value="nuevo">Nuevo usuario</option>
// //               </select>
// //               <div
// //                 className="px-4 flex items-center border-l border-gray-300  flex-col justify-center text-gray-500
// //                                        absolute right-0 bottom-0 top-0 mx-auto z-20 pointer-events-none "
// //               >
// //                 <svg
// //                   tabIndex={0}
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   className="icon icon-tabler icon-tabler-chevron-up"
// //                   width={16}
// //                   height={16}
// //                   viewBox="0 0 24 24"
// //                   strokeWidth="1.5"
// //                   stroke="currentColor"
// //                   fill="none"
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                 >
// //                   <path stroke="none" d="M0 0h24v24H0z" />
// //                   <polyline points="6 15 12 9 18 15" />
// //                 </svg>
// //                 <svg
// //                   tabIndex={0}
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   className="icon icon-tabler icon-tabler-chevron-down"
// //                   width={16}
// //                   height={16}
// //                   viewBox="0 0 24 24"
// //                   strokeWidth="1.5"
// //                   stroke="currentColor"
// //                   fill="none"
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                 >
// //                   <path stroke="none" d="M0 0h24v24H0z" />
// //                   <polyline points="6 9 12 15 18 9" />
// //                 </svg>
// //               </div>
// //             </div>
// //           </div>

// //           {
// //             estado === "nuevo" ?

// //               <>
// //                 <div className="flex flex-wrap">
// //                   {/* <div className="w-full lg:w-6/12 px-4">
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         Nombre de usuario
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         placeholder="Nombre de usuario"
// //                         name="username"
// //                         value={username}
// //                         onChange={handleChange}
// //                       />
// //                     </div>
// //                   </div> */}

// //                   <div className="w-full lg:w-6/12 px-4">
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         correo electrónico
// //                       </label>
// //                       <input
// //                         type="email"
// //                         name="cliente_email"
// //                         onChange={handleChange}
// //                         value={cliente_email}
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         placeholder="Correo Electrónico"
// //                       />
// //                     </div>
// //                   </div>
// //                   <div className="w-full lg:w-6/12 px-4">
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         Nombres
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         placeholder="Nombres"
// //                         value={cliente_nombre}
// //                         name="cliente_nombre"
// //                         onChange={handleChange}
// //                       />
// //                     </div>
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         Cédula
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         placeholder="Cédula"
// //                         value={cliente_cedula}
// //                         name="cliente_cedula"
// //                         onChange={handleChange}
// //                       />
// //                     </div>
// //                   </div>
// //                   <div className="w-full lg:w-6/12 px-4">
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         Apellidos
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         placeholder="Apellidos"
// //                         name="cliente_apellido"
// //                         value={cliente_apellido}
// //                         onChange={handleChange}
// //                       />
// //                     </div>
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         Teléfono
// //                       </label>
// //                       <input
// //                         type="text"
// //                         name="cliente_telefono"
// //                         onChange={handleChange}
// //                         value={cliente_telefono}
// //                         placeholder="Teléfono"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

// //                       />
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <hr className="mt-6 border-b-1 border-blueGray-300" />

// //                 <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
// //                   INFORMACIÓN DE Contacto
// //                 </h6>
// //                 <div className="flex flex-wrap">
// //                   <div className="w-full lg:w-12/12 px-4">
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         Dirección
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         name="direccion_Servicio"
// //                         onChange={handleChange}
// //                         value={direccion_Servicio}
// //                         placeholder="Dirección del cliente"
// //                       />
// //                     </div>
// //                   </div>
// //                   <div className="w-full lg:w-4/12 px-4">
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         INFORMACIÓN ADICIONAL
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         placeholder="Información adicional"
// //                         name="adicional_direccion_Servicio"
// //                         onChange={handleChange}
// //                         value={adicional_direccion_Servicio}
// //                       />
// //                     </div>
// //                   </div>
// //                   <div className="w-full lg:w-4/12 px-4">
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         Ciudad
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         placeholder="Ciudad"
// //                         name="ciudad_Servicio"
// //                         onChange={handleChange}
// //                         value={ciudad_Servicio}
// //                       />
// //                     </div>
// //                   </div>
// //                   <div className="w-full lg:w-4/12 px-4">
// //                     <div className="relative w-full mb-3">
// //                       <label
// //                         className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                         htmlFor="grid-password"
// //                       >
// //                         Localidad
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                         placeholder="Localidad"
// //                         name="localidad_Servicio"
// //                         onChange={handleChange}
// //                         value={localidad_Servicio}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </>
// //               :
// //               <>
// //                 {
// //                   !cargando ?
// //                     <form onSubmit={handleSubmitUserEmail}>
// //                       <div className="relative w-full mb-3">
// //                         <label
// //                           className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                           htmlFor="grid-password"
// //                         >
// //                           Correo Electrónico de usuario
// //                         </label>
// //                         <input
// //                           type="email"
// //                           value={userEmail}
// //                           onChange={(e) => setUserEmail(e.target.value)}
// //                           className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
// //                           placeholder="Correo Electrónico"
// //                         />
// //                       </div>
// //                       <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
// //                         <p className="text-sm font-medium leading-none text-white">
// //                           Buscar Usuario
// //                         </p>
// //                       </button>
// //                     </form>
// //                     :
// //                     <Spinner />
// //                 }
// //               </>

// //           }

// //           <hr className="mt-6 border-b-1 border-blueGray-300" />

// //           <div className="flex justify-between py-2 mb-5">
// //             <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
// //               Información de servicio
// //             </h6>
// //           </div>

// //           <div className="flex flex-wrap">
// //             <div className="w-full lg:w-6/12 px-4">
// //               <div className="relative w-full mb-3">
// //                 <label
// //                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                   htmlFor="grid-password"
// //                 >
// //                   Servicios
// //                 </label>

// //                 <select
// //                   id="servicios"
// //                   className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded"
// //                   //value={especialidad}
// //                   onChange={handleChangeServicio}
// //                   name="servicios"
// //                 >
// //                   <option value="">Servicios</option>
// //                   {productos?.map((servicio, index) => (
// //                     <option key={index} value={servicio._id}>
// //                       {servicio.nombre}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             {servicios?.length > 0 && (
// //               <div id="menu" className={`w-full px-4 flex`}>
// //                 <div className="pt-11 sm:px-6 px-4 pb-4 sm:pb-6 flex-row space-y-12 w-full relative ">
// //                   {servicios.map((servicio, index) => (
// //                     <div key={index} className=" flex flex-row w-full justify-between sm:space-x-4 ">
// //                       <div className="flex gap-4">

// //                         <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
// //                           <img
// //                             src={servicio?.img}
// //                             alt=""
// //                             className="h-full w-full object-cover object-center"
// //                           />
// //                         </div>

// //                         <div className="flex justify-center items-start flex-col mt-4 sm:mt-0">
// //                           <p className="text-base leading-4 text-gray-800">{servicio.nombre}</p>
// //                           <p className="text-sm leading-none mt-2 text-gray-600">Cantidad: 1 </p>
// //                           <p className="text-xl font-semibold leading-5 mt-5 text-gray-800">${servicio.precio}</p>
// //                         </div>

// //                       </div>

// //                       <div className="  sm:right-0 sm:inset-y-3">
// //                         <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 "
// //                         onClick={() => eliminarDelCarrito()}>
// //                           <svg className="text-gray-800 hover:text-black fill-stroke" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                             <path
// //                               d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
// //                               fill="currentColor"
// //                             />
// //                           </svg>
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ))}

// //                   <div className="flex justify-center items-center w-full flex-col space-y-2">
// //                     <div className="flex justify-between items-center w-full">
// //                       <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">Total</p>
// //                       <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">$ {servicios[0].precio}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {linkPago ? (
// //             <>

// //               <hr className="mt-6 border-b-1 border-blueGray-300" />

// //               <div className="flex justify-between py-2 mb-5">
// //                 <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
// //                   Link de pago
// //                 </h6>
// //               </div>

// //               <div className="flex flex-wrap items-center">
// //                 <div className="w-full lg:w-3/4 px-4">
// //                   <div className="w-full">
// //                     <label
// //                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
// //                       htmlFor="grid-password"
// //                     >
// //                       Link de pago
// //                     </label>
// //                     <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" value={linkPago} readOnly />
// //                   </div>
// //                 </div>

// //                 <div className="w-full lg:w-1/5 px-4 mt-5">
// //                   <button onClick={handleCopyLink} className="p-2 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none text-white"> Copiar Link </button>
// //                 </div>

// //               </div>

// //             </>

// //           ) : (
// //             cargando2 ?
// //               <Spinner />
// //               :
// //               reserva.cliente_email && servicios.length > 0 &&
// //               <button
// //                 onClick={generarPreferencias}
// //                 className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
// //                 <p className="text-sm font-medium leading-none text-white">
// //                   Generar Link de Pago
// //                 </p>
// //               </button>
// //           )}

// //           {
// //             reserva?.profesional_id  && reserva?.estadoPago === "approved" &&
// //             <>
// //               <hr className="mt-6 border-b-1 border-blueGray-300" />

// //               <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
// //                 Información de reserva - profesional Asignado
// //               </h6>

// //               <div className="flex flex-col items-center p-6">
// //                 <img
// //                   src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
// //                   className="w-24 h-24 mb-3 rounded-full shadow-lg"

// //                 />
// //                 <h5 className="mb-1 text-xl font-medium text-gray-900">
// //                   {reserva?.profesional_nombre}   {reserva?.profesional_apellido}
// //                 </h5>
// //                 <span className="text-sm text-gray-500 text-center">
// //                   {reserva?.profesional_email}
// //                 </span>
// //                 <span className="text-sm text-gray-500"></span>
// //               </div>
// //             </>
// //           }

// //           {
// //             id && reserva?.estadoPago === "approved" &&
// //             <>

// //               <hr className="mt-6 border-b-1 border-blueGray-300" />

// //               <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
// //                 Información de reserva
// //               </h6>
// //               <div className="flex flex-wrap">
// //                 <div className="w-full lg:w-12/12 px-4">
// //                   <div className="grid gap-4 mb-4 sm:grid-cols-2">
// //                     <div>
// //                       <label
// //                         htmlFor="date"
// //                         className="block mb-2 text-sm font-medium text-gray-900"
// //                       >
// //                         Fecha
// //                       </label>
// //                       <input
// //                         type="date"
// //                         name="date"
// //                         id="date"
// //                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5"
// //                         placeholder="username.example"
// //                         required=""
// //                         onChange={handleChangeProfesional}
// //                         value={date}
// //                       />
// //                     </div>

// //                     <div>
// //                       <label
// //                         htmlFor="time"
// //                         className="block mb-2 text-sm font-medium text-gray-900"
// //                       >
// //                         Hora
// //                       </label>

// //                       <select
// //                         type="time"
// //                         name="time"
// //                         id="time"
// //                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-full p-2.5 "
// //                         required=""
// //                         onChange={handleChangeProfesional}
// //                         value={time}
// //                       >
// //                         <option value="">Hora</option>
// //                         {hourSelect?.map((hour, index) => (
// //                           <option key={index} value={hour}>
// //                             {hour}
// //                           </option>
// //                         ))}
// //                       </select>
// //                     </div>
// //                   </div>

// //                   {
// //                     date && time &&
// //                     <button
// //                       onClick={obtenerProfesional}
// //                       className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
// //                       <p className="text-sm font-medium leading-none text-white">
// //                         Buscar disponibilidad
// //                       </p>
// //                     </button>
// //                   }

// //                   <div className="mx-auto mt-6 flex bg-whitefull-screen flex-wrap items-center justify-around">
// //                     {!cargando3 ? (
// //                       profesionalesRequest.length > 0 ? (
// //                         profesionalesRequest.map((profesional) => (
// //                           <div
// //                             className={`w-full max-w-sm rounded-lg shadow-md ${profesional.styles &&
// //                               "bg-gray-100 border border-gray-200 "
// //                               }`}
// //                           >
// //                             <div className="flex flex-col items-center p-6">
// //                               <img
// //                                 className="w-24 h-24 mb-3 rounded-full shadow-lg"
// //                                 src={
// //                                   profesional?.creador.creador.img
// //                                     ? profesional?.creador.creador.img
// //                                     : "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
// //                                 }
// //                               />
// //                               <h5 className="mb-1 text-xl font-medium text-gray-900">
// //                                 {profesional.creador.creador.nombre}
// //                               </h5>
// //                               <span className="text-sm text-gray-500 text-center">
// //                                 {profesional.creador.descripcion}
// //                               </span>
// //                               <span className="text-sm text-gray-500"></span>
// //                               <div className="flex mt-4 space-x-3 md:mt-6">
// //                                 <div
// //                                   onClick={() => handleProfesional(profesional)}
// //                                   className="inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover"
// //                                 >
// //                                   Seleccionar
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))
// //                       ) : (
// //                         <>{profesionalesRequest.msg}</>
// //                       )
// //                     ) : (
// //                       <Spinner />
// //                     )}
// //                   </div>

// //                   {confirmarReserva && <button
// //                     onClick={guardarReserva}
// //                     className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
// //                     <p className="text-sm font-medium leading-none text-white">
// //                       Confirmar Reserva
// //                     </p>
// //                   </button>}

// //                 </div>
// //               </div>
// //             </>

// //           }
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateReservation;
