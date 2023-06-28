import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, List, Spin, Alert, Tag, Input } from "antd";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import {
  getOrders,
  updateOrder,
  createOrder,
} from "../../../../redux/features/ordenesSlice";
import moment from "moment";
import swal from "sweetalert";
import "./Ordenesantd.css";

const ProductExpanded = ({
  _id,
  cliente_email,
  cliente_nombre,
  cliente_apellido,
  cliente_cedula,
  cliente_telefono,
  direccion_Servicio,
  adicional_direccion_Servicio,
  localidad_Servicio,
  telefono_Servicio,
  estadoServicio,
  estadoFacturacion,
  numeroFacturacion,
  estadoLiquidacion,
  numeroLiquidacion,
  profesional_email,
  profesional_nombre,
  profesional_apellido,
  editProduct,
  setEditProduct,
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    _id,
    cliente_email,
    cliente_nombre,
    cliente_apellido,
    cliente_cedula,
    cliente_telefono,
    direccion_Servicio,
    adicional_direccion_Servicio,
    localidad_Servicio,
    telefono_Servicio,
    estadoServicio,
    profesional_email,
    profesional_nombre,
    profesional_apellido,
    estadoFacturacion,
    numeroFacturacion,
    estadoLiquidacion,
    numeroLiquidacion,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const change = useSelector((state) => state.ordenes.update);
  const orders = useSelector((state) => state.ordenes.order || []);
  //separo los useEffect para que no se renderize todo junto
  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch, change]);
  // }, [orders, change]);

  useEffect(() => {
    setLoading(true); // updateinprogress
    dispatch(updateOrder(false))
      // dispatch(getOrders())

      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch, change, orders]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    // console.log("INPUT",input);
    const data = new FormData();
    Object.keys(input).forEach((key) => data.append(key, input[key]));
    dispatch(updateOrder(input));
    setEditProduct(0);
    swal("success", "ORDEN MODIFICADA", "success");
  }

  return (
    <div>
      {!(editProduct === _id) && (
        <div className="productExpandedDiv">
          <AiOutlineClose
            color="red"
            size="30px"
            style={{ display: "flex", flexDirection: "row" }}
          />
          <div
            className="NameImgDiv"
            // style={{ display: 'flex', flexDirection: 'row' }}
          >
            <p className="PDivInfo">email: {input.cliente_email}</p>
            <p className="PDivInfo">Nombre: {input.cliente_nombre}</p>
            <p className="PDivInfo">Apellido: {input.cliente_apellido}</p>
            <p className="PDivInfo">Cédula: {input.cliente_cedula}</p>
            <p className="PDivInfo">Teléfono: {input.cliente_telefono}</p>
            <p className="PDivInfo">
              Dirección de servicio: {input.direccion_Servicio}
            </p>
            <p className="PDivInfo">
              Dirección adicional de servicio:{" "}
              {input.adicional_direccion_Servicio}
            </p>
            <p className="PDivInfo">
              Localidad de servicio: {input.localidad_Servicio}
            </p>
            <p className="PDivInfo">
              Teléfono de servicio: {input.telefono_Servicio}
            </p>
            <p className="PDivInfo">
              Estado del servicio: {input.estadoServicio}
            </p>
            <p className="PDivInfo">
              Estado de facturación: {input.estadoFacturacion}
            </p>
            <p className="PDivInfo">
              Número de facturación: {input.numeroFacturacion}
            </p>
            <p className="PDivInfo">
              Estado de liquidación: {input.estadoLiquidacion}
            </p>
            <p className="PDivInfo">
              Número de liquidación: {input.numeroLiquidacion}
            </p>
          </div>
        </div>
      )}

      {editProduct === _id && (
        <div className="productExpandedDiv">
          <AiOutlineClose
            onClick={() => setEditProduct(0)}
            // color="red"
            // size="30px"
            // style={{ display: 'flex', flexDirection: 'column' }}
          />
          <div
            className="NameImgDiv"
            // style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div>
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
            </div>

            <div>
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
            </div>

            <div>
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
            </div>

            <div>
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
            </div>

            <div>
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
            </div>

            <div>
              <label className="LabelNameImg">
                <strong>Localidad de servicio</strong>
              </label>
              <input
                className="InputsEdits"
                value={input.localidad_Servicio}
                onChange={(e) => handleChange(e)}
                name="localidad_Servicio"
                placeholder="Localidad de servicio"
              ></input>
            </div>

            <div>
              <label className="LabelNameImg">
                <strong>Estado del servicio</strong>
              </label>
              <select
                className="InputsEdits"
                // defaultValue="Pendiente"
                value={input.estadoServicio}
                onChange={(e) => handleChange(e)}
                name="estadoServicio"
                placeholder="Estado del servicio"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
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

            <div>
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
            </div>

            <div>
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
            </div>
          </div>

          <div className="ButtonDiv">
            <button onClick={(e) => handleSubmit(e)} className="ButtonSubmit">
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const LiquidacionAntDesing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editProduct, setEditProduct] = useState(0);
  const change = useSelector((state) => state.ordenes.update);
  //separo los useEffect para que no se renderize todo junto
  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  useEffect(() => {
    dispatch(updateOrder(false))
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [change]);

  const orders = useSelector((state) => state.ordenes.order || []);

  //// Mapeo ordenes para agregar una key a cada fila
  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  //se filtran las ordenes para renderizado de la tabla
  //agrego fullName para q encuentre nombre compuesto y facilitar el trabajo de busqueda
  const filteredOrdenes = useMemo(() => {
    if (!newProducts || newProducts.length === 0) {
      return []; // Devuelve un array vacío si newProducts está vacío
    }

    return newProducts?.filter((orden) => {
      const fullNameProfesional =
        `${orden.profesional_nombre} ${orden.profesional_apellido}`.toLowerCase();
      const fullNameCliente =
        `${orden.cliente_nombre} ${orden.cliente_apellido}`.toLowerCase();
      const searchTextLower = searchText.toLowerCase();

      return (
        fullNameProfesional?.includes(searchTextLower) ||
        fullNameCliente?.includes(searchTextLower) ||
        orden._id?.includes(searchText) ||
        orden.cliente_cedula?.includes(searchText) ||
        orden.cliente_telefono?.includes(searchText) ||
        orden.cliente_nombre?.toLowerCase().includes(searchTextLower) ||
        orden.cliente_apellido?.toLowerCase().includes(searchTextLower) ||
        orden.cliente_email?.includes(searchText) ||
        orden.servicio?.toLowerCase().includes(searchTextLower) ||
        orden.direccion_Servicio?.toLowerCase().includes(searchTextLower) ||
        moment(orden.dia_servicio, "YYYY-MM-DD")
          .format("YYYY-MM-DD")
          .includes(searchText) ||
        moment(orden.hora_servicio, "hh:mm a")
          .format("hh:mm a")
          .includes(searchText)
      );
    });
  }, [newProducts, searchText]);

  // const filteredOrdenes = useMemo(() => {
  //   return newProducts?.filter(
  //     (orden) =>

  //     (orden.profesional_nombre?.toLowerCase().includes(searchText.toLowerCase() + " " + orden.profesional_apellido?.toLowerCase()) || orden.profesional_apellido?.toLowerCase().includes(searchText.toLowerCase())) || orden.profesional_nombre?.toLowerCase().includes(searchText.toLowerCase()) ||

  //     // orden.profesional_nombre?.toLowerCase().includes(searchText.toLowerCase()) && " " &&
  //     // orden.profesional_apellido?.toLowerCase().includes(searchText.toLowerCase()) ||

  //       orden._id?.includes(searchText) ||
  //       orden.cliente_cedula?.includes(searchText) ||
  //       orden.cliente_telefono?.includes(searchText) ||
  //       orden.cliente_nombre
  //         ?.toLowerCase()
  //         .includes(searchText.toLowerCase()) ||
  //       orden.cliente_apellido
  //         ?.toLowerCase()
  //         .includes(searchText.toLowerCase()) ||
  //       orden.cliente_email?.includes(searchText) ||
  //       orden.servicio?.toLowerCase().includes(searchText.toLowerCase()) ||
  //       orden.direccion_Servicio
  //         ?.toLowerCase()
  //         .includes(searchText.toLowerCase()) ||
  //       moment(orden.dia_servicio, "YYYY-MM-DD")
  //         .format("YYYY-MM-DD")
  //         .includes(searchText) || // Verifica si la búsqueda coincide con la fecha de la orden
  //       moment(orden.hora_servicio, "hh:mm a")
  //         .format("hh:mm a")
  //         .includes(searchText) // Verifica si la búsqueda coincide con la hora de la orden
  //   );
  // }, [newProducts, searchText]);

  const columns = [
    {
      title: "EDITAR",
      dataIndex: "",
      render: (value) => (
        <div className="ActionsDiv">
          <button
            className="ButtonsActions"
            onClick={() => setEditProduct(value._id)}
          >
            <BiEditAlt />
          </button>
        </div>
      ),
    },
    Table.EXPAND_COLUMN,
    {
      title: "estadoPago",
      dataIndex: "estadoPago",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Rejected", value: "rejected" },
        { text: "Approved", value: "approved" },
      ],
      onFilter: (value, record) => record?.estadoPago?.indexOf(value) === 0,
      render: (estadoPago) => (
        <>
          {estadoPago === "approved" ? (
            <Tag color="green">Approved</Tag>
          ) : estadoPago === "rejected" ? (
            <Tag color="red">Failure</Tag>
          ) : (
            <Tag color="yellow">Pending</Tag>
          )}
        </>
      ),
    },
    {
      title: "estadoServicio",
      dataIndex: "estadoServicio",
      filters: [
        { text: "Pendiente", value: "Pendiente" },
        { text: "Completado", value: "Completado" },
        { text: "Cancelado", value: "Cancelado" },
      ],
      onFilter: (value, record) => record?.estadoServicio?.indexOf(value) === 0,
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
      title: "estadoLiquidacion",
      dataIndex: "estadoLiquidacion",
      filters: [
        { text: "Liquidado", value: "Liquidado" },
        { text: "NoLiquidado", value: "NoLiquidado" },
        { text: "Error", value: "Error" },
      ],
      onFilter: (value, record) =>
        record?.estadoLiquidacion?.indexOf(value) === 0,
      render: (estadoLiquidacion) => (
        <>
          {estadoLiquidacion === "Liquidado" ? (
            <Tag color="green">Liquidado</Tag>
          ) : estadoLiquidacion === "Error" ? (
            <Tag color="red">Error</Tag>
          ) : (
            <Tag color="yellow">NoLiquidado</Tag>
          )}
        </>
      ),
    },
    {
      title: "Nro.Liquidacion",
      dataIndex: "numeroLiquidacion",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Orden",
      dataIndex: "_id",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Nombre Prof.",
      dataIndex: "profesional_nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Apellido Prof.",
      dataIndex: "profesional_apellido",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Nombre",
      dataIndex: "cliente_nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Apellido",
      dataIndex: "cliente_apellido",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },

    // {
    //   title: "Cedula",
    //   dataIndex: "cliente_cedula",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "Telefono",
    //   dataIndex: "cliente_telefono",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
    {
      title: "email",
      dataIndex: "cliente_email",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "SERVICIO",
      dataIndex: "servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "COTIZACION",
      dataIndex: "precio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    // {
    //   title: "Cant.",
    //   dataIndex: "cantidad",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "Direccion Servicio",
    //   dataIndex: "direccion_Servicio",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "Localidad",
    //   dataIndex: "localidad_Servicio",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
    {
      title: "CITA DIA",
      dataIndex: "dia_servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "CITA HORA",
      dataIndex: "hora_servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "FECHA VENTA",
      dataIndex: "createdAt",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD")}</p>,
    },
  ];

  return (
    // style={{ width: '100%', height: '400px', overflow: 'auto' }}
    <div
      style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}
    >
      <p className="p">LIQUIDACIONES A PERSONAL </p>
      <p className="p">
        Busqueda : Id de Orden, ó Datos de cliente, Datos Profesional, Fecha y
        Hora del Servicio (YYYY-MM-DD){" "}
      </p>
      <h1 style={{ textAlign: "center", alignItems: "center" }}>
        <Input.Search
          placeholder="Buscar Ordenes"
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: 400,
            marginBottom: "0px",
            textAlign: "center",
            alignItems: "center",
          }}
        />
      </h1>
      <p className="p">
        Puede ordenar ascendente o descendentemente con las flechas en Datos de
        la tabla
      </p>

      <div
        style={{
          margin: "0px",
          marginLeft: "0px",
          marginTop: "0px",
          padding: "0px",
          // width: '100%', height: '1000px', overflowY: "auto", overflowX: 'auto'
        }}
      >
        <Table
          style={{ backgroundColor: "rgb(245, 245, 235)" }}
          columns={columns}
          dataSource={filteredOrdenes}
          expandable={{
            expandedRowRender: (record) => (
              <ProductExpanded
                key={record._id}
                _id={record._id}
                cliente_email={record.cliente_email}
                cliente_nombre={record.cliente_nombre}
                cliente_apellido={record.cliente_apellido}
                cliente_cedula={record.cliente_cedula}
                cliente_telefono={record.cliente_telefono}
                profesional_email={record.profesional_email}
                profesional_nombre={record.profesional_nombre}
                profesional_apellido={record.profesional_apellido}
                direccion_Servicio={record.direccion_Servicio}
                adicional_direccion_Servicio={
                  record.adicional_direccion_Servicio
                }
                localidad_Servicio={record.localidad_Servicio}
                telefono_Servicio={record.telefono_Servicio}
                estadoServicio={record?.estadoServicio}
                estadoFacturacion={record?.estadoFacturacion}
                numeroFacturacion={record?.numeroFacturacion}
                estadoLiquidacion={record?.estadoLiquidacion}
                numeroLiquidacion={record?.numeroLiquidacion}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
              />
            ),
          }}
        />
      </div>

      {/* <div style={{ marginTop: "80px", padding: "20px" }}>
        <Table
          style={{ backgroundColor: "rgb(245, 245, 235)" }}
          columns={columns}
          dataSource={orders}
        />
      </div> */}
    </div>
  );
};

export default LiquidacionAntDesing;
