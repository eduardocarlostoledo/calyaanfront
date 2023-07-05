import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, List, Spin, Alert, Tag, Input, DatePicker } from "antd";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import {
  getOrders,
  updateOrder,
  createOrder,
} from "./../../../../redux/features/ordenesSlice";
import moment from "moment";
import swal from "sweetalert";
import "./Ordenesantd.css";

const { RangePicker } = DatePicker;

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
  estadoPago,
  payment_id,
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
    estadoPago,
    payment_id,
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

  // useEffect(() => {
  //   setLoading(true); // updateinprogress
  //   dispatch(updateOrder(false))
  //     // dispatch(getOrders())

  //     .then(() => setLoading(false))
  //     .catch((error) => setError(error.message));
  // }, [dispatch, change, orders]);

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
          <BiEditAlt
            onClick={() => setEditProduct(input._id)}
            style={{ cursor: "pointer" }}
            size="40px"
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
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                email: {input.cliente_email}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Nombre: {input.cliente_nombre}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Apellido: {input.cliente_apellido}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Cédula: {input.cliente_cedula}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Teléfono: {input.cliente_telefono}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Dirección de servicio: {input.direccion_Servicio}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Dirección adicional de servicio:{" "}
                {input.adicional_direccion_Servicio}
              </p>

              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Localidad de servicio: {input.localidad_Servicio}
              </p>
            </div>
            <div style={{ width: "50%" }}>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Teléfono de servicio: {input.telefono_Servicio}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado del servicio: {input.estadoServicio}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado del Pago: {input.estadoPago}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado del servicio: {input.payment_id}
              </p>

              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado de facturación: {input.estadoFacturacion}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Número de facturación: {input.numeroFacturacion}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado de liquidación: {input.estadoLiquidacion}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Número de liquidación: {input.numeroLiquidacion}
              </p>
            </div>
          </div>
        </div>
      )}

      {editProduct === _id && (
        <div className="productExpandedDiv">
          <AiOutlineClose
            onClick={() => setEditProduct(0)}
            color="red"
            size="40px"
            style={{ cursor: "pointer" }}
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
            </div>
            <div style={{ width: "50%" }}>
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
                  <strong>Estado del Pago</strong>
                </label>
                <select
                  className="InputsEdits"
                  // defaultValue="Pendiente"
                  value={input.estadoPago}
                  onChange={(e) => handleChange(e)}
                  name="estadoPago"
                  placeholder="Estado del Pago"
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </select>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>payment_id</strong>
                </label>
                <input
                  className="InputsEdits"
                  // defaultValue=""
                  value={input.payment_id}
                  onChange={(e) => handleChange(e)}
                  name="payment_id"
                  placeholder="Número de payment_id"
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
          </div>

          <div className="ButtonDiv" style={{ justifyContent: "center" }}>
            <button onClick={(e) => handleSubmit(e)} className="ButtonSubmit">
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdenesAntDesing = (props) => {
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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (dates) => {
    const dateNow = dates ? moment(dates[0].$d).format("YYYY/MM/DD") : null;
    const dateNow2 = dates ? moment(dates[1].$d).format("YYYY/MM/DD") : null;
    console.log(dates);
    dates ? setStartDate(dateNow) : setStartDate("");
    dates ? setEndDate(dateNow2) : setEndDate("");
  };

  const refreshData = () => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  };

  //se filtran las ordenes para renderizado de la tabla

  const filteredOrdenes = useMemo(() => {
    if (!newProducts || newProducts.length === 0) {
      return [];
    }

    const searchTextLower = searchText.toLowerCase();
    return newProducts.filter((orden) => {
      // orden.estadoPago orden.estadoServicio
      const fullNameProfesional =
        `${orden.profesional_nombre} ${orden.profesional_apellido}`.toLowerCase();
      const fullNameCliente =
        `${orden.cliente_nombre} ${orden.cliente_apellido}`.toLowerCase();
      const fullNameProfesionalInverso =
        `${orden.profesional_apellido} ${orden.profesional_nombre} `.toLowerCase();
      const fullNameClienteInverso =
        `${orden.cliente_apellido} ${orden.cliente_nombre}`.toLowerCase();

      const orderDate = moment(orden.createdAt, "YYYY/MM/DD");

      if (startDate && endDate) {
        return (
          (fullNameProfesional?.includes(searchTextLower) ||
            fullNameCliente?.includes(searchTextLower) ||
            fullNameProfesionalInverso?.includes(searchTextLower) ||
            fullNameClienteInverso?.includes(searchTextLower) ||
            orden.numeroFacturacion?.includes(searchTextLower) ||
            orden.payment_id?.includes(searchTextLower) ||
            orden._id?.includes(searchTextLower) ||
            orden.cliente_cedula?.includes(searchTextLower) ||
            orden.cliente_telefono?.includes(searchTextLower) ||
            orden.cliente_email?.includes(searchTextLower) ||
            orden.servicio?.toLowerCase().includes(searchTextLower) ||
            orden.direccion_Servicio
              ?.toLowerCase()
              .includes(searchTextLower)) &&
          orderDate.isBetween(startDate, endDate, null, "[]")
        );
      }

      return (
        fullNameProfesional?.includes(searchTextLower) ||
        fullNameCliente?.includes(searchTextLower) ||
        fullNameProfesionalInverso?.includes(searchTextLower) ||
        fullNameClienteInverso?.includes(searchTextLower) ||
        orden.numeroFacturacion?.includes(searchTextLower) ||
        orden.payment_id?.includes(searchTextLower) ||
        orden._id?.includes(searchTextLower) ||
        orden.cliente_cedula?.includes(searchTextLower) ||
        orden.cliente_telefono?.includes(searchTextLower) ||
        orden.cliente_email?.includes(searchTextLower) ||
        orden.servicio?.toLowerCase().includes(searchTextLower) ||
        orden.direccion_Servicio?.toLowerCase().includes(searchTextLower)
      );
    });
  }, [newProducts, searchText, startDate, endDate]);

  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: "Cliente",
      dataIndex: "cliente_nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text, record) => (
        <p>
          {record.cliente_apellido} {text}
        </p>
      ),
    },
    {
      title: "Cedula",
      dataIndex: "cliente_cedula",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Telefono",
      dataIndex: "cliente_telefono",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "email",
      dataIndex: "cliente_email",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Servicio",
      dataIndex: "servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Precio",
      dataIndex: "precio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Direccion",
      dataIndex: "localidad_Servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text, record) => (
        <p>
          {record.direccion_Servicio && record.direccion_Servicio.slice(0, 20)}{" "}
          ... <br />
          {text}
        </p>
      ),
    },
    {
      title: "Hora/Dia",
      dataIndex: "dia_servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text, record) => (
        <p>
          {record.hora_servicio} {text}
        </p>
      ),
    },
    {
      title: "Profesional",
      dataIndex: "profesional_nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text, record) => (
        <p>
          {record.profesional_apellido} {text}
        </p>
      ),
    },
    {
      title: "Telefono",
      dataIndex: "profesional_telefono",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Estado Pago",
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
      title: "Estado Servicio",
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
    //   // },
    //   // {
    //   //   title: <>Operation</>,
    //   //   key: 'operation',
    //   //   fixed: 'right',
    //   //   width: '8%',
    //   //   render: (text, record) => {
    //   //     return (
    //   //       <DropOption
    //   //         onMenuClick={e => this.handleMenuClick(record, e)}
    //   //         menuOptions={[
    //   //           { key: '1', name: t`Update` },
    //   //           { key: '2', name: t`Delete` },
    //   //         ]}
    //   //       />
    //   //     )
    //   //   },
    // },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <p className="p">ORDENES </p>
      <div>
        <p className="p">
          Aplica Filtros a la tabla por Estado de Pago, Estado de Servicio,
          Facturacion.
          <br /> Puede realizar búsquedas por{" "}
          <b>
            {" "}
            Id Pago, Nro Factura, Nombre y/o Apellido, Cedula, Telefono o Email
          </b>
        </p>
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
          margin: "0px",
          marginLeft: "0px",
          marginTop: "0px",
          padding: "0px",
        }}
      >
        <Table
          style={{ backgroundColor: "rgb(245, 245, 235)" }}
          columns={columns}
          dataSource={filteredOrdenes}
          expandable={{
            expandedRowRender: (record) => (
              <ProductExpanded
                key={record.key}
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
                estadoPago={record.estadoPago}
                payment_id={record.payment_id}
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
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
};

export default OrdenesAntDesing;

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, List, Spin, Alert, Tag, Input } from "antd";
// import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import {
//   getOrders,
//   updateOrder,
//   createOrder,
// } from "./../../../../redux/features/ordenesSlice";
// import moment from "moment";
// import swal from "sweetalert";
// import "./Ordenesantd.css";

// const ProductExpanded = ({
//   _id,
//   cliente_email,
//   cliente_nombre,
//   cliente_apellido,
//   cliente_cedula,
//   cliente_telefono,
//   direccion_Servicio,
//   adicional_direccion_Servicio,
//   localidad_Servicio,
//   telefono_Servicio,
//   estadoServicio,
//   estadoFacturacion,
//   numeroFacturacion,
//   estadoLiquidacion,
//   numeroLiquidacion,
//   profesional_email,
//   profesional_nombre,
//   profesional_apellido,
//   editProduct,
//   setEditProduct,
// }) => {
//   const dispatch = useDispatch();
//   const [input, setInput] = useState({
//     _id,
//     cliente_email,
//     cliente_nombre,
//     cliente_apellido,
//     cliente_cedula,
//     cliente_telefono,
//     direccion_Servicio,
//     adicional_direccion_Servicio,
//     localidad_Servicio,
//     telefono_Servicio,
//     estadoServicio,
//     profesional_email,
//     profesional_nombre,
//     profesional_apellido,
//     estadoFacturacion,
//     numeroFacturacion,
//     estadoLiquidacion,
//     numeroLiquidacion,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const change = useSelector((state) => state.ordenes.update);
//   const orders = useSelector((state) => state.ordenes.order || []);
//   //separo los useEffect para que no se renderize todo junto
//   useEffect(() => {
//     dispatch(getOrders())
//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [dispatch, change]);
//   // }, [orders, change]);

//   useEffect(() => {
//     setLoading(true); // updateinprogress
//     dispatch(updateOrder(false))
//       // dispatch(getOrders())

//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [dispatch, change, orders]);

//   const handleChange = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   function handleSubmit(e) {
//     e.preventDefault();
//     // console.log("INPUT",input);
//     const data = new FormData();
//     Object.keys(input).forEach((key) => data.append(key, input[key]));
//     dispatch(updateOrder(input));
//     setEditProduct(0);
//     swal("success", "ORDEN MODIFICADA", "success");
//   }

//   return (
//     <div>
//       {!(editProduct === _id) && (
//         <div className="productExpandedDiv">
//           <AiOutlineClose
//             color="red"
//             size="30px"
//             style={{ display: "flex", flexDirection: "row" }}
//           />
//           <div
//             className="NameImgDiv"
//             // style={{ display: 'flex', flexDirection: 'row' }}
//           >
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >email: {input.cliente_email}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >Nombre: {input.cliente_nombre}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >Apellido: {input.cliente_apellido}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >Cédula: {input.cliente_cedula}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >Teléfono: {input.cliente_telefono}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Dirección de servicio: {input.direccion_Servicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Dirección adicional de servicio:{" "}
// //               {input.adicional_direccion_Servicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Localidad de servicio: {input.localidad_Servicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Teléfono de servicio: {input.telefono_Servicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Estado del servicio: {input.estadoServicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Estado de facturación: {input.estadoFacturacion}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Número de facturación: {input.numeroFacturacion}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Estado de liquidación: {input.estadoLiquidacion}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Número de liquidación: {input.numeroLiquidacion}
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       {editProduct === _id && (
// //         <div className="productExpandedDiv">
// //           <AiOutlineClose
// //             onClick={() => setEditProduct(0)}
// //             // color="red"
// //             // size="30px"
// //             // style={{ display: 'flex', flexDirection: 'column' }}
// //           />
// //           <div
// //             className="NameImgDiv"
// //             // style={{ display: 'flex', flexDirection: 'column' }}
// //           >
// //             <div>
// //               <label className="LabelNameImg">
//                 <strong>Email </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_email}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_email"
//                 placeholder="Email del cliente"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Nombre </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_nombre}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_nombre"
//                 placeholder="Nombre"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Apellido </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_apellido}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_apellido"
//                 placeholder="Apellido del cliente"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Cédula </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_cedula}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_cedula"
//                 placeholder="Cédula del cliente"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Teléfono </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_telefono}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_telefono"
//                 placeholder="Teléfono del cliente"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Dirección </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.direccion_Servicio}
//                 onChange={(e) => handleChange(e)}
//                 name="direccion_Servicio"
//                 placeholder="Dirección de servicio"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Datos Adicionales</strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.adicional_direccion_Servicio}
//                 onChange={(e) => handleChange(e)}
//                 name="adicional_direccion_Servicio"
//                 placeholder="Dirección adicional de servicio"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Localidad de servicio</strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.localidad_Servicio}
//                 onChange={(e) => handleChange(e)}
//                 name="localidad_Servicio"
//                 placeholder="Localidad de servicio"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Estado del servicio</strong>
//               </label>
//               <select
//                 className="InputsEdits"
//                 // defaultValue="Pendiente"
//                 value={input.estadoServicio}
//                 onChange={(e) => handleChange(e)}
//                 name="estadoServicio"
//                 placeholder="Estado del servicio"
//               >
//                 <option value="Pendiente">Pendiente</option>
//                 <option value="Completado">Completado</option>
//                 <option value="Cancelado">Cancelado</option>
//               </select>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Facturación</strong>
//               </label>
//               <select
//                 className="InputsEdits"
//                 // defaultValue="NoFacturado"
//                 value={input.estadoFacturacion}
//                 onChange={(e) => handleChange(e)}
//                 name="estadoFacturacion"
//                 placeholder="Estado de facturación"
//               >
//                 <option value="Facturado">Facturado</option>
//                 <option value="NoFacturado">No facturado</option>
//                 <option value="Error">Error</option>
//               </select>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>NºFactura</strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 // defaultValue=""
//                 value={input.numeroFacturacion}
//                 onChange={(e) => handleChange(e)}
//                 name="numeroFacturacion"
//                 placeholder="Número de facturación"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Liquidación</strong>
//               </label>
//               <select
//                 className="InputsEdits"
//                 // defaultValue="NoLiquidado"
//                 value={input.estadoLiquidacion}
//                 onChange={(e) => handleChange(e)}
//                 name="estadoLiquidacion"
//                 placeholder="Estado de liquidación"
//               >
//                 <option value="Liquidado">Liquidado</option>
//                 <option value="NoLiquidado">No liquidado</option>
//                 <option value="Error">Error</option>
//               </select>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>NºLiquidación</strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 // defaultValue=""
//                 value={input.numeroLiquidacion}
//                 onChange={(e) => handleChange(e)}
//                 name="numeroLiquidacion"
//                 placeholder="Número de liquidación"
//               ></input>
//             </div>
//           </div>

//           <div className="ButtonDiv">
//             <button onClick={(e) => handleSubmit(e)} className="ButtonSubmit">
//               Enviar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const OrdenesAntDesing = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [editProduct, setEditProduct] = useState(0);
//   const change = useSelector((state) => state.ordenes.update);
//   //separo los useEffect para que no se renderize todo junto
//   useEffect(() => {
//     dispatch(getOrders())
//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(updateOrder(false))
//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [change]);

//   const orders = useSelector((state) => state.ordenes.order || []);

//   //// Mapeo ordenes para agregar una key a cada fila
//   const newProducts = orders?.map((product) => ({
//     ...product,
//     key: product._id,
//   }));

//   //se filtran las ordenes para renderizado de la tabla
//   const filteredOrdenes = useMemo(() => {
//     if (!newProducts || newProducts.length === 0) {
//       return [];
//     }

//     const searchTextLower = searchText.toLowerCase();

//     return newProducts.filter((orden) => {

//       const fullNameProfesional = `${orden.profesional_nombre} ${orden.profesional_apellido}`.toLowerCase();
//       const fullNameCliente = `${orden.cliente_nombre} ${orden.cliente_apellido}`.toLowerCase();
//       const fullNameProfesionalInverso = `${orden.profesional_apellido} ${orden.profesional_nombre} `.toLowerCase();
//       const fullNameClienteInverso = `${orden.cliente_apellido} ${orden.cliente_nombre}`.toLowerCase();

//       return (
//         fullNameProfesional.includes(searchTextLower) ||
//         fullNameCliente.includes(searchTextLower) ||
//         fullNameProfesionalInverso.includes(searchTextLower) ||
//         fullNameClienteInverso.includes(searchTextLower) ||
//         orden.numeroFacturacion?.includes(searchTextLower) ||
//         orden.payment_id?.includes(searchTextLower) ||
//         orden._id.includes(searchTextLower) ||
//         orden.cliente_cedula.includes(searchTextLower) ||
//         orden.cliente_telefono.includes(searchTextLower) ||
//         orden.cliente_email.includes(searchTextLower) ||
//         orden.servicio.toLowerCase().includes(searchTextLower) ||
//         orden.direccion_Servicio.toLowerCase().includes(searchTextLower) ||
//         moment(orden.dia_servicio, "YYYY-MM-DD")
//           .format("YYYY-MM-DD")
//           .includes(searchText) || // Verifica si la búsqueda coincide con la fecha de la orden
//         moment(orden.hora_servicio, "hh:mm-hh:mm")
//           .format("hh:mm a")
//           .includes(searchText) // Verifica si la búsqueda coincide con la hora de la orden
//     );
//   });

//   }, [newProducts, searchText]);

//   const columns = [

//     {
//       title: "Cliente",
//       dataIndex: "cliente_nombre",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text, record) => <p>{record.cliente_apellido} {text}</p>,
//     },
//     {
//       title: "Cedula",
//       dataIndex: "cliente_cedula",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Telefono",
//       dataIndex: "cliente_telefono",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "email",
//       dataIndex: "cliente_email",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Servicio",
//       dataIndex: "servicio",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Precio",
//       dataIndex: "precio",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Direccion",
//       dataIndex: "localidad_Servicio",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text, record) => <p>{record.direccion_Servicio} {text}</p>,
//     },
//     {
//       title: "Hora/Dia",
//       dataIndex: "dia_servicio",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text, record) => <p>{record.hora_servicio} {text}</p>,
//     },
//     {
//       title: "Profesional",
//       dataIndex: "profesional_nombre",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text, record) => <p>{record.profesional_apellido} {text}</p>,
//     },
//     {
//       title: "Telefono",
//       dataIndex: "profesional_telefono",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Estado Pago",
//       dataIndex: "estadoPago",
//       filters: [
//         { text: "Pending", value: "pending" },
//         { text: "Rejected", value: "rejected" },
//         { text: "Approved", value: "approved" },
//       ],
//       onFilter: (value, record) => record?.estadoPago?.indexOf(value) === 0,
//       render: (estadoPago) => (
//         <>
//           {estadoPago === "approved" ? (
//             <Tag color="green">Approved</Tag>
//           ) : estadoPago === "rejected" ? (
//             <Tag color="red">Failure</Tag>
//           ) : (
//             <Tag color="yellow">Pending</Tag>
//           )}
//         </>
//       ),
//     },
//     {
//       title: "Estado Servicio",
//       dataIndex: "estadoServicio",
//       filters: [
//         { text: "Pendiente", value: "Pendiente" },
//         { text: "Completado", value: "Completado" },
//         { text: "Cancelado", value: "Cancelado" },
//       ],
//       onFilter: (value, record) => record?.estadoServicio?.indexOf(value) === 0,
//       render: (estadoServicio) => (
//         <>
//           {estadoServicio === "Completado" ? (
//             <Tag color="green">Completado</Tag>
//           ) : estadoServicio === "Cancelado" ? (
//             <Tag color="red">Cancelado</Tag>
//           ) : (
//             <Tag color="yellow">Pendiente</Tag>
//           )}
//         </>
//       ),
//     },
//     // {
//     //   title: "payment_id",
//     //   dataIndex: "payment_id",
//     //   render: (text) => <p>{text}</p>,
//     // },
//     // {
//     //   title: "payment_type",
//     //   dataIndex: "payment_type",
//     //   render: (text) => <p>{text}</p>,
//     // },
//     // {
//     //   title: "merchant_order_id",
//     //   dataIndex: "merchant_order_id",
//     //   render: (text) => <p>{text}</p>,
//     // },
//     {
//       title: "EDITAR",
//       dataIndex: "",
//       render: (value) => (
//         <div className="ActionsDiv">
//           <button
//             className="ButtonsActions"
//             onClick={() => setEditProduct(value._id)}
//           >
//             <BiEditAlt />
//           </button>
//         </div>
//       ),
//     },
//     Table.EXPAND_COLUMN,
//   ];

//   return (
//     // style={{ width: '100%', height: '400px', overflow: 'auto' }}
//     <div
//       style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}
//     >
//       <p className="p">ORDENES </p>
//       <p className="p">
//         Busqueda : Id de Orden, ó Datos de cliente, Datos Profesional, Fecha y
//         Hora del Servicio (YYYY-MM-DD){" "}
//       </p>
//       <h1 style={{ textAlign: "center", alignItems: "center" }}>
//         <Input.Search
//           placeholder="Buscar Ordenes"
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{
//             width: 400,
//             marginBottom: "0px",
//             textAlign: "center",
//             alignItems: "center",
//           }}
//         />
//       </h1>
//       <p className="p">
//         Puede ordenar ascendente o descendentemente con las flechas en Datos de
//         la tabla
//       </p>

//       <div
//         style={{
//           margin: "0px",
//           marginLeft: "0px",
//           marginTop: "0px",
//           padding: "0px",
//           // width: '100%', height: '1000px', overflowY: "auto", overflowX: 'auto'
//         }}
//       >
//         <Table
//           style={{ backgroundColor: "rgb(245, 245, 235)" }}
//           columns={columns}
//           dataSource={filteredOrdenes}
//           expandable={{
//             expandedRowRender: (record) => (
//               <ProductExpanded
//                 key={record._id}
//                 _id={record._id}
//                 cliente_email={record.cliente_email}
//                 cliente_nombre={record.cliente_nombre}
//                 cliente_apellido={record.cliente_apellido}
//                 cliente_cedula={record.cliente_cedula}
//                 cliente_telefono={record.cliente_telefono}
//                 profesional_email={record.profesional_email}
//                 profesional_nombre={record.profesional_nombre}
//                 profesional_apellido={record.profesional_apellido}
//                 direccion_Servicio={record.direccion_Servicio}
//                 adicional_direccion_Servicio={
//                   record.adicional_direccion_Servicio
//                 }
//                 localidad_Servicio={record.localidad_Servicio}
//                 telefono_Servicio={record.telefono_Servicio}
//                 estadoServicio={record?.estadoServicio}
//                 estadoFacturacion={record?.estadoFacturacion}
//                 numeroFacturacion={record?.numeroFacturacion}
//                 estadoLiquidacion={record?.estadoLiquidacion}
//                 numeroLiquidacion={record?.numeroLiquidacion}
//                 editProduct={editProduct}
//                 setEditProduct={setEditProduct}
//               />
//             ),
//           }}
//         />
//       </div>

//       {/* <div style={{ marginTop: "80px", padding: "20px" }}>
//         <Table
//           style={{ backgroundColor: "rgb(245, 245, 235)" }}
//           columns={columns}
//           dataSource={orders}
//         />
//       </div> */}
//     </div>
//   );
// };

// export default OrdenesAntDesing;
