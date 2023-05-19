import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, List, Spin, Alert, Tag, Input } from "antd";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";

import {
  getOrders,
  updateOrder,
  createOrder,
} from "./../../../../redux/features/ordenesSlice";
import moment from "moment";
//import swal from "sweetalert";

const ProductExpanded = ({
  _id,
  cliente_email,
  cliente_nombre,
  cliente_apellido,
  cliente_cedula,
  cliente_telefono,
  profesional_email,
  profesional_nombre,
  profesional_apellido,
  direccion_Servicio,
  adicional_direccion_Servicio,
  localidad_Servicio,
  telefono_Servicio,
  estadoServicio,
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
    profesional_email,
    profesional_nombre,
    profesional_apellido,
    direccion_Servicio,
    adicional_direccion_Servicio,
    localidad_Servicio,
    telefono_Servicio,
    estadoServicio,
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
  }, [orders, change]);

  useEffect(() => {    
    dispatch(updateOrder(false))
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [change]);

  

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log("INPUT",input);
    const data = new FormData();
    Object.keys(input).forEach((key) => data.append(key, input[key]));
    dispatch(updateOrder(input));
    setEditProduct(0);
    // swal("success", "Orden modified successfully", "success");
  }

  return (
    <div>
      {!(editProduct === _id) && (
        <div className="productExpandedDiv">
          <div className="DataDivInfo">
            <h3>Nombre: {input.cliente_nombre}</h3>
            <div className="BrandTypeDivInfo">
              <p className="PDivInfo">
                Email del cliente: {input.cliente_email}
              </p>
              <p className="PDivInfo">
                Apellido del cliente: {input.cliente_apellido}
              </p>
              <p className="PDivInfo">
                Cédula del cliente: {input.cliente_cedula}
              </p>
              <p className="PDivInfo">
                Teléfono del cliente: {input.cliente_telefono}
              </p>
              <p className="PDivInfo">
                Email del profesional: {input.profesional_email}
              </p>
              <p className="PDivInfo">
                Nombre del profesional: {input.profesional_nombre}
              </p>
              <p className="PDivInfo">
                Apellido del profesional: {input.profesional_apellido}
              </p>
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
            </div>
          </div>
        </div>
      )}

      {editProduct === _id && (
        <div className="productExpandedDiv">
          <AiOutlineClose
            onClick={() => setEditProduct(0)}
            color="red"
            size="30px"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
            }}
          />
          <div className="NameImgDiv">
            <div>
              <label className="LabelNameImg">
                <strong>Nombre</strong>
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
                <strong>Email del cliente</strong>
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
                <strong>Apellido del cliente</strong>
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
                <strong>Cédula del cliente</strong>
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
                <strong>Teléfono del cliente</strong>
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
                <strong>Email del profesional</strong>
              </label>
              <input
                className="InputsEdits"
                value={input.profesional_email}
                onChange={(e) => handleChange(e)}
                name="profesional_email"
                placeholder="Email del profesional"
              ></input>
            </div>

            <div>
              <label className="LabelNameImg">
                <strong>Nombre del profesional</strong>
              </label>
              <input
                className="InputsEdits"
                value={input.profesional_nombre}
                onChange={(e) => handleChange(e)}
                name="profesional_nombre"
                placeholder="Nombre del profesional"
              ></input>
            </div>

            <div>
              <label className="LabelNameImg">
                <strong>Apellido del profesional</strong>
              </label>
              <input
                className="InputsEdits"
                value={input.profesional_apellido}
                onChange={(e) => handleChange(e)}
                name="profesional_apellido"
                placeholder="Apellido del profesional"
              ></input>
            </div>

            <div>
              <label className="LabelNameImg">
                <strong>Dirección de servicio</strong>
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
                <strong>Dirección adicional de servicio</strong>
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
                <strong>Teléfono de servicio</strong>
              </label>
              <input
                className="InputsEdits"
                value={input.telefono_Servicio}
                onChange={(e) => handleChange(e)}
                name="telefono_Servicio"
                placeholder="Teléfono de servicio"
              ></input>
            </div>

            <div>
              <label className="LabelNameImg">
                <strong>Estado del servicio</strong>
              </label>
              <select
                className="InputsEdits"
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

const OrdenesAntDesing = () => {
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
  const filteredOrdenes = useMemo(() => {
    return newProducts?.filter(
      (orden) =>
        
        orden._id?.includes(searchText) ||
        orden.cliente_cedula?.includes(searchText) ||
        orden.cliente_telefono?.includes(searchText) ||
        orden.cliente_nombre
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        orden.cliente_apellido
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        orden.cliente_email?.includes(searchText) ||
        orden.servicio?.toLowerCase().includes(searchText.toLowerCase()) ||
        orden.direccion_Servicio
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        moment(orden.dia_servicio, "YYYY-MM-DD")
          .format("YYYY-MM-DD")
          .includes(searchText) || // Verifica si la búsqueda coincide con la fecha de la orden
        moment(orden.hora_servicio, "hh:mm a")
          .format("hh:mm a")
          .includes(searchText) // Verifica si la búsqueda coincide con la hora de la orden
    );
  }, [newProducts, searchText]);

  const columns = [
    {
      title: "Orden",
      dataIndex: "_id",
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
    {
      title: "Nombre",
      dataIndex: "cliente_nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
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
      title: "Cant.",
      dataIndex: "cantidad",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Direccion Servicio",
      dataIndex: "direccion_Servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Localidad",
      dataIndex: "localidad_Servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Dia",
      dataIndex: "dia_servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Hora",
      dataIndex: "hora_servicio",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Profesional",
      dataIndex: "profesional_nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Telefono",
      dataIndex: "profesional_telefono",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
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
      onFilter: (value, record) => record?.estadoServicio.indexOf(value) === 0,
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
    //   title: "payment_id",
    //   dataIndex: "payment_id",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "payment_type",
    //   dataIndex: "payment_type",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "merchant_order_id",
    //   dataIndex: "merchant_order_id",
    //   render: (text) => <p>{text}</p>,
    // },
    {
      title: "actions",
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
  ];

  return (
    <div style={{ textAlign: "center", alignItems: "center" }}>
      <p className="p">Busqueda : Id de Orden, ó Datos de cliente, Datos Profesional, Fecha y Hora del Servicio (YYYY-MM-DD)  </p>
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

export default OrdenesAntDesing;
