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

const FacturacionAntDesing = () => {
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
    if (!newProducts || newProducts.length === 0) {
      return [];
    }

    const searchTextLower = searchText.toLowerCase();

    return newProducts.filter((orden) => {

      const fullNameProfesional = `${orden.profesional_nombre} ${orden.profesional_apellido}`.toLowerCase();
      const fullNameCliente = `${orden.cliente_nombre} ${orden.cliente_apellido}`.toLowerCase();
      const fullNameProfesionalInverso = `${orden.profesional_apellido} ${orden.profesional_nombre} `.toLowerCase();
      const fullNameClienteInverso = `${orden.cliente_apellido} ${orden.cliente_nombre}`.toLowerCase();

      return (
        fullNameProfesional.includes(searchTextLower) ||
        fullNameCliente.includes(searchTextLower) ||
        fullNameProfesionalInverso.includes(searchTextLower) ||
        fullNameClienteInverso.includes(searchTextLower) ||
        orden.numeroFacturacion?.includes(searchTextLower) ||
        orden.payment_id?.includes(searchTextLower) ||
        orden._id.includes(searchTextLower) ||
        orden.cliente_cedula.includes(searchTextLower) ||
        orden.cliente_telefono.includes(searchTextLower) ||
        orden.cliente_email.includes(searchTextLower) ||
        orden.servicio.toLowerCase().includes(searchTextLower) ||
        orden.direccion_Servicio.toLowerCase().includes(searchTextLower) ||
        moment(orden.createdAt, "YYYY-MM-DD").format("YYYY-MM-DD").includes(searchTextLower)
      );
    });
  }, [newProducts, searchText]);


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
      title: "Id Pago",
      dataIndex: "payment_id",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
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
    {
      title: "Facturacion",
      dataIndex: "estadoFacturacion",
      filters: [
        { text: "Facturado", value: "Facturado" },
        { text: "NoFacturado", value: "NoFacturado" },
        { text: "Error", value: "Error" },
      ],
      onFilter: (value, record) =>
        record?.estadoFacturacion?.indexOf(value) === 0,
      render: (estadoFacturacion) => (
        <>
          {estadoFacturacion === "Facturado" ? (
            <Tag color="green">Facturado</Tag>
          ) : estadoFacturacion === "Error" ? (
            <Tag color="red">Error</Tag>
          ) : (
            <Tag color="yellow">NoFacturado</Tag>
          )}
        </>
      ),
    },
    {
      title: "Nro.Factura",
      dataIndex: "numeroFacturacion",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },

    {
      title: "Cliente",
      dataIndex: "cliente_nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text, record) => <p>{record.cliente_apellido} {text}</p>,
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
      render: (text, record) => <p>{record.direccion_Servicio} {text}</p>,
    },
    {
      title: "DiaVenta",
      dataIndex: "createdAt",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD")}</p>,
    },
    {
      title: "Profesional",
      dataIndex: "profesional_nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text, record) => <p>{record.profesional_apellido} {text}</p>,
    },
  ];

  return (
    <div
      style={{ textAlign: "center", alignItems: "center" }}
    >
      <p className="p">FACTURACION </p>

      <h1>
        <p className="p">              Puede realizar búsquedas por Id Pago, Nro Factura, Nombre y Apellido, Cedula, Telefono, Email o Día de la venta.        Hora del Servicio (YYYY-MM-DD){" "}


        </p>

        <Input.Search
          style={{ textAlign: "center", alignItems: "center" }}
          placeholder="Buscar Ordenes"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </h1>

      <div
        style={{
          margin: "1px",
          marginLeft: "1px",
          marginTop: "1px",
          padding: "1px",
        }}
      > <p className="p">
          Aplica Filtros a la tabla por Estado de Pago, Estado de Servicio, Facturacion. Puede realizar búsquedas por Id Pago, Nro Factura, Nombre y Apellido, Cedula, Telefono, Email o Día de la venta, formato de uso (YYYY-MM-DD){" "}
        </p>
        <Table
          style={{
            margin: "1px",
            marginLeft: "1px",
            marginTop: "1px",
            padding: "1px",
            backgroundColor: "rgb(245, 245, 235)"
          }}
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
    </div>
  );
};

export default FacturacionAntDesing;
