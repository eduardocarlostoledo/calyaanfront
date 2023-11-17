import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Input, Button, Modal, DatePicker, Select } from "antd";
import {
  AiFillSetting,
  AiOutlineClose,
  AiFillCheckCircle,
  AiFillExclamationCircle,
} from "react-icons/ai";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { getOrders } from "../../../../redux/features/ordenesSlice";
import moment from "moment";
import swal from "sweetalert";
import "./Ordenesantd.css";
import clienteAxios from "../../../../config/axios";
import axios from "axios";
import { getAccessToken } from "../../../../helpers/Components/siigoAccessToken";
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "../../../../helpers/Components/PDFFile";
import { toast } from "react-toastify";

const { RangePicker } = DatePicker;

const { Option } = Select;

const ProductExpanded = ({
  _id,
  cliente_id,
  localidad_servicio,
  hora_servicio,
  factura,
  editProduct,
  setEditProduct,
  record, //aca viene todo el objeto de la orden
  profesional,
  servicios,
  direccion_Servicio,
  estadoServicio,
  estadoPago,
  payment_id,
  siigoToken,
  productsID,
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
  const fechaInputSiigo = new Date().toISOString().slice(0, 10);
  const [inputSiigo, setInputSiigo] = useState({
    document: {
      id: 24446,
    },
    date: fechaInputSiigo,
    customer: {
      identification: cliente_id?.cedula?.toString() || null,
      branch_office: "0",
    },
    seller: 629,
    items: [],
    // stamp:{
    //   send:true
    // },
    // mail:{
    //   send:true
    // },
    observations: "observaciones",

    payments: [
      {
        id: 5638,
        value: Math.ceil(factura?.precioTotal),
        due_date: fechaInputSiigo,
      },
    ],
  });
  // console.log(record, "record");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");

  const [siigoResponse, setSiigoResponse] = useState("");

  // const dataFake = {
  //   balance: 0,
  //   customer: {
  //     id: "45022857-9154-4b0c-bdd4-f38f4bff3096",
  //     identification: "123",
  //     branch_office: 0,
  //   },
  //   date: "2023-10-13",
  //   document: { id: 24446 },
  //   id: "0b7cc95a-27bd-4e06-b100-d3f49045f39b",
  //   items: [
  //     {
  //       code: "13901",
  //       description: "Masaje reductor paquete x 4",
  //       id: "fa2a48be-f849-47b6-9686-968945f1b271",
  //       price: 137500,
  //       quantity: 1,
  //       total: 137500,
  //     },
  //   ],
  //   mail: {
  //     status: "not_sent",
  //     observations: "The invoice has not been sent by mail",
  //   },
  //   metadata: { created: "2023-10-13T20:58:33.377Z" },
  //   name: "FV-1-60000000506",
  //   number: 60000000506,
  //   payments: [{ id: 5638, name: "Consignación", value: 137500 }],
  //   prefix: "HA",
  //   seller: 629,
  //   stamp: { status: "Draft" },
  //   total: 137500,
  // };

  const [userCheck, setUserCheck] = useState("wait");
  const [productCheck, setProductCheck] = useState("wait");
  const [siigoButtonVisible, setSiigoButtonVisible] = useState(true);

  const DocTypePeticion = async () => {
    const response = await clienteAxios.get(
      `${import.meta.env.VITE_APP_BACK}/api/siigo/document-type?type=FV`,
      {
        headers: {
          Authorization: `Bearer ${siigoToken}`,
          "Content-Type": "application/json",
          "Partner-Id": "calyaanapp",
        },
      }
    );
    console.log("Document type", response);
    return response;
  };

  const usersSiigoPeticion = async () => {
    const page = { page: "1", pageSize: "10" };
    const response = await clienteAxios.get(
      `${import.meta.env.VITE_APP_BACK}/api/siigo/users`,
      page,
      {
        headers: {
          Authorization: `Bearer ${siigoToken}`,
          "Content-Type": "application/json",
          "Partner-Id": "calyaanapp",
        },
      }
    );
    console.log("USERS DE SIIGO", response);
    return response;
  };

  const getCustomerPeticion = async () => {
    const response = await clienteAxios.get(
      `${import.meta.env.VITE_APP_BACK}/api/siigo/get-customer/`,
      {
        headers: {
          Authorization: `Bearer ${siigoToken}`,
          "Content-Type": "application/json",
          "Partner-Id": "calyaanapp",
        },
      }
    );
    console.log("CUSTOMER RESPONSE", response);
    return response;
  };

  const ProductNamePeticion = async () => {
    const response = await clienteAxios.get(
      `${import.meta.env.VITE_APP_BACK}/api/products/name/${
        servicios[0].nombre
      }`
    );

    console.log(response, "ProductNamePeticion");

    if (response.data === null) {
      return error;
    }

    const responseSiigoCheck = await clienteAxios.post(
      `${import.meta.env.VITE_APP_BACK}/api/siigo/product-code`,
      { code: response.data.idWP },
      {
        headers: {
          Authorization: `Bearer ${siigoToken}`,
          "Content-Type": "application/json",
          "Partner-Id": "calyaanapp",
        },
      }
    );

    console.log(responseSiigoCheck, "response siigo");

    if (responseSiigoCheck.data.pagination.total_results >= 1) {
      setProductCheck("Registered");
      setInputSiigo({
        ...inputSiigo,
        items: [
          {
            code: responseSiigoCheck.data.results[0].code,
            description:
              responseSiigoCheck.data.results[0].description ||
              responseSiigoCheck.data.results[0].name,
            quantity: 1,
            price: Math.ceil(factura?.precioTotal),
          },
        ],
      });
      return console.log("producto creado", inputSiigo);
    }
    setProductCheck("NoRegistered");
    const createProductSiigo = await clienteAxios.post(
      `${import.meta.env.VITE_APP_BACK}/api/siigo/create-product`,
      {
        code: response.data.idWP,
        name: response.data.nombre,
        account_group: 1253,
        description: response.data.nombre,
      },
      {
        headers: {
          Authorization: `Bearer ${siigoToken}`,
          "Content-Type": "application/json",
          "Partner-Id": "calyaanapp",
        },
      }
    );

    console.log(createProductSiigo, "create product siigo");
    setProductCheck("Registered");
    return setInputSiigo({
      ...inputSiigo,
      items: [
        {
          code: createProductSiigo.data.code,
          name: createProductSiigo.data.result[0].name,
          description:
            createProductSiigo.data.description || createProductSiigo.data.name,
          quantity: 1,
          price: Math.ceil(factura?.precioTotal),
        },
      ],
    });
  };

  const objCedula = {
    identification: cliente_id.cedula,
  };

  const SiigoCheckUser = async () => {
    try {
      const response = await clienteAxios.post(
        `/api/siigo/get-customer-identification/`,
        objCedula,
        {
          headers: {
            Authorization: `Bearer ${siigoToken}`,
            "Content-Type": "application/json",
            "Partner-Id": "calyaanapp",
          },
        }
      );
      console.log(response);
      if (response.data.results <= 0) {
        setUserCheck("NoRegistered");

        const response = await clienteAxios.post(
          `/api/siigo/create-customer/`,
          {
            person_type: "Person",
            id_type: "13",
            identification: cliente_id.cedula.toString(),
            name: [cliente_id.nombre, cliente_id.apellido],
            address: {
              address: cliente_id.direccionDefault.direccion,
              city: {
                country_code: "Co",
                state_code: "11",
                city_code: "11001",
              },
            },
            phones: [
              {
                number: cliente_id.telefono,
              },
            ],
            contacts: [
              {
                first_name: cliente_id.nombre,
                last_name: cliente_id.apellido,
                email: cliente_id.email,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${siigoToken}`,
              "Content-Type": "application/json",
              "Partner-Id": "calyaanapp",
            },
          }
        );
        console.log(response, "creado el customer");
        return setUserCheck("Registered");
      }
      console.log("ya estaba creado");
      return setUserCheck("Registered");
    } catch (error) {
      console.error("Error en SiigoCheckUser:", error);
      throw error;
    }
  };
//vamos a mandar la factura a siigo para su creacion, a su vez en esta funcion actualizamos el estado de la factura en la app
  const SendSiigo = async () => {
    try {
      swal({
        title: "Cargando...",
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      // productIDPeticion();
      const response = await clienteAxios.post(
        `${import.meta.env.VITE_APP_BACK}/api/siigo/invoice`,
        inputSiigo,
        {
          headers: {
            Authorization: `Bearer ${siigoToken}`,
            "Content-Type": "application/json",
            "Partner-Id": "calyaanapp",
          },
        }
      );
      //console.log("respuesta de SendSIIgo",response);

       setInput({
        ...input,
        nro_factura: response.data.name,
        estado_facturacion: "Facturado",
      });      

      setSiigoResponse(response.data);
      setLoading(true);

      //peticion para actualizar la factura en la app
      const responseEdit = await clienteAxios.put(
        `${import.meta.env.VITE_APP_BACK}/api/facturas/updateinvoice`, 
        {
          _id:input._id,
          nro_factura: response.data.name,
          estado_facturacion: "Facturado",
        },
        {          
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },          
        }
      );
      setLoading(false)
     // console.log("RESPUESTA DE PUT INVOICE", responseEdit);

      if (
        (response.status === 200 || response.status === 201) &&
        (responseEdit.status === 200 || responseEdit.status === 201)
      ) {
        toast.success("Factura creada con exito");
        setSiigoButtonVisible(false);

      } else {
        // Hubo un error en la operación
        swal("Error", "Hubo un error en la operación.", "error");
      }
    } catch (error) {
      console.log("Error:", error.message);
      swal("Error", "Hubo un error en la operación.", "error");
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

  const handleSubmit = async (e) => {
    setLoading(false);
    if (e) {
      e.preventDefault();
    }

    const data = new FormData();
    Object.keys(input).forEach((key) => data.append(key, input[key]));
    try {
      const response = await clienteAxios.put(
        `${import.meta.env.VITE_APP_BACK}/api/facturas/updateinvoice`, input,
        {          
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },          
        }
      );
      setLoading(true);
      // swal("success", "ORDEN MODIFICADA", "success");
      return response;
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

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
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
                {input?.payment_id !== null ? input?.payment_id : " Sin numero"}
              </p>
            </div>
            <Button
              key="save"
              type="primary"
              style={{
                color: "#000",
              }}
              onClick={handleEditModalOpen}
            >
              {siigoResponse ? "PDF siigo" : "Facturación siigo"}
            </Button>

            <Modal
              title="Facturación siigo"
              open={editModalVisible}
              onCancel={handleEditModalClose}
              width={"50rem"}
              footer={[
                <Button key="cancel" onClick={handleEditModalClose}>
                  Cancelar
                </Button>,
                siigoButtonVisible ? (<Button id="sendSiigoButton" key="save" type="primary" onClick={SendSiigo}>
                  Enviar
                </Button>) : (
                <Button id="sendSiigoButtonClose" key="save" type="primary" onClick={handleEditModalClose}>
                Cerrar
              </Button>)
              ]}
            >
              <hr style={{ marginBottom: "1rem", marginTop: "1rem" }}></hr>

              {siigoResponse ? (
                <div style={{ width: "100%", minHeight: "80vh" }}>
                  <PDFViewer style={{ width: "100%", minHeight: "80vh" }}>
                    <MyDocument siigoResponse={siigoResponse} Orden={input} record={record}/>
                  </PDFViewer>
                </div>
              ) : (
                <>
                  {" "}
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
                        {cliente_id?.apellido} {cliente_id?.nombre}
                      </b>
                    </p>
                    <p>
                      Email:<b> {cliente_id?.email}</b> Telefono:{" "}
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
                    {userCheck === "wait" ? (
                      <div>
                        <div
                          style={{
                            border: "4px solid rgba(255, 255, 255, 0.3)",
                            borderRadius: "50%",
                            borderTop: "4px solid #007bff", // Cambia el color según tus preferencias
                            width: "40px",
                            height: "40px",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto",
                          }}
                        ></div>
                        <p>
                          {" "}
                          Verificando si el usuario esta registrado en siigo
                        </p>
                      </div>
                    ) : userCheck === "Registered" ? (
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
                        <AiFillCheckCircle size={50} color="green" />
                        <p>El usuario esta registrado en siigo</p>
                      </div>
                    ) : userCheck === "NoRegistered" ? (
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
                        <AiFillExclamationCircle size={50} color="yellow" />
                        <p>Es necesario registrar el usuario en siigo</p>
                      </div>
                    ) : (
                      "Algo salio mal con la comunicacion con siigo api"
                    )}
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
                        {profesional?.apellido} {profesional.nombre}
                      </b>
                    </p>
                    <p>
                      Email:<b> {profesional.email}</b> Telefono:{" "}
                      <b style={{ textDecorationLine: "underline" }}>
                        {profesional?.telefono}
                      </b>
                    </p>
                    <p>
                      Cedula:
                      <b style={{ textDecorationLine: "underline" }}>
                        {profesional?.cedula}
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
                      {new Date(factura.fecha_venta).toLocaleDateString(
                        "es-AR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
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
                    <div
                      style={{
                        gap: "1rem",
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    ></div>
                    <p style={{ fontSize: "1.2rem" }}>Servicio Contratado</p>{" "}
                    {servicios.map((serv) => (
                      <>
                        <p>Servicio: {serv.nombre} </p>
                        <p>Precio del Paquete: ${serv.precio}</p>
                      </>
                    ))} <p>Etapa del paquete: </p>{" "} {record.nroSesion} 
                    {productCheck === "wait" ? (
                      <div>
                        <div
                          style={{
                            border: "4px solid rgba(255, 255, 255, 0.3)",
                            borderRadius: "50%",
                            borderTop: "4px solid #007bff", // Cambia el color según tus preferencias
                            width: "40px",
                            height: "40px",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto",
                          }}
                        ></div>
                        <p>
                          {" "}
                          Verificando si el producto esta registrado en siigo
                        </p>
                      </div>
                    ) : productCheck === "Registered" ? (
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
                        <AiFillCheckCircle size={50} color="green" />
                        <p>El producto esta registrado en siigo</p>
                      </div>
                    ) : productCheck === "NoRegistered" ? (
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
                        <AiFillExclamationCircle size={50} color="yellow" />
                        <p>Es necesario registrar el Producto en siigo</p>
                      </div>
                    ) : (
                      "Algo salio mal con la comunicacion con siigo api"
                    )}
                  </div>
                </>
              )}
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

  const [selectedRows, setSelectedRows] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEstadoFacturacion, setSelectedEstadoFacturacion] =
    useState("");
  
  const [nroFacturacion, setNroFacturacion] = useState("");


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editProduct, setEditProduct] = useState(0);
  const change = useSelector((state) => state.ordenes.update);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [siigoToken, setSiigoToken] = useState("");
  const [productsID, setProductsID] = useState([]);
  

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
 
// Función para obtener y actualizar las órdenes después de la solicitud al invoice
const obtenerYActualizarOrdenes = async () => {
  try {
  dispatch(getOrders());
  } catch (error) {
    console.error("Error al obtener y actualizar las órdenes:", error);
  }
};
useEffect(() => {
  obtenerYActualizarOrdenes();
}, [dispatch]);

  const LoginSiigo = async () => {
    try {    
      setSiigoToken(getAccessToken());    
    } catch (error) {
      console.log(error.message);
    }
  };

  const productIDPeticion = async () => {
    const response = await clienteAxios.get(
      `${import.meta.env.VITE_APP_BACK}/api/siigo/products`,
      {
        headers: {
          Authorization: `Bearer ${siigoToken}`,
          "Content-Type": "application/json",
          "Partner-Id": "calyaanapp",
        },
      }
    );
    // console.log("Document type", response);
    setProductsID(response.data.results);
  };
  useEffect(() => {
    productIDPeticion();
  }, [dispatch]);

  useEffect(() => {
    LoginSiigo();
  }, [dispatch]);

  let orders = useSelector((state) => state.ordenes.order || []);

  if (!Array.isArray(orders)) {
    orders = [];
  }

  const handleEditModalOpen = () => {
    if (!selectedRows.length) {
      return swal("error", "Debes seleccionar alguna factura", "error");
    } else {
      setEditModalVisible(true);
    }
  };
  
  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setSelectedEstadoFacturacion("");
    setSelectedRows([]); // Limpiar las filas seleccionadas al cerrar el modal
  };

  const handleEstadoFacturacionChange = (value) => {
    setSelectedEstadoFacturacion(value);
  };

  const handleEstadoFacturacionSave = async () => {
    if (!selectedEstadoFacturacion) {
      return swal("error", "Agrega estado Facturacion dentro del Select", "error");
    }
    if (!nroFacturacion) {
      return swal("error", "Agrega el número de la Factura en el cuadro de texto abajo", "error");
    }
  
    // Iterar sobre cada orden y enviar una solicitud por cada una
    for (const order of selectedRows) {
      try {
        const response = await clienteAxios.put(
          `${import.meta.env.VITE_APP_BACK}/api/facturas/updateinvoice`,
          {
            estado_facturacion: selectedEstadoFacturacion,
            nro_factura: nroFacturacion,
            _id: order.factura._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,              
              "Content-Type": "application/json",              
            },
          }
          
        );
  
        // Procesar la respuesta si es necesario
        console.log(`Orden ${order._id} modificada exitosamente.`, response.data);
      } catch (error) {
        // Manejar el error aquí (puedes mostrar un mensaje de error, registrar el error, etc.)
        console.error(`Error al modificar la orden ${order._id}:`, error);
      }
    }

    await obtenerYActualizarOrdenes();
    // Actualizar el estado del modal y limpiar después de guardar todas las órdenes
    handleEditModalClose();
    setSelectedRows([]);
    setSelectedEstadoFacturacion(null);
    swal("success", "ORDEN MODIFICADA", "success");
  };

  const handleRowSelect = (selectedRowKeys, selectedRows) => {
     console.log(selectedRows, selectedRowKeys);
      setSelectedRows(selectedRows);    
    
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

  const filteredOrdenes = useMemo(() => {
    if (!newProducts || newProducts.length === 0) {
      return [];
    }

    const searchTextLower = searchText.toLowerCase();
    return newProducts?.filter((orden) => {
      const { profesional_id } = orden;
      if (!profesional_id) {
        return;
      }

      const fullNameProfesional =
        `${orden?.cliente_id?.nombre} ${orden?.cliente_id?.apellido}`.toLowerCase();
      const fullNameCliente =
        `${orden?.cliente_id?.nombre} ${orden?.cliente_id?.apellido}`.toLowerCase();
      const fullNameProfesionalInverso =
        `${orden?.profesional_apellido} ${orden?.profesional_nombre} `.toLowerCase();
      const fullNameClienteInverso =
        `${orden?.cliente_id?.apellido} ${orden?.cliente_id?.nombre}`.toLowerCase();

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
            //orden?.cliente_id?.cedula.includes(searchTextLower) ||
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
        orden?.cliente_id?.cedula?.toString().includes(searchTextLower) ||
        orden?.cliente_id?.telefono?.includes(searchTextLower) ||
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
    {
      title: "Profesional",
      dataIndex: "profesional_id",
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
            {record?.nroSesion && (
              <p>
                <hr></hr>
                <b>Sesion</b> <br />
                {record?.nroSesion} <br />
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
    className="w-full p-1 bg-gray-100 ml-1"
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

      {selectedRows.length > 0 && (
        <div style={{ margin: "2rem", gap: "1rem" }}>
          <p>
            Cantidad de Servicios: <b>{selectedRows.length}</b>
          </p>    
<p>       total Venta : <b>{selectedRows.reduce((acc, el) => acc + el.factura.precioTotal, 0)}</b>    </p>
   
                  
          <Button onClick={handleEditModalOpen} style={{ margin: ".5rem" }}>
            Editar Filas Seleccionadas
          </Button>
        </div>
      )}


      <div>        
        <Table        
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
                productsID={productsID}
              />
            ),
          }}
          rowSelection={rowSelection}
        />
<Modal
      title="Editar Filas Seleccionadas"
      open={editModalVisible}
      onCancel={handleEditModalClose}
      width={"50rem"}
      footer={[
        <Button key="cancel" onClick={handleEditModalClose}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleEstadoFacturacionSave}>
          Guardar
        </Button>,
      ]}
    >
      <div className="flex flex-col space-y-4">
        <span>Estado de Facturacion</span>
        <Select
  placeholder="Seleccione el estado de facturacion"
  value={selectedEstadoFacturacion}
  onChange={handleEstadoFacturacionChange}
  style={{ width: "100%" }}
>
          <Option value="Facturado">Facturado</Option>
          <Option value="NoFacturado">No Facturado</Option>
          <Option value="Error">Error</Option>
        </Select>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col space-y-4">
        <span>Numero de factura</span>
        <input
          className="h-10 mx-auto w-70 p-4 rounded-md"
          placeholder="Numero de factura"
          value={nroFacturacion}
          onChange={(e) => setNroFacturacion(e.target.value)}
        />
      </div>
      <hr className="my-4" />
      {/* Otros bloques similares */}
    </Modal>

        
      </div>
    </div>
  );
};

export default FacturacionAntDesing;
