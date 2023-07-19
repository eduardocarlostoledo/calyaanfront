import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  List,
  Spin,
  Alert,
  Tag,
  Input,
  Button,
  Modal,
  Select,
  DatePicker,
} from "antd";
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
import { createLiquidacion } from "../../../../redux/features/liquidacionesSlice";
import { verificacionProfesional } from "../../../../helpers/Logic/VerificacionProfesionalLiquidacion";

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
          <BiEditAlt
            className="ButtonsActions"
            onClick={() => setEditProduct(input._id)}
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
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                email: {input.cliente_id?.email}
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
                Nombre: {input.cliente_id?.nombre}
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
                Apellido: {input.cliente_id?.apellido}
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
                Cédula: {input.cliente_id?.cedula}
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
                Teléfono: {input.cliente_id?.telefono}
              </p>
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Dirección de servicio: <br /> {input.direccion_Servicio}
              </p> */}

              {/* <p
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
              </p> */}
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
                Localidad de servicio: {input.localidad_Servicio}
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
                Estado del servicio: {input.estado_servicio}
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
                Estado de facturación: {input.factura?.estado_facturacion}
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
                Número de facturación: {input.factura?.nroFacturacion}
              </p>
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado de liquidación: {input.estadoLiquidacion}
              </p> */}
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
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
            size={40}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
                  value={input.adicional_direccion_Servicio}
                  onChange={(e) => handleChange(e)}
                  name="adicional_direccion_Servicio"
                  placeholder="Dirección adicional de servicio"
                ></input>
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <div>
                <label className="LabelNameImg">
                  <strong>Localidad de servicio</strong>
                </label>
                <input
                  className="InputsEdits"
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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
                  // style={{ backgroundColor: "#dadada" }}
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

const { Option } = Select;

const LiquidacionAntDesing = () => {
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEstadoLiquidacion, setSelectedEstadoLiquidacion] =
    useState("");
  const [selectedRowsTotal, setSelectedRowsTotal] = useState(0);
  const [selectedRowsPorcProfesional, setSelectedRowsPorcProfesional] =
    useState(0);
  const [selectedRowsPorcCaalyan, setSelectedRowsPorcCaalyan] = useState(0);
  const [selectedProfesional, setSelectedProfesional] = useState(null);
  const [nroLiquidacion, setNroLiquidacion] = useState("");

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
    // console.log(dates);
    dates ? setStartDate(dateNow) : setStartDate("");
    dates ? setEndDate(dateNow2) : setEndDate("");
  };

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

  useEffect(() => {
    if (!selectedRows[0]) {
      setSelectedProfesional(null);
    } else {
      const total = selectedRows.reduce(
        (acc, row) => acc + row.factura.precioTotal,
        0
      );
      setSelectedRowsPorcProfesional(total * 0.61);
      setSelectedRowsPorcCaalyan(total * 0.39);
      setSelectedRowsTotal(total);
    }
  }, [selectedRows]);

  const orders = useSelector((state) => state.ordenes.order || []);

  const handleEditModalOpen = () => {
    if (
      !startDate ||
      !endDate ||
      !selectedRowsTotal ||
      !selectedRowsPorcProfesional ||
      !selectedRowsPorcCaalyan ||
      !selectedProfesional ||
      !selectedRows
    ) {
      if (!startDate) {
        return swal("error", "Falta fecha Inicio", "error");
      }
      if (!endDate) {
        return swal("error", "Falta fecha Fin", "error");
      }
      if (
        !selectedRowsTotal ||
        !selectedRowsPorcProfesional ||
        !selectedRowsPorcCaalyan ||
        !selectedProfesional ||
        !selectedRows
      ) {
        return swal("error", "Ocurrio un error inesperado", "error");
      }
    } else {
      setEditModalVisible(true);
    }
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setSelectedEstadoLiquidacion("");
  };

  const handleEstadoLiquidacionChange = (value) => {
    // console.log("handleEstadoLiquidacionChange", value);
    setSelectedEstadoLiquidacion(value);
  };

  const handleEstadoLiquidacionSave = () => {
    if (!selectedEstadoLiquidacion) {
      return swal("error", "Falta fecha Inicio", "error");
    }
    if (!nroLiquidacion) {
      return swal("error", "Falta fecha Fin", "error");
    }
    dispatch(
      createLiquidacion({
        estadoLiquidacion: selectedEstadoLiquidacion,
        numeroLiquidacion: nroLiquidacion,
        fechaInicio: startDate,
        fechaFin: endDate,
        totalLiquidacion: selectedRowsTotal,
        porcentajeProfesional: selectedRowsPorcProfesional,
        porcentajeCaalyan: selectedRowsPorcCaalyan,
        profesional: selectedProfesional,
        ordenes: selectedRows,
      })
    );

    // updateOrder()
    handleEditModalClose();
    setSelectedRows([]);
    setSelectedEstadoLiquidacion(null); // Limpiar el estado del modal después de guardar
  };

  const handleRowSelect = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRows, selectedRowKeys);
    if (!selectedProfesional) {
      setSelectedProfesional(selectedRows[0].profesional_id);
      // console.log(selectedRows[0].profesional_id, "seteado");
    }
    if (!selectedRows) {
      setSelectedProfesional(null);
    }
    if (selectedProfesional) {
      let resultado = verificacionProfesional(
        selectedRows,
        selectedProfesional
      );

      if (!resultado) {
        setSelectedRows([]);
        return swal("error", "El profesional no coincide", "error");
      }
      if (resultado) {
        setSelectedRows(selectedRows);
      }
    }
  };

  const rowSelection = {
    onChange: handleRowSelect,
  };

  //// Mapeo ordenes para agregar una key a cada fila
  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  //se filtran las ordenes para renderizado de la tabla
  //agrego fullName para q encuentre nombre compuesto y facilitar el trabajo de busqueda

  const filteredOrdenes = useMemo(() => {
    if (!newProducts || newProducts.length === 0) {
      return [];
    }

    const searchTextLower = searchText.toLowerCase();
    return newProducts.filter((orden) => {
      const { profesional_id } = orden;
      if (
        !profesional_id ||
        !orden.factura?.estadoPago?.includes("approved") ||
        orden?.factura?.estado_facturacion !== "Facturado" ||
        !orden?.estado_servicio?.includes("Completado") ||
        !(Boolean(orden.liquidacion) === false)
      ) {
        return;
      }

      // console.log(orden, "orden filtrada");
      // orden.estadoPago orden.estadoServicio
      const fullNameProfesional =
        `${orden.profesional_id?.nombre} ${orden.profesional_id?.apellido}`.toLowerCase();
      // const fullNameCliente =
      //   `${orden.cliente_id.nombre} ${orden.cliente_id.apellido}`.toLowerCase();
      const fullNameProfesionalInverso =
        `${orden.profesional_id?.apellido} ${orden.profesional_id?.nombre} `.toLowerCase();
      // const fullNameClienteInverso =
      //   `${orden.cliente_id.apellido} ${orden.cliente_id.nombre}`.toLowerCase();

      const orderDate = moment(orden.createdAt, "YYYY/MM/DD");

      if (startDate && endDate) {
        return (
          (fullNameProfesional?.includes(searchTextLower) ||
            // fullNameCliente?.includes(searchTextLower) ||
            fullNameProfesionalInverso?.includes(searchTextLower) ||
            // fullNameClienteInverso?.includes(searchTextLower) ||
            orden.factura?.nro_factura?.includes(searchTextLower) ||
            orden.factura?.payment_id?.includes(searchTextLower) ||
            orden._id?.includes(searchTextLower) ||
            orden.cliente_id?.cedula.includes(searchTextLower) ||
            orden.cliente_id?.telefono?.includes(searchTextLower) ||
            orden.cliente_id?.email?.includes(searchTextLower) ||
            orden.servicio?.toLowerCase().includes(searchTextLower) ||
            orden.direccion_Servicio
              ?.toLowerCase()
              .includes(searchTextLower)) &&
          orderDate.isBetween(startDate, endDate, null, "[]")
        );
      }

      return (
        fullNameProfesional?.includes(searchTextLower) ||
        // fullNameCliente?.includes(searchTextLower) ||
        fullNameProfesionalInverso?.includes(searchTextLower) ||
        // fullNameClienteInverso?.includes(searchTextLower) ||
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
    // Table.EXPAND_COLUMN,
    {
      title: "Profesional",
      dataIndex: "profesional_id",
      render: (text) =>
        text ? (
          <div>
            <div>
              <b>Nombre y apellido</b>
              <p>
                {text?.apellido} {text?.nombre}
              </p>
            </div>
            <hr />
            <div>
              <b>Cedula</b>
              <p>{text?.cedula}</p>
            </div>
            <hr />
            <div>
              <b>Telefono</b>
              <p>{text?.telefono}</p>
            </div>
            <hr />
            <div>
              <b>Email</b>
              <p>{text?.email}</p>
            </div>
          </div>
        ) : (
          <div>
            <b>Profesional no seleccionado</b>
          </div>
        ),
    },
    {
      title: "Cliente",
      dataIndex: "cliente_id",
      render: (text) => (
        <div>
          <div>
            <b>Nombre y apellido</b>
            <p>
              {text?.apellido} {text?.nombre}
            </p>
          </div>
          <hr />
          <div>
            <b>Cedula</b>
            <p>{text?.cedula}</p>
          </div>
          <hr />
          <div>
            <b>Telefono</b>
            <p>{text?.telefono}</p>
          </div>
          <hr />
          <div>
            <b>Email</b>
            <p>{text?.email}</p>
          </div>
        </div>
      ),
    },
    // {
    //   title: "estadoPago",
    //   dataIndex: "estadoPago",
    //   filters: [
    //     { text: "Pending", value: "pending" },
    //     { text: "Rejected", value: "rejected" },
    //     { text: "Approved", value: "approved" },
    //   ],
    //   onFilter: (value, record) => record?.estadoPago?.indexOf(value) === 0,
    //   render: (estadoPago) => (
    //     <>
    //       {estadoPago === "approved" ? (
    //         <Tag color="green">Approved</Tag>
    //       ) : estadoPago === "rejected" ? (
    //         <Tag color="red">Failure</Tag>
    //       ) : (
    //         <Tag color="yellow">Pending</Tag>
    //       )}
    //     </>
    //   ),
    // },
    // {
    //   title: "estadoServicio",
    //   dataIndex: "estadoServicio",
    //   filters: [
    //     { text: "Pendiente", value: "Pendiente" },
    //     { text: "Completado", value: "Completado" },
    //     { text: "Cancelado", value: "Cancelado" },
    //   ],
    //   onFilter: (value, record) => record?.estadoServicio?.indexOf(value) === 0,
    //   render: (estadoServicio) => (
    //     <>
    //       {estadoServicio === "Completado" ? (
    //         <Tag color="green">Completado</Tag>
    //       ) : estadoServicio === "Cancelado" ? (
    //         <Tag color="red">Cancelado</Tag>
    //       ) : (
    //         <Tag color="yellow">Pendiente</Tag>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Servicio",
      dataIndex: "servicios",
      // sorter: (a, b) => a.id - b.id,
      // defaultSortOrder: "descend",
      // onFilter: (value, record) =>
      //   record.factura.estadoPago.includes("approved"),

      render: (text, record) =>
        text[0] ? (
          text?.map((t) => (
            <div>
              <b>{t.nombre}</b>

              <p>
                <hr></hr>
                <b>Direccion</b> <br />
                {record.direccion_servicio &&
                  record.direccion_servicio.slice(0, 20)}{" "}
                ... <br />
              </p>
            </div>
          ))
        ) : (
          <div>
            <b>Sin servicio</b>
          </div>
        ),
    },
    {
      title: "Fecha",
      dataIndex: "cita_servicio",
      // sorter: (a, b) => a.id - b.id,
      // defaultSortOrder: "descend",
      // onFilter: (value, record) =>
      //   record.factura.estado_facturacion.includes("Facturado"),
      //   onFilter: (value, record) =>
      //   record.estado_servicio.includes("Completado"),

      render: (text, record) =>
        text ? (
          <p>
            {text}
            <hr />
            {record.hora_servicio} <b>hs</b>
          </p>
        ) : (
          <b>Sin horario</b>
        ),
    },
    // {
    //   title: "estadoLiquidacion",
    //   dataIndex: "factura",
    //   filters: [
    //     { text: "Liquidado", value: "Liquidado" },
    //     { text: "NoLiquidado", value: "NoLiquidado" },
    //     { text: "Error", value: "Error" },
    //   ],
    //   onFilter: (value, record) =>
    //     record?.estadoLiquidacion?.indexOf(value) === 0,
    //   render: (estadoLiquidacion) => (
    //     <>
    //       {estadoLiquidacion === "Liquidado" ? (
    //         <Tag color="green">Liquidado</Tag>
    //       ) : estadoLiquidacion === "Error" ? (
    //         <Tag color="red">Error</Tag>
    //       ) : (
    //         <Tag color="yellow">NoLiquidado</Tag>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Nro. Factura",
      dataIndex: "factura",

      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => (
        <p>{text?.nro_factura ? text?.nro_factura : <b>Sin numero</b>}</p>
      ),
    },
    // {
    //   title: "Profesional",
    //   dataIndex: "profesional_nombre",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text, record) => (
    //     <p>
    //       {record.profesional_apellido} {text}
    //     </p>
    //   ),
    // },

    // {
    //   title: "Cliente",
    //   dataIndex: "cliente_nombre",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text, record) => (
    //     <p>
    //       {record.cliente_apellido} {text}
    //     </p>
    //   ),
    // },
    // {
    //   title: "SERVICIO",
    //   dataIndex: "servicio",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
    {
      title: "COTIZACION",
      dataIndex: "factura",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text?.precioTotal}</p>,
    },
    // {
    //   title: "CITA DIA",
    //   dataIndex: "dia_servicio",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "CITA HORA",
    //   dataIndex: "hora_servicio",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
  ];

  return (
    <div style={{ textAlign: "center", alignItems: "center" }}>
      <p className="p">
        <b>LIQUIDACIONES A PERSONAL</b>
      </p>
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

      {/* {selectedRows.length > 0 && (
        <Button onClick={handleEditModalOpen}>
          Editar Filas Seleccionadas
        </Button>
      )} */}

      {selectedRows.length > 0 && (
        <div style={{ margin: "2rem", gap: "1rem" }}>
          <p>
            Total de filas seleccionadas: <b>{selectedRows.length}</b>
          </p>
          <p>
            Sumatoria de precios: <b>{selectedRowsTotal}</b>
          </p>
          <p>
            61% de la sumatoria: <b>{selectedRowsPorcProfesional}</b>
          </p>
          <p>
            39% de la sumatoria: <b>{selectedRowsPorcCaalyan}</b>
          </p>
          <Button onClick={handleEditModalOpen} style={{ margin: ".5rem" }}>
            Editar Filas Seleccionadas
          </Button>
        </div>
      )}

      {/* <p className="p">
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
      </p> */}

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
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <ProductExpanded
          //       key={record._id}
          //       _id={record._id}
          //       cliente_email={record.cliente_email}
          //       cliente_nombre={record.cliente_nombre}
          //       cliente_apellido={record.cliente_apellido}
          //       cliente_cedula={record.cliente_cedula}
          //       cliente_telefono={record.cliente_telefono}
          //       profesional_email={record.profesional_email}
          //       profesional_nombre={record.profesional_nombre}
          //       profesional_apellido={record.profesional_apellido}
          //       direccion_Servicio={record.direccion_Servicio}
          //       adicional_direccion_Servicio={
          //         record.adicional_direccion_Servicio
          //       }
          //       localidad_Servicio={record.localidad_Servicio}
          //       telefono_Servicio={record.telefono_Servicio}
          //       estadoServicio={record?.estadoServicio}
          //       estadoFacturacion={record?.estadoFacturacion}
          //       numeroFacturacion={record?.numeroFacturacion}
          //       estadoLiquidacion={record?.estadoLiquidacion}
          //       numeroLiquidacion={record?.numeroLiquidacion}
          //       editProduct={editProduct}
          //       setEditProduct={setEditProduct}
          //     />
          //   ),
          // }}
          rowSelection={rowSelection}
        />

        <Modal
          title="Editar Filas Seleccionadas"
          visible={editModalVisible}
          onCancel={handleEditModalClose}
          width={"50rem"}
          footer={[
            <Button key="cancel" onClick={handleEditModalClose}>
              Cancelar
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleEstadoLiquidacionSave}
            >
              Guardar
            </Button>,
          ]}
        >
          <div
            style={{
              // gap: "1rem",
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <span>Estado de liquidacion</span>
            <Select
              placeholder="Seleccione el estado de liquidación"
              value={selectedEstadoLiquidacion}
              onChange={handleEstadoLiquidacionChange}
              style={{ width: "100%" }}
            >
              <Option value="Liquidado">Liquidado</Option>
              <Option value="NoLiquidado">No Liquidado</Option>
              <Option value="Error">Error</Option>
            </Select>
          </div>
          <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>
          <div
            style={{
              gap: "1rem",
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <span>Numero de liquidacion</span>
            <input
              style={{
                height: "2rem",
                margin: "auto",
                width: "70%",
                padding: "1rem",
                borderRadius: ".2rem",
              }}
              placeholder="Numero de liquidacion"
              value={nroLiquidacion}
              onChange={(e) => setNroLiquidacion(e.target.value)}
            ></input>
          </div>
          <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>
          <div
            style={{
              gap: "1rem",
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <p>
              Fecha inicial de la liquidacion: <b>{startDate}</b>
            </p>
            <p>
              Fecha final de la liquidacion: <b>{endDate}</b>
            </p>
          </div>
          <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>
          <div
            style={{
              gap: "1rem",
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <p>
              Profesional:
              <br />{" "}
              <b>
                {" "}
                {selectedProfesional?.nombre} {selectedProfesional?.apellido}
              </b>
            </p>
            <p>
              cedula del profesional:
              <br /> <b>{selectedProfesional?.cedula}</b>
            </p>
            <p>
              email del profesional: <br /> <b>{selectedProfesional?.email}</b>
            </p>
          </div>
          <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>
          <div style={{ gap: "1rem", width: "100%", display: "flex" }}>
            <p>
              Total de filas seleccionadas: <b>{selectedRows.length}</b>
            </p>
            <p>
              Sumatoria de precios: <b>{selectedRowsTotal}</b>
            </p>
            <p>
              61% de la sumatoria: <b>{selectedRowsPorcProfesional}</b>
            </p>
            <p>
              39% de la sumatoria: <b>{selectedRowsPorcCaalyan}</b>
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LiquidacionAntDesing;
