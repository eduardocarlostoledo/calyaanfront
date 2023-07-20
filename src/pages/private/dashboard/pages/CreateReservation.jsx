import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import clienteAxios from "../../../../config/axios";
import Spinner from "../../../../components/Spinner";
import limpiarHorarios from "../../../../helpers/Logic/limpiarHorarios";
import swal from "sweetalert";
import { FaArrowsAltV } from "react-icons/fa"
import ScheduleProfessional from "../components/FormReserva/ScheduleProfessional";
import FormUserEmail from "../components/FormReserva/FormUserEmail";
import FormUser from "../components/FormReserva/FormUser";
import ServiciosComponent from "../components/FormReserva/ServiciosComponent";
import axios from "axios";
import e from "cors";

const CreateReservation = () => {

  const querystring = window.location.search;
  const params = new URLSearchParams(querystring);
  let id = params.get("id");


  const [idOrder, setIDOrder] = useState(id)
  const [datosPago,setDatosPago] = useState({
    origen:"",
    payment_id:""
  })

  const [linkPago, setLinkPago] = useState("");

  // Estado para saber si el usuario es nuevo o toca registrarlo 
  const [estado, setEstado] = useState("");

  // Para buscar el usuario mediante Email
  const [userEmail, setUserEmail] = useState("");


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
    hora_servicio: "",
    direccion_servicio:"",
    adicional_direccion_servicio: "",
    localidad_servicio: "",
    telefono_servicio: "",
    nuevo: true,
    coupon: "",
    metodo_pago: "",
    link_pago: "",
    estadoPago:""
  });

  const handleChange = (e) => {
    setReserva({
      ...reserva,
      [e.target.name]: e.target.value,
    });
  };


  const [servicios, setServicios] = useState([]);
  const [liberar, setLiberar] = useState({}); //se va a guardar el dato de la reserva si existe en caso de reprogramacion

  useEffect(() => {
    if (id) {
      const getHistorial = async () => {
        try {

          let { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);


          console.log(data)

          if (data.profesional_id) {
            setReserva({
              nuevo: false,
              cliente_id: data.cliente_id._id,
              cliente_email: data.cliente_id.email,
              cliente_nombre: data.cliente_id.nombre,
              cliente_apellido: data.cliente_id.apellido,
              cliente_cedula: data.cliente_id.cedula,
              cliente_telefono: data.cliente_id.telefono,
              telefono_servicio:data.telefono_servicio,
              profesional_id: data.profesional_id,
              cita_servicio: data.cita_servicio,
              hora_servicio: data.hora_servicio,
              localidad_servicio: data.localidad_servicio,
              direccion_servicio:data.direccion_servicio,
              adicional_direccion_servicio: data.adicional_direccion_servicio,
              coupon: "",
              metodo_pago: data.factura.metodo_pago,
              link_pago: data.factura.link_pago,
              estadoPago:data.factura.estadoPago
            });
          } else {
            setReserva({
              ...reserva,
              nuevo: false,
              cliente_id: data.cliente_id._id,
              cliente_email: data.cliente_id.email,
              cliente_nombre: data.cliente_id.nombre,
              cliente_apellido: data.cliente_id.apellido,
              cliente_cedula: data.cliente_id.cedula,
              cliente_telefono: data.cliente_id.telefono,
              telefono_servicio:data.telefono_servicio,
              profesional_id: "",
              cita_servicio: data.cliente_id.cita_servicio,
              hora_servicio: "",
              direccion_servicio:data.direccion_servicio,
              localidad_servicio: data.localidad_servicio,
              adicional_direccion_servicio: data.adicional_direccion_servicio,
              coupon: "",
              estado_servicio: data.estado_servicio,
              metodo_pago: data.factura.metodo_pago,
              link_pago: data.factura.link_pago,
              estadoPago:data.factura.estadoPago
            });
          }

          console.log("arreglo de servicios", data)

          setServicios(data.servicios);

          setDatosPago({
            origen:data.factura.origen,
            payment_id:data.factura.payment_id
          });

          setEstado("nuevo");

          if (data.hora_servicio && data.cita_servicio) {
            console.log("Se han resguardado los datos de la reserva.");

            setLiberar({
              ...data,
              liberar_hora_servicio: data?.hora_servicio,
              liberar_dia_servicio: data?.cita_servicio,
              liberar_profesional_id: data?.profesional_id,
              liberar_profesional_email: data.profesional_id?.email,
              liberar_profesional_telefono: data.profesional_id?.telefono,
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

  console.log(reserva)


  const [metodoexterno, setMetodoExterno] = useState(false)

  async function generarPreferencias(metodo) {


    setCargando2(true);

    const clienteNuevo = {
      email: reserva.cliente_email,
      nombre: reserva.cliente_nombre,
      apellido: reserva.cliente_apellido,
      cedula: reserva.cliente_cedula,
      telefono: reserva.cliente_telefono,
      direccion: reserva.direccion_servicio,
      localidad:reserva.localidad_servicio,
      info: reserva.adicional_direccion_servicio,
      ciudad: "Bogotá",
    };

    try {
      if (reserva.nuevo) {
        try{
          const datos1 = await clienteAxios.post(
            `${import.meta.env.VITE_APP_BACK}/api/usuarios/reserva-usuario`,
            clienteNuevo
          );
  
          const serviciosRequest = servicios.map((servicio) => servicio.idWP);
  
          const reservaRequest = {
            cliente_id: datos1.data._id,
            servicios: serviciosRequest,
            localidad_servicio: reserva.localidad_servicio,
            adicional_direccion_servicio: reserva.adicional_direccion_servicio,
            telefono_servicio: reserva.telefono_servicio,
            direccion_servicio:reserva.direccion_servicio,
            coupon: reserva.coupon,
            metodo_pago: metodo,
            link_pago: linkPago
          };

          await procesarPreferencias(reservaRequest);

        }catch(err){
          setCargando2(false);
          let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
          return toast.error(error);
        }

      } else {
        const serviciosRequest = servicios.map((servicio) => servicio.idWP);

        const reservaRequest = {
          cliente_id: reserva.cliente_id,
          servicios: serviciosRequest,
          localidad_servicio: reserva.localidad_servicio,
          adicional_direccion_servicio: reserva.adicional_direccion_servicio,
          telefono_servicio: reserva.telefono_servicio,
          direccion_servicio:reserva.direccion_servicio,
          coupon: reserva.coupon,
          metodo_pago: metodo,
          link_pago: linkPago
        };

        await procesarPreferencias(reservaRequest);
      }

      if(metodo === "Externo"){
        setMetodoExterno(!metodoexterno)
      }

    } catch (err) {
      console.error(err);
      setCargando2(false);
      let error = err.response.data.msg
      ? err.response.data.msg
      : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
  /*     swal({
        title: "Algo salio mal",
        text: ",
        icon: "error",
        button: "Aceptar",
      }); */
    
    }

    setCargando2(false);
  }

  async function procesarPreferencias(reservaRequest) {

    console.log(reservaRequest)

    const producto = servicios[0].nombre;
    const precio = servicios[0].valorTotal || servicios[0].precio;

    const respuesta1 = await axios.post(
      `${import.meta.env.VITE_APP_BACK}/api/pay/preference-manual`,
      reservaRequest
    );

    const datos1 = respuesta1.data;

    setIDOrder(datos1.order)

    if (reservaRequest.metodo_pago !== "Externo") {

      const respuesta2 = await axios.post(
        "https://api.mercadopago.com/checkout/preferences",
        {
          items: [
            {
              title: producto,
              unit_price: Number(precio),
              quantity: 1,
            },
          ],
          back_urls: {
            success: `${import.meta.env.VITE_APP_BACK}/api/pay/feedback/success/manual`,
            failure: `${import.meta.env.VITE_APP_BACK}/api/pay/feedback/failure/manual`,
            pending: `${import.meta.env.VITE_APP_BACK}/api/pay/feedback/pending/manual`,
          },
          auto_return: "approved",
          payment_methods: {
            excluded_payment_types: [
              { id: "ticket" },
              { id: "bank_transfer" },
            ],
          },
          statement_descriptor: "CALYAAN COLOMBIA",
          external_reference: datos1.factura,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      const datos2 = respuesta2.data;

      setLinkPago(datos2.init_point);
    }

  }



  const [orderId, setOrderId] = useState("");



  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkPago);
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
            localidad: reserva?.localidad_servicio,
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

  const [loadingLiberar,setLoadingLiberrar] = useState(false)

  const guardarReserva = async () => {
    setLoadingLiberrar(true)
    try {

      if (liberar && Object.keys(liberar).length > 0) {
        // console.log("liberando reserva")
        let response = await clienteAxios.post(
          `api/pay/finish/liberar`,
          liberar
        );
        let { data } = await clienteAxios.post(`api/pay/finish/order`, {id:idOrder});
        setConfirmarReserva(false);

        toast.success(response.data.msg);
        toast.success(data.msg);
        setLoadingLiberrar(false)
        swal({
          title: "Reprogramada",
          text: "Recarga tu navegador para ver los cambios",
          icon: "success",
          button: "Aceptar",
        });
      }

      swal({
        title: "Algo salio mal",
        text: "Recarga tu navegador o consulta con area de tecnologia",
        icon: "error",
        button: "Aceptar",
      });
      // console.log("asignando reserva")
      setLoadingLiberrar(false)
      setConfirmarReserva(false);

  /*     toast.success(dataFree.msg);
      toast.success(data.msg); */
    } catch (err) {
      console.log(err)
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  };

  const actualizarPago = async(e)=>{

    e.preventDefault()

    try{
      
      if ([datosPago.payment_id, datosPago.origen].includes("")) {
        return toast.error("Se requieren los campos de Nro de pago y Origen de pago");
      }

      let {data} = await clienteAxios.post(
        `api/pay/actualizar-pago`,
        {
          ...datosPago,
          id: idOrder
        }
      );

      toast.success(data.msg)

    }catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }

  }

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
            <FormUser handleChange={handleChange} reserva={reserva} />
          ) : (
            <FormUserEmail userEmail={userEmail} setUserEmail={setUserEmail} setEstado={setEstado} setReserva={setReserva} reserva={reserva} />
          )}

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          <ServiciosComponent setServicios={setServicios} servicios={servicios} setReserva={setReserva} reserva={reserva} />

          {
            (reserva.metodo_pago === "") &&
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-4 mb-6 font-bold uppercase">
                Formas de pago
              </h6>

              <div className="container  grid grid-cols-2  gap-8">

                <div className="rounded bg-white p-4" >

                  <h4 className="font-bold mb-2">Link de Pago</h4>

                  <p>La generación de enlaces de pago permite enviar un enlace al cliente para que realice el pago correspondiente. Una vez que se ha efectuado el pago, el cliente puede programar sus citas, ya que el pago ha sido aprobado.</p>

                  <button
                    onClick={() => { generarPreferencias("Interno") }
                    }
                    className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
                  >
                    <p className="text-sm font-medium leading-none text-white">
                      Generar Link de Pago
                    </p>
                  </button>
                </div>

                <div className="rounded bg-white p-4" >

                  <h4 className="font-bold mb-2">Pago Externo</h4>

                  <p>Al utilizar este método de pago externo, se deben actualizar los campos correspondientes al pago en la tabla de facturación al confirmar el pago. Sin embargo, se permitirá agendar una cita con la profesional antes de realizar el pago.</p>

                  <button
                    onClick={(e) => {
                      generarPreferencias("Externo")
                    }}
                    className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
                  >
                    <p className="text-sm font-medium leading-none text-white">
                      Agendar Profesional
                    </p>
                  </button>
                </div>
              </div>
            </>
          }

          {
           ( reserva.metodo_pago === "Interno" && reserva.estadoPago === "approved") ?
              <>
                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2 ">
                  <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                    Formas de pago
                  </h6>
                </div>

                <p>El metodo utilizado fue interno</p>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2 ">
                  <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                    Agenda de servicio
                  </h6>
                </div>

                <ScheduleProfessional loadingLiberar={loadingLiberar}  guardarReserva={guardarReserva} id={idOrder} reserva={reserva} setReserva={setReserva} nombreServicio={servicios[0]?.nombre} localidadServicio={reserva.localidad_servicio} />

              </>
              : (reserva.metodo_pago === "Externo" || metodoexterno) &&
              <>
                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2 ">
                  <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                    Formas de pago
                  </h6>
                </div>

                <p>El metodo utilizado fue externo</p>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2 ">
                  <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                    Agenda de servicio
                  </h6>
                </div>

                <ScheduleProfessional loadingLiberar={loadingLiberar} guardarReserva={guardarReserva} id={idOrder} reserva={reserva} setReserva={setReserva} nombreServicio={servicios[0]?.nombre} localidadServicio={reserva.localidad_servicio} />

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2">
                  <h6 className="text-blueGray-400 text-sm my-6 font-bold uppercase">
                    Datos de pago
                  </h6>
                </div>

                <form className="flex flex-wrap" onSubmit={actualizarPago}>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        ID Pago
                      </label>
                      <input
                        type="text"
                        value={datosPago.payment_id}
                        onChange={(e)=>setDatosPago({
                          ...datosPago,
                          payment_id:e.target.value
                        })}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="123123213123"
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Origen
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Bancolombia"
                        value={datosPago.origen}
                        onChange={(e)=>setDatosPago({
                          ...datosPago,
                          origen:e.target.value
                        })}
                      />
                    </div>

                    <button type="submit" className="text-white mt-4 mx-auto bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 max-lg:w-3/4 max-sm:w-full">
                      Guardar
                    </button>

                  </div>
                </form>

              </>
          }

          {linkPago && !cargando2 ? (
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <div className="flex justify-between py-2 ">
                <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                  Link de pago
                </h6>
              </div>

              <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-3/4 px-4">
                  <div className="w-full">
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={linkPago}
                      readOnly
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/5 px-4">
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
          ) : cargando2 && (
            <div className="mt-16">
              <Spinner />
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default CreateReservation;