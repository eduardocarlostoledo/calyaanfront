import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, List, Spin, Alert, Tag, Input, DatePicker } from "antd";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import {
  getOrders,
  updateOrder,
  createOrder,
} from "../../../../redux/features/ordenesSlice";
import moment from "moment";
import swal from "sweetalert";
import "./Ordenesantd.css";

const { RangePicker } = DatePicker;

const ProductExpanded = ({
  _id,
  cliente_id,
  direccion_Servicio,
  estadoServicio,
  estadoPago,
  payment_id,
  factura,
  // _id,
  // cliente_email,
  // cliente_nombre,
  // cliente_apellido,
  // cliente_cedula,
  // cliente_telefono,
  // direccion_Servicio,
  // adicional_direccion_Servicio,
  // localidad_Servicio,
  // telefono_Servicio,
  // estadoServicio,
  // estadoFacturacion,
  // payment_id,
  // estadoPago,
  // numeroFacturacion,
  // estadoLiquidacion,
  // numeroLiquidacion,
  // profesional_email,
  // profesional_nombre,
  // profesional_apellido,
  editProduct,
  setEditProduct,
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    _id,
    cliente_id,
    direccion_Servicio,
    estadoServicio,
    estadoPago,
    payment_id,
    factura,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const change = useSelector((state) => state.ordenes.update);
  const orders = useSelector((state) => state.ordenes.order || []);
  //separo los useEffect para que no se renderize todo junto

  useEffect(() => {
    setLoading(true); // updateinprogress
    // dispatch(updateOrder(false))
    // dispatch(getOrders())

    // .then(() => setLoading(false))
    // .catch((error) => setError(error.message));
  }, [dispatch, change, orders]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log("INPUT", input);
    const data = new FormData();
    Object.keys(input).forEach((key) => data.append(key, input[key]));
    dispatch(updateOrder(input));
    setEditProduct(0);
    swal("success", "ORDEN MODIFICADA", "success");
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        await dispatch(getOrders());
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    console.log("act");
    fetchOrders();
  }, [dispatch, editProduct]);

  return (
    <div>
      {!(editProduct === _id) && (
        <div className="productExpandedDiv">
          <BiEditAlt
            color="black"
            size="40px"
            style={{ display: "flex", flexDirection: "row", cursor: "pointer" }}
            onClick={() => setEditProduct(_id)}
          />
          <div
            className="NameImgDiv"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <div style={{ width: "50%" }}>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                <b>Localidad:</b> {input.localidad_Servicio}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                <b>Dirección de servicio:</b> {input.direccion_Servicio}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                  backgroundColor:
                    input.estadoPago === "approved"
                      ? "#96e382"
                      : input.estadoPago === "rejected"
                      ? "#f16e6a"
                      : input.estadoPago === "pending"
                      ? "#f1ef6a"
                      : "transparent",
                }}
              >
                <b> Estado pago:</b>
                {input.estadoPago}
              </p>

              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                <b>Origen del pago:</b> {input?.factura.origen}
              </p>
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                Email: {input.cliente_email}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                Nombre: {input.cliente_nombre}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                Apellido: {input.cliente_apellido}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }} 
              >
                Cédula: {input.cliente_cedula}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                Teléfono: {input.cliente_telefono}
              </p> */}

              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                Dirección adicional de servicio: <br />
                {input.adicional_direccion_Servicio}
              </p> */}
            </div>

            <div style={{ width: "50%" }}>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                <b>Estado de facturación:</b>
                {input.factura.estado_facturacion}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                <b>Número de facturación:</b>
                {input.factura.nro_factura}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                <b>N°Pago:</b> {input.factura.payment_id}
              </p>
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize:"14px",
                }}
              >
                Teléfono de servicio: {input.telefono_Servicio}
              </p> */}
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                Estado de facturación: {input.estadoServicio}
              </p> */}

              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                Estado de liquidación: {input.estadoLiquidacion}
              </p> */}
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  borderRadius: "3px",
                  fontSize: "17px",
                }}
              >
                Número de liquidación: {input.numeroLiquidacion}
              </p> */}
            </div>
          </div>
        </div>
      )}

      {editProduct === _id && (
        <div className="productExpandedDiv">
          <AiOutlineClose
            onClick={() => setEditProduct(0)}
            color="red"
            size="50px"
            style={{ cursor: "pointer" }}
          />
          <div
            className="NameImgDiv"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "50%" }}>
              {/* <div>
                <label className="LabelNameImg">
                  <strong>Email </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_email}
                  onChange={(e) => handleChange(e)}
                  name="cliente_email"
                  placeholder="Email del cliente"
                ></input>
              </div> */}

              {/* <div>
                <label className="LabelNameImg">
                  <strong>Nombre </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_nombre}
                  onChange={(e) => handleChange(e)}
                  name="cliente_nombre"
                  placeholder="Nombre"
                ></input>
              </div> */}

              {/* <div>
                <label className="LabelNameImg">
                  <strong>Apellido </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_apellido}
                  onChange={(e) => handleChange(e)}
                  name="cliente_apellido"
                  placeholder="Apellido del cliente"
                ></input>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>Cédula </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_cedula}
                  onChange={(e) => handleChange(e)}
                  name="cliente_cedula"
                  placeholder="Cédula del cliente"
                ></input>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>Teléfono </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_telefono}
                  onChange={(e) => handleChange(e)}
                  name="cliente_telefono"
                  placeholder="Teléfono del cliente"
                ></input>
              </div> */}

              {/* <div>
                <label className="LabelNameImg">
                  <strong>Dirección </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.direccion_Servicio}
                  onChange={(e) => handleChange(e)}
                  name="direccion_Servicio"
                  placeholder="Dirección de servicio"
                ></input>
              </div> */}

              {/* <div>
                <label className="LabelNameImg">
                  <strong>Datos Adicionales</strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.adicional_direccion_Servicio}
                  onChange={(e) => handleChange(e)}
                  name="adicional_direccion_Servicio"
                  placeholder="Dirección adicional de servicio"
                ></input>
              </div> */}
              {/* <div style={{ width: "50%" }}>
              <div>
                <label className="LabelNameImg">
                  <strong>Localidad</strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.localidad_Servicio}
                  onChange={(e) => handleChange(e)}
                  name="localidad_Servicio"
                  placeholder="Localidad de servicio"
                ></input>
              </div>
            </div> */}

              <div>
                <label className="LabelNameImg">
                  <strong>Origen del Pago</strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.factura?.origen}
                  onChange={(e) => handleChange(e)}
                  name="origen"
                  placeholder="Origen del Pago"
                ></input>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>Facturación</strong>
                </label>
                <select
                  className="InputsEdits"
                  // defaultValue="NoFacturado"
                  value={input.estadoFacturacion}
                  onChange={(e) => handleChange(e)}
                  name="estadoFacturacion"
                  placeholder="Estado de facturación"
                >
                  <option value="Facturado">Facturado</option>
                  <option value="NoFacturado">No facturado</option>
                  <option value="Error">Error</option>
                </select>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>NºFactura</strong>
                </label>
                <input
                  className="InputsEdits"
                  // defaultValue=""
                  value={input.numeroFacturacion}
                  onChange={(e) => handleChange(e)}
                  name="numeroFacturacion"
                  placeholder="Número de facturación"
                ></input>
              </div>

              {/* <div>
                <label className="LabelNameImg">
                  <strong>Liquidación</strong>
                </label>
                <select
                  className="InputsEdits"
                  // defaultValue="NoLiquidado"
                  value={input.estadoLiquidacion}
                  onChange={(e) => handleChange(e)}
                  name="estadoLiquidacion"
                  placeholder="Estado de liquidación"
                >
                  <option value="Liquidado">Liquidado</option>
                  <option value="NoLiquidado">No liquidado</option>
                  <option value="Error">Error</option>
                </select>
              </div> */}

              {/* <div>
                <label className="LabelNameImg">
                  <strong>NºLiquidación</strong>
                </label>
                <input
                  className="InputsEdits"
                  // defaultValue=""
                  value={input.numeroLiquidacion}
                  onChange={(e) => handleChange(e)}
                  name="numeroLiquidacion"
                  placeholder="Número de liquidación"
                ></input>
              </div> */}
              <div>
                <label className="LabelNameImg">
                  <strong>Estado pago</strong>
                </label>
                <select
                  className="InputsEdits"
                  // defaultValue="NoLiquidado"
                  value={input.estadoPago}
                  onChange={(e) => handleChange(e)}
                  name="estadoPago"
                  placeholder="Estado Pago"
                >
                  <option value="approved">Aprobado</option>
                  <option value="pending">Pendiente</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </div>
              <div>
                <label className="LabelNameImg">
                  <strong>NºPago</strong>
                </label>
                <input
                  className="InputsEdits"
                  // defaultValue=""
                  value={input.payment_id}
                  onChange={(e) => handleChange(e)}
                  name="payment_id"
                  placeholder="Número de Pago"
                ></input>
              </div>
            </div>

            <div className="ButtonDiv">
              <button onClick={(e) => handleSubmit(e)} className="ButtonSubmit">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FacturacionAntDesing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editProduct, setEditProduct] = useState(0);
  const change = useSelector((state) => state.ordenes.update);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (dates) => {
    const dateNow = dates ? moment(dates[0].$d).format("YYYY/MM/DD") : null;
    const dateNow2 = dates ? moment(dates[1].$d).format("YYYY/MM/DD") : null;
    console.log(dates);
    dates ? setStartDate(dateNow) : setStartDate("");
    dates ? setEndDate(dateNow2) : setEndDate("");
  };
  //separo los useEffect para que no se renderize todo junto
  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch, change]);
  // }, [orders, change]);

  // useEffect(() => {
  //   dispatch(updateOrder(false))
  //     .then(() => setLoading(false))
  //     .catch((error) => setError(error.message));
  // }, [change]);

  const orders = useSelector((state) => state.ordenes.order || []);

  //// Mapeo ordenes para agregar una key a cada fila
  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  //se filtran las ordenes para renderizado de la tabla

  const filteredOrdenes = useMemo(() => {
    if (!newProducts || newProducts.length === 0) {
      return [];
    }

    const searchTextLower = searchText.toLowerCase();
    return newProducts.filter((orden) => {
      const fullNameProfesional =
        `${orden.cliente_id.nombre} ${orden.cliente_id.apellido}`.toLowerCase();
      const fullNameCliente =
        `${orden.cliente_id.nombre} ${orden.cliente_id.apellido}`.toLowerCase();
      const fullNameProfesionalInverso =
        `${orden.profesional_apellido} ${orden.profesional_nombre} `.toLowerCase();
      const fullNameClienteInverso =
        `${orden.cliente_id.apellido} ${orden.cliente_id.nombre}`.toLowerCase();

      const orderDate = moment(orden.createdAt, "YYYY/MM/DD");

      if (startDate && endDate) {
        return (
          (fullNameProfesional?.includes(searchTextLower) ||
            fullNameCliente?.includes(searchTextLower) ||
            fullNameProfesionalInverso?.includes(searchTextLower) ||
            fullNameClienteInverso?.includes(searchTextLower) ||
            orden.factura?.nro_factura?.includes(searchTextLower) ||
            orden.factura?.payment_id?.includes(searchTextLower) ||
            orden._id?.includes(searchTextLower) ||
            // orden.cliente_id?.cedula.includes(searchTextLower) ||
            orden.cliente_id?.telefono?.includes(searchTextLower) ||
            orden.cliente_id?.email?.includes(searchTextLower) ||
            orden.servicios[0]?.nombre
              .toLowerCase()
              ?.includes(searchTextLower) ||
            orden.direccion_Servicio
              ?.toLowerCase()
              ?.includes(searchTextLower)) &&
          orderDate.isBetween(startDate, endDate, null, "[]")
        );
      }
      return (
        fullNameProfesional?.includes(searchTextLower) ||
        fullNameCliente?.includes(searchTextLower) ||
        fullNameProfesionalInverso?.includes(searchTextLower) ||
        fullNameClienteInverso?.includes(searchTextLower) ||
        orden.factura?.nro_factura?.includes(searchTextLower) ||
        orden.factura?.payment_id?.includes(searchTextLower) ||
        orden._id?.includes(searchTextLower) ||
        orden.cliente_id?.cedula.toString().includes(searchTextLower) ||
        orden.cliente_id?.telefono?.includes(searchTextLower) ||
        orden.cliente_id?.email?.includes(searchTextLower) ||
        orden.servicios[0]?.nombre.toLowerCase()?.includes(searchTextLower) ||
        orden.direccion_Servicio?.toLowerCase()?.includes(searchTextLower)
      );
    });
  }, [newProducts, searchText, startDate, endDate]);

  // moment(orden.createdAt, "YYYY-MM-DD")
  //   .format("YYYY-MM-DD")
  //   ?.includes(searchTextLower)) &&
  // fullNameProfesional?.includes(searchTextLower) ||
  // fullNameCliente?.includes(searchTextLower) ||
  // fullNameProfesionalInverso?.includes(searchTextLower) ||
  // fullNameClienteInverso?.includes(searchTextLower) ||
  // orden.numeroFacturacion?.includes(searchTextLower) ||
  // orden.payment_id?.includes(searchTextLower) ||
  // orden._id?.includes(searchTextLower) ||
  // orden.cliente_cedula?.includes(searchTextLower) ||
  // orden.cliente_telefono?.includes(searchTextLower) ||
  // orden.cliente_email?.includes(searchTextLower) ||
  // orden.servicio?.toLowerCase().includes(searchTextLower) ||
  // orden.direccion_Servicio?.toLowerCase().includes(searchTextLower) ||
  // (moment(orden.createdAt, "YYYY-MM-DD")
  //   .format("YYYY-MM-DD")
  //   ?.includes(searchTextLower) &&
  //   isDateInRange)
  console.log(filteredOrdenes);
  const columns = [
    // {
    //   title: "EDITAR",
    //   dataIndex: "",
    //   render: (value) => (
    //     <div className="ActionsDiv">
    //       <button
    //         className="ButtonsActions"
    //         onClick={() => setEditProduct(value._id)}
    //       >
    //         <BiEditAlt />
    //       </button>
    //     </div>
    //   ),
    // },
    Table.EXPAND_COLUMN,
    // {
    //   title: "Cliente",
    //   dataIndex: "cliente_nombre",
    //   render: (text, record) => (
    //     <p>
    //       {record.cliente_apellido} {text}
    //     </p>
    //   ),
    // },
    {
      title: "Cliente",
      dataIndex: "cliente_id",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => (
        <div>
          <div>
            <b>Nombre y apellido</b>
            <p>
              {text.apellido} {text.nombre}
            </p>
          </div>
          <hr />
          <div>
            <b>Cedula</b>
            <p>{text.cedula}</p>
          </div>
          <hr />
          <div>
            <b>Telefono</b>
            <p>{text.telefono}</p>
          </div>
          <hr />
          <div>
            <b>Email</b>
            <p>{text.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Profesional",
      dataIndex: "profesional_id",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => (
        <div>
          <div>
            <b>Nombre y apellido</b>
            <p>
              {text.apellido} {text.nombre}
            </p>
          </div>
          <hr />
          <div>
            <b>Cedula</b>
            <p>{text.cedula}</p>
          </div>
          <hr />
          <div>
            <b>Telefono</b>
            <p>{text.telefono}</p>
          </div>
          <hr />
          <div>
            <b>Email</b>
            <p>{text.email}</p>
          </div>
        </div>
      ),
    },
    // {
    //   title: "Profesional",
    //   dataIndex: "profesional_nombre",
    //   render: (text, record) => (
    //     <p>
    //       {record.profesional_apellido} {text}
    //     </p>
    //   ),
    // },
    {
      title: "Estado Pago",
      dataIndex: "factura",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Rejected", value: "rejected" },
        { text: "Approved", value: "approved" },
      ],
      onFilter: (value, record) => record?.estadoPago === value,
      render: ({ estadoPago }) => (
        <>
          {estadoPago === "approved" ? (
            <Tag color="green">Aprobado</Tag>
          ) : estadoPago === "rejected" ? (
            <Tag color="red">Rechazado</Tag>
          ) : (
            <Tag color="yellow">Pendiente</Tag>
          )}
        </>
      ),
    },
    {
      title: "Id Pago",
      dataIndex: "factura",
      render: (text) => <p>{text.payment_id}</p>,
    },
    {
      title: "Origen del pago",
      dataIndex: "factura",
      render: (text) => <p>{text.origen}</p>,
    },
    {
      title: "Estado Servicio",
      dataIndex: "estadoServicio",
      filters: [
        { text: "Pendiente", value: "Pendiente" },
        { text: "Completado", value: "Completado" },
        { text: "Cancelado", value: "Cancelado" },
      ],
      onFilter: (value, record) => record?.estadoServicio === value,
      render: (estadoServicio) => (
        <>
          {estadoServicio === "Completado" ? (
            <Tag color="green">Completado</Tag>
          ) : estadoServicio === "Cancelado" ? (
            <Tag color="red">Cancelado</Tag>
          ) : (
            <Tag color="yellow">Pendiente</Tag>
          )}
        </>
      ),
    },
    {
      title: "Facturacion",
      dataIndex: "factura",
      filters: [
        { text: "Facturado", value: "Facturado" },
        { text: "NoFacturado", value: "NoFacturado" },
        { text: "Error", value: "Error" },
      ],
      onFilter: (value, record) => record?.estado_facturacion === value,
      render: ({ estado_facturacion }) => (
        <>
          {estado_facturacion === "Facturado" ? (
            <Tag color="green">Facturado</Tag>
          ) : estado_facturacion === "Error" ? (
            <Tag color="red">Error</Tag>
          ) : (
            <Tag color="yellow">No Facturado</Tag>
          )}
        </>
      ),
    },
    {
      title: "Nro. Factura",
      dataIndex: "factura",
      render: (text) => <p>{text.nro_factura}</p>,
    },

    // {
    //   title: "Cedula",
    //   dataIndex: "cliente_cedula",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "Telefono",
    //   dataIndex: "cliente_telefono",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "email",
    //   dataIndex: "cliente_email",
    //   render: (text) => <p>{text}</p>,
    // },
    {
      title: "Servicio",
      dataIndex: "servicios",
      render: (text) => text?.map((t) => <p>{t.nombre}</p>),
    },
    {
      title: "Precio",
      dataIndex: "factura",
      sorter: (a, b) => a.precio - b.precio,
      defaultSortOrder: "descend",
      render: (text) => <p>{text.precioTotal}</p>,
    },
    // {
    //   title: "Direccion",
    //   dataIndex: "localidad_Servicio",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text, record) => (
    //     <p>
    //       {record.direccion_Servicio} {text}
    //     </p>
    //   ),
    // },

    {
      title: "Dia de Venta",
      dataIndex: "factura",
      render: (text) => (
        <p>{moment(text.fecha_venta).format("YYYY-MM-DD HH:mm:ss")}</p>
      ),
    },
  ];

  const refreshData = () => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  };

  return (
    <div
      style={{
        textAlign: "center",
        alignItems: "center",
        margin: "auto",
        width: "95%",
      }}
    >
      <p className="p">
        <b>FACTURACION </b>
      </p>

      <div>
        <p className="p">
          Aplica Filtros a la tabla por Estado de Pago, Estado de Servicio,
          Facturacion.
          <br /> Puede realizar búsquedas por{" "}
          <b>
            {" "}
            Id Pago, Nro Factura, Nombre y Apellido, Cedula, Telefono, Email o
            Día de la venta, formato de uso (YYYY-MM-DD){" "}
          </b>
        </p>
        {/* <p className="p">
          {" "}
          Puede realizar búsquedas por{" "}
          <b>
            Id Pago, Nro Factura, Nombre y Apellido, Cedula, Telefono, Email o
            Día de la venta. Hora del Servicio (YYYY-MM-DD){" "}
          </b>
        </p> */}
        <div style={{ display: "flex", margin: "1rem" }}>
          <Input.Search
            style={{
              width: "40%",
              marginLeft: "auto",
            }}
            placeholder="Buscar Ordenes"
            enterButton={<span style={{ color: "black" }}>Search</span>}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <BiRefresh
            onClick={() => refreshData()}
            size={40}
            style={{ cursor: "pointer", marginRight: "auto" }}
          />
        </div>
        <div style={{ margin: "1rem" }}>
          <p>
            <b>Fecha</b>
          </p>
          <RangePicker onChange={handleDateChange} format={"YYYY/MM/DD"} />
        </div>
      </div>

      <div
        style={{
          margin: "auto",
          width: "95%",
          padding: "1px",
        }}
      >
        {" "}
        <Table
          style={{
            margin: "auto",
            width: "100%",
            padding: "1px",
            backgroundColor: "rgb(245, 245, 235)",
          }}
          columns={columns}
          dataSource={filteredOrdenes}
          expandable={{
            expandedRowRender: (record) => (
              <ProductExpanded
                key={record._id}
                _id={record._id}
                cliente_id={record.cliente_id}
                direccion_servicio={record.direccion_servicio}
                estadoPago={record.factura?.estadoPago}
                payment_id={record.factura?.payment_id}
                estadoServicio={record?.estado_servicio}
                factura={record?.factura}
                // cliente_email={record.cliente_email}
                // cliente_nombre={record.cliente_nombre}
                // cliente_apellido={record.cliente_apellido}
                // cliente_cedula={record.cliente_cedula}
                // cliente_telefono={record.cliente_telefono}
                // profesional_email={record.profesional_email}
                // profesional_nombre={record.profesional_nombre}
                // profesional_apellido={record.profesional_apellido}
                // direccion_Servicio={record.direccion_Servicio}
                // adicional_direccion_Servicio={
                //   record.adicional_direccion_Servicio
                // }
                // estadoPago={record.estadoPago}
                // payment_id={record.payment_id}
                // localidad_Servicio={record.localidad_Servicio}
                // telefono_Servicio={record.telefono_Servicio}
                // estadoServicio={record?.estadoServicio}
                // estadoFacturacion={record?.estadoFacturacion}
                // numeroFacturacion={record?.numeroFacturacion}
                // estadoLiquidacion={record?.estadoLiquidacion}
                // numeroLiquidacion={record?.numeroLiquidacion}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default FacturacionAntDesing;
