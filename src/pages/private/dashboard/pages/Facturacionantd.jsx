import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Input, Button, Modal, DatePicker } from "antd";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { getOrders } from "../../../../redux/features/ordenesSlice";
import moment from "moment";
import swal from "sweetalert";
import "./Ordenesantd.css";
import clienteAxios from "../../../../config/axios";

const { RangePicker } = DatePicker;

const ProductExpanded = ({
  _id,
  cliente_id,
  localidad_servicio,
  hora_servicio,
  factura,
  editProduct,
  setEditProduct,
  record,
  profesional,
  servicios,
  direccion_Servicio,
  estadoServicio,
  estadoPago,
  payment_id,
  siigoToken,
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    hora_servicio: hora_servicio,
    localidad_servicio: localidad_servicio,
    estadoPago: factura.estadoPago,
    estado_facturacion: factura.estado_facturacion,
    origen: factura.origen,
    nro_factura: factura.nro_factura,
    payment_id: factura.payment_id,
    _id: factura._id,
  });
  // const [inputSiigo, setInputSiigo] = useState({
  //   customer: {
  //     identification: cliente_id?.cedula,
  //     branch_office: "0",
  //   },
  //   date: date.now(),
  //   items: [
  //     servicios.map((serv) => ({
  //       code: "Sku-1",
  //       description: "Sku-1",
  //       quantity: 1,
  //       taxes: [
  //         {
  //           id: 13156,
  //         },
  //         {
  //           id: 21479,
  //         },
  //       ],
  //       price: 847.45,
  //     })),
  //   ],

  // payments: [
  //   {
  //     id: 5638,
  //     value: 1000,
  //     due_date: "2022-05-08",
  //   },
  // ],

  //   // cliente_nombre: cliente_id?.nombre,
  //   // cliente_apellido: cliente_id?.apellido,
  //   // cliente_telefono: cliente_id?.telefono,

  //   // profesional_nombre: profesional?.nombre,
  //   // profesional_apellido: profesional?.apellido,
  //   // profesional_telefono: profesional?.telefono,
  //   // profesional_cedula: profesional?.cedula,

  //   // factura_estado_pago: factura?.estadoPago,
  //   // factura_origen: factura?.origen,
  //   // factura_fecha_venta: factura?.fecha_venta,
  //   // factura_precio_neto: factura?.precioTotal,
  //   // factura_precio_total: factura?.precioNeto,
  // });
  console.log(record, "record");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const objTest = {
    document: {
      id: 24446,
    },
    date: "2023-09-29",
    customer: {
      identification: "209048401",
      branch_office: "0",
    },
    seller: 629,
    items: [
      {
        code: "Sku-1",
        description: "Sku-1",
        quantity: 1,
        taxes: [
          {
            id: 13156,
          },
          {
            id: 21479,
          },
        ],
        price: 847.45,
      },
    ],
    payments: [
      {
        id: 5638,
        value: 1000,
        due_date: "2022-05-08",
      },
    ],
  };

  const SendSiigo = async () => {
    try {
      const { data } = await clienteAxios.post(
        `http://127.0.0.1:3001/api/siigo/invoice`,
        objTest,
        {
          headers: {
            Authorization: `Bearer ${siigoToken}`,
            "Content-Type": "application/json",
            "Partner-Id": "calyaanapp",
          },
        }
      );
      setInput({
        ...input,
        nro_factura: data.number,
        estado_facturacion: "approved",
      });
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const change = useSelector((state) => state.ordenes.update);
  let orders = useSelector((state) => state.ordenes.order || []);
  if (!Array.isArray(orders)) {
    orders = [];
  }
  //separo los useEffect para que no se renderize todo junto

  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [loading]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    setLoading(false);
    e.preventDefault();

    const data = new FormData();
    Object.keys(input).forEach((key) => data.append(key, input[key]));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/api/facturas/updateinvoice`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );
      setLoading(true);
      swal("success", "ORDEN MODIFICADA", "success");
    } catch (error) {
      console.log(error);
      alert("Unexpected error");
    }
    setEditProduct(0);
  }

  const handleEditModalOpen = () => {
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
  };

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
                <b>Localidad:</b> {input.localidad_servicio || " Sin localidad"}
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
                <b>Hora de servicio:</b> {input.hora_servicio}
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
                <b> Estado pago:</b> {input.estadoPago}
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
                <b>Origen del pago:</b> {input?.origen}
              </p>
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
                {input?.estado_facturacion}
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
                {input?.nro_factura || " Sin numero"}
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
                <b>N°Pago:</b>{" "}
                {input?.payment_id === null ? input?.payment_id : " Sin numero"}
              </p>
            </div>
            <Button key="save" type="primary" onClick={handleEditModalOpen}>
              Open modal
            </Button>

            <Modal
              title="Facturacion siigo"
              visible={editModalVisible}
              onCancel={handleEditModalClose}
              width={"50rem"}
              footer={[
                <Button key="cancel" onClick={handleEditModalClose}>
                  Cancelar
                </Button>,
                <Button key="save" type="primary" onClick={SendSiigo}>
                  Enviar
                </Button>,
              ]}
            >
              <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>
              <div
                style={{
                  gap: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "1.2rem" }}>Cliente</p>
                <p>
                  Nombre y apellido:{" "}
                  <b style={{ textDecorationLine: "underline" }}>
                    {cliente_id.apellido} {cliente_id.nombre}
                  </b>
                </p>
                <p>
                  Email:<b> {cliente_id.email}</b> Telefono:{" "}
                  <b style={{ textDecorationLine: "underline" }}>
                    {cliente_id.telefono}
                  </b>
                </p>
                <p>
                  Cedula:
                  <b style={{ textDecorationLine: "underline" }}>
                    {cliente_id.cedula}
                  </b>
                </p>
              </div>
              <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>
              <div
                style={{
                  gap: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "1.2rem" }}>Profesional</p>
                <p>
                  Nombre y apellido:{" "}
                  <b style={{ textDecorationLine: "underline" }}>
                    {profesional.apellido} {profesional.nombre}
                  </b>
                </p>
                <p>
                  Email:<b> {profesional.email}</b> Telefono:{" "}
                  <b style={{ textDecorationLine: "underline" }}>
                    {profesional.telefono}
                  </b>
                </p>
                <p>
                  Cedula:
                  <b style={{ textDecorationLine: "underline" }}>
                    {profesional.cedula}
                  </b>
                </p>
              </div>
              <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>
              <div
                style={{
                  gap: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "1.2rem" }}>Factura</p>{" "}
                <p>
                  Estado de pago:{" "}
                  {factura?.estadoPago === "approved" ? (
                    <Tag color="green">Aprobado</Tag>
                  ) : factura?.estadoPago === "rejected" ? (
                    <Tag color="red">Rechazado</Tag>
                  ) : (
                    <Tag color="yellow">Pendiente</Tag>
                  )}
                </p>
                <p>Origen de pago: {factura.origen}</p>
                {/* <p>Fecha de venta: {factura.fecha_venta?.toLocaleDateString()}</p> */}
                <p>
                  Fecha de venta:{" "}
                  {new Date(factura.fecha_venta).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>Precio neto: ${factura.precioNeto}</p>
                <p>Porcentaje caalyan: ${factura.precioTotal}</p>
              </div>
              <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>
              <div
                style={{
                  gap: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "1.2rem" }}>Servicios</p>{" "}
                {servicios.map((serv) => (
                  <>
                    <p>Servicio: {serv.nombre}</p>
                    <p>Precio: ${serv.precio}</p>
                  </>
                ))}
              </div>
            </Modal>
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
              <div>
                <label className="LabelNameImg">
                  <strong>Origen del Pago</strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.origen}
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
                  value={input.estado_facturacion}
                  onChange={(e) => handleChange(e)}
                  name="estado_facturacion"
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
                  value={input.nro_factura}
                  onChange={(e) => handleChange(e)}
                  name="nro_factura"
                  placeholder="Número de facturación"
                ></input>
              </div>
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

  const [siigoToken, setSiigoToken] = useState("");

  const handleDateChange = (dates) => {
    const dateNow = dates ? moment(dates[0].$d).format("YYYY/MM/DD") : null;
    const dateNow2 = dates ? moment(dates[1].$d).format("YYYY/MM/DD") : null;

    dates ? setStartDate(dateNow) : setStartDate("");
    dates ? setEndDate(dateNow2) : setEndDate("");
  };
  //separo los useEffect para que no se renderize todo junto
  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  const obj = {
    username: "siigoapi@pruebas.com",
    access_key:
      "OWE1OGNkY2QtZGY4ZC00Nzg1LThlZGYtNmExMzUzMmE4Yzc1Omt2YS4yJTUyQEU=",
  };

  const LoginSiigo = async () => {
    try {
      const { data } = await clienteAxios.post(
        `http://127.0.0.1:3001/api/siigo/auth`,
        obj,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSiigoToken(data.access_token);
      console.log(data);
      console.log(siigoToken, "token");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    LoginSiigo();
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getOrders())
  //     .then(() => setLoading(false))
  //     .catch((error) => setError(error.message));
  // }, [dispatch, change]);
  // }, [orders, change]);

  // useEffect(() => {
  //   dispatch(updateOrder(false))
  //     .then(() => setLoading(false))
  //     .catch((error) => setError(error.message));
  // }, [change]);

  let orders = useSelector((state) => state.ordenes.order || []);

  if (!Array.isArray(orders)) {
    orders = [];
  }
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
      const { profesional_id } = orden;
      if (!profesional_id) {
        return;
      }

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
            orden.cliente_id?.cedula.includes(searchTextLower) ||
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

  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: "Cliente",
      dataIndex: "cliente_id",
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
      title: "Facturacion",
      dataIndex: "factura.estado_facturacion",
      filters: [
        { text: "Facturado", value: "Facturado" },
        { text: "No Facturado", value: "NoFacturado" },
        { text: "Error", value: "Error" },
      ],
      onFilter: (value, record) =>
        record?.factura?.estado_facturacion === value,
      render: (value, record) => (
        <>
          {record?.factura?.estado_facturacion === "Facturado" ? (
            <Tag style={{ margin: "auto" }} color="green">
              Facturado
            </Tag>
          ) : record?.factura?.estado_facturacion === "Error" ? (
            <Tag style={{ margin: "auto" }} color="red">
              Error
            </Tag>
          ) : (
            <Tag style={{ margin: "auto" }} color="yellow">
              No Facturado
            </Tag>
          )}
          {record?.factura?.payment_id && (
            <div style={{ marginTop: ".5rem" }}>
              <b>id del pago: </b>
              <p>{record?.factura?.payment_id}</p>
              <hr></hr>
            </div>
          )}

          {record?.factura?.origen && (
            <div style={{ marginTop: ".5rem" }}>
              <b>Origen del pago: </b>
              <p>{record?.factura?.origen}</p>
              <hr></hr>
            </div>
          )}

          {record?.factura?.nro_factura && (
            <div style={{ marginTop: ".5rem" }}>
              <hr />
              <b>Nro de factura: </b>
              {record?.factura?.nro_factura}
              <hr></hr>
            </div>
          )}
          {record?.factura?.precioTotal && (
            <div style={{ marginTop: ".5rem" }}>
              <b>Precio: </b>
              {record.factura?.precioTotal}
              <hr></hr>
            </div>
          )}
          {record?.createdAt && (
            <div style={{ marginTop: ".5rem" }}>
              <b>Dia de venta: </b>
              {moment(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              <hr></hr>
            </div>
          )}
        </>
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
      title: "Servicio",
      dataIndex: "servicios",
      render: (text, record) =>
        text ? (
          <div>
            {record?._id && (
              <p>
                <b>Id de orden </b> <br />
                {record?._id}
                <br />
                <hr></hr>
              </p>
            )}
            <b>Servicio: {text[0]?.nombre}</b>

            {record?.direccion_servicio && (
              <p>
                <hr></hr>
                <b>Direccion</b> <br />
                {record?.direccion_servicio.slice(0, 20)} ... <br />
              </p>
            )}
            {record?.localidad_servicio && (
              <p>
                <hr></hr>
                <b>Localidad</b> <br />
                {record?.localidad_servicio} <br />
              </p>
            )}
          </div>
        ) : (
          <div>
            <b>Sin servicio</b>
          </div>
        ),
    },
    {
      title: "Estado Pago",
      dataIndex: "factura.estadoPago",
      filters: [
        { text: "Pendiente", value: "pending" },
        { text: "Rechazado", value: "rejected" },
        { text: "Aprobado", value: "approved" },
      ],
      onFilter: (value, record) => record?.factura?.estadoPago === value,
      render: (value, record) => (
        <>
          {record?.factura?.estadoPago === "approved" ? (
            <Tag color="green">Aprobado</Tag>
          ) : record?.factura?.estadoPago === "rejected" ? (
            <Tag color="red">Rechazado</Tag>
          ) : (
            <Tag color="yellow">Pendiente</Tag>
          )}
        </>
      ),
    },
    // {
    //   title: "Estado Pago",
    //   dataIndex: "factura.estadoPago",
    //   filters: [
    //     { text: "Pendiente", value: "pending" },
    //     { text: "Rechazado", value: "rejected" },
    //     { text: "Aprobado", value: "approved" },
    //   ],
    //   onFilter: (value, record) => record?.factura?.estadoPago === value,
    //   render: ({ estadoPago }) => (
    //     <>
    //       {estadoPago === "approved" ? (
    //         <Tag color="green">Aprobado</Tag>
    //       ) : estadoPago === "rejected" ? (
    //         <Tag color="red">Rechazado</Tag>
    //       ) : (
    //         <Tag color="yellow">Pendiente</Tag>
    //       )}
    //     </>
    //   ),
    // },
    // {
    //   title: "Pago",
    //   dataIndex: "factura",
    //   render: ({ payment_id, origen }) => (
    //     <div>
    //       <b>id del pago: </b>
    //       <p>{payment_id}</p>
    //       <hr></hr>
    //       <b>Origen del pago: </b>
    //       <p>{origen}</p>
    //       <hr></hr>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Origen del pago",
    //   dataIndex: "factura",
    //   render: (text) => <p>{text.origen}</p>,
    // },
    {
      title: "Estado Servicio",
      dataIndex: "estado_servicio",
      filters: [
        { text: "Pendiente", value: "Pendiente" },
        { text: "Completado", value: "Completado" },
        { text: "Cancelado", value: "Cancelado" },
      ],
      onFilter: (value, record) => record?.estado_servicio === value,
      render: (estado_servicio) => (
        <>
          {estado_servicio === "Completado" ? (
            <Tag color="green">Completado</Tag>
          ) : estado_servicio === "Cancelado" ? (
            <Tag color="red">Cancelado</Tag>
          ) : (
            <Tag color="yellow">Pendiente</Tag>
          )}
        </>
      ),
    },

    // {
    //   title: "Nro. Factura",
    //   dataIndex: "factura",
    //   render: (text) => <p>{text.nro_factura}</p>,
    // },

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

    // {
    //   title: "Precio",
    //   dataIndex: "factura",
    //   sorter: (a, b) => a.precio - b.precio,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text.precioTotal}</p>,
    // },
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

    // {
    //   title: "Dia de Venta",
    //   dataIndex: "factura",
    //   render: (text) => (
    //     <p>{moment(text.fecha_venta).format("YYYY-MM-DD HH:mm:ss")}</p>
    //   ),
    // },
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
                profesional={record.profesional_id}
                direccion_servicio={record.direccion_servicio}
                estadoPago={record.factura?.estadoPago}
                payment_id={record.factura?.payment_id}
                estadoServicio={record?.estado_servicio}
                servicios={record?.servicios}
                record={record}
                factura={record?.factura}
                hora_servicio={record.hora_servicio}
                localidad_servicio={record.localidad_servicio}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
                siigoToken={siigoToken}
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default FacturacionAntDesing;
