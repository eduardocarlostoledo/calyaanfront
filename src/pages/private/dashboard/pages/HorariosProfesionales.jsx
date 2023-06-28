import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, List, Spin, Alert, Tag, Input } from "antd";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import moment from "moment";
import swal from "sweetalert";
import "./Ordenesantd.css";
import { disponibilidadesTotalesGet } from "../../../../redux/features/professionalSlice";
// import { newHourArray,localidadesLaborales } from "../../../../data";

const HorarioProfessionalAntDesing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editProduct, setEditProduct] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  
  useEffect(() => {
    dispatch(disponibilidadesTotalesGet())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  const orders = useSelector(
    (state) => state.professional.disponibilidad || []
  );
  // console.log(orders);
  //// Mapeo ordenes para agregar una key a cada fila
  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  const filteredOrdenes = useMemo(() => {
    return newProducts?.filter((orden) => {
      const { creador, fecha, disponibilidad } = orden;
      const {
        telefono,
        email,
        nombre,
        apellido,
        localidadesLaborales,
        especialidad,
      } = creador?.creador;

      const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

      const matchLocalidad = creador.localidadesLaborales?.some((localidad) =>
        localidad.toLowerCase().includes(searchText.toLowerCase())
      );

      const matchEspecialidad = creador.especialidad?.some((especialidades) =>
        especialidades.toLowerCase().includes(searchText.toLowerCase())
      );

      const matchHoraServicio = disponibilidad?.some((hora) =>
        hora.hora.toLowerCase().includes(searchText.toLowerCase())
      );

      return (
        telefono?.includes(searchText) ||
        email?.includes(searchText) ||
        nombreCompleto.includes(searchText.toLowerCase()) ||
        (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
          apellido?.toLowerCase().includes(searchText.toLowerCase())) ||
        moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD").includes(searchText) ||
        matchHoraServicio ||
        matchLocalidad ||
        matchEspecialidad
      );
    });
  }, [newProducts, searchText]);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "creador",
      //   sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (creador) => (
        <p>
          <b>
            {creador.creador.nombre} {creador.creador.apellido}
          </b>
        </p>
      ),
    },
    {
      title: "Especialidad",
      dataIndex: "creador",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => text.especialidad.map((e) => <p> {e} </p>),
    },
    {
      title: "Telefono",
      dataIndex: "creador",
      //   sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (creador) => <p>{creador.creador.telefono}</p>,
    },
    {
      title: "email",
      dataIndex: "creador",
      //   sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (creador) => <p>{creador.creador.email}</p>,
    },
    {
      title: "Localidad",
      dataIndex: "creador",
      //   sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) =>
        text.localidadesLaborales.map((localidad) => <p> {localidad} </p>),
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      //   sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Hora",
      dataIndex: "disponibilidad",
      //   sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => text.map((localidad) => <p> {localidad.hora} </p>),
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  
    // Obtener los datos de las filas seleccionadas
    const selectedRows = filteredOrdenes.filter(
      (orden) => selectedRowKeys.includes(orden.key)
    );
    console.log(selectedRows);
  };

  
  return (
    <div
      style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}
    >
      <p className="p">DISPONIBILIDAD PROFESIONAL</p>
      <p className="p">
        BUSQUEDA POR NOMBRE, APELLIDO, ESPECIALIDAD, TELEFONO, EMAIL, LOCALIDAD
        LABORAL, FECHA DE DISPONIBILIDAD, HORA DISPONIBLE.
      </p>

      <h1 style={{ textAlign: "center", alignItems: "center" }}>
        <Input.Search
          placeholder="Buscar"
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: 400,
            marginBottom: "0px",
            textAlign: "center",
            alignItems: "center",
          }}
        />
      </h1>
      {/* <p className="p">
        Puede ordenar ascendente o descendentemente con las flechas en Datos de
        la tabla
      </p> */}

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
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
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

export default HorarioProfessionalAntDesing;

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, List, Spin, Alert, Tag, Input } from "antd";
// import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import moment from "moment";
// import swal from "sweetalert";
// import "./Ordenesantd.css";
// import { disponibilidadesTotalesGet } from "../../../../redux/features/professionalSlice";
// // import { newHourArray,localidadesLaborales } from "../../../../data";

// const HorarioProfessionalAntDesing = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [editProduct, setEditProduct] = useState(0);
//   //   const change = useSelector((state) => state.professional.disponibilidad);
//   //separo los useEffect para que no se renderize todo junto
//   useEffect(() => {
//     dispatch(disponibilidadesTotalesGet())
//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [dispatch]);

//   const orders = useSelector(
//     (state) => state.professional.disponibilidad || []
//   );
//   console.log(orders);
//   //// Mapeo ordenes para agregar una key a cada fila
//   const newProducts = orders?.map((product) => ({
//     ...product,
//     key: product._id,
//   }));

//   const filteredOrdenes = useMemo(() => {
//     return newProducts?.filter((orden) => {
//       const { creador, fecha, disponibilidad } = orden;
//       const { telefono, email, nombre, apellido, localidadesLaborales, especialidad } =
//         creador?.creador;

//       const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

//       const matchLocalidad = creador.localidadesLaborales?.some((localidad) =>
//         localidad.toLowerCase().includes(searchText.toLowerCase())
//       );

//       const matchEspecialidad = creador.especialidad?.some((especialidades) =>
//       especialidades.toLowerCase().includes(searchText.toLowerCase())
//       );

//       const matchHoraServicio = disponibilidad?.some((hora) =>
//         hora.hora.toLowerCase().includes(searchText.toLowerCase())
//       );

//       return (
        
//         telefono?.includes(searchText) ||
//         email?.includes(searchText) ||
//         nombreCompleto.includes(searchText.toLowerCase()) ||
//         (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
//           apellido?.toLowerCase().includes(searchText.toLowerCase())) ||
//         moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD").includes(searchText) ||
//         matchHoraServicio ||
//         matchLocalidad || 
//         matchEspecialidad
//       );
//     });
//   }, [newProducts, searchText]);

//   const columns = [
//     {
//       title: "Nombre",
//       dataIndex: "creador",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (creador) => (
//         <p>
//           <b>
//             {creador.creador.nombre} {creador.creador.apellido}
//           </b>
//         </p>
//       ),
//     },
//     {
//       title: "Especialidad",
//       dataIndex: "creador",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) =>
//         text.especialidad.map((e) => <p> {e} </p>),
      
//     },    
//     {
//       title: "Telefono",
//       dataIndex: "creador",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (creador) => <p>{creador.creador.telefono}</p>,
//     },
//     {
//       title: "email",
//       dataIndex: "creador",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (creador) => <p>{creador.creador.email}</p>,
//     },
//     {
//       title: "Localidad",
//       dataIndex: "creador",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) =>
//         text.localidadesLaborales.map((localidad) => <p> {localidad} </p>),
//     },
//     {
//       title: "Fecha",
//       dataIndex: "fecha",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Hora",
//       dataIndex: "disponibilidad",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => text.map((localidad) => <p> {localidad.hora} </p>),
//     },
//   ];

//   return (
    
//     <div
//       style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}
//     >
//       <p className="p">DISPONIBILIDAD PROFESIONAL</p>
//       <p className="p">
//         BUSQUEDA POR NOMBRE, APELLIDO, ESPECIALIDAD, TELEFONO, EMAIL, LOCALIDAD LABORAL, FECHA DE DISPONIBILIDAD, HORA DISPONIBLE.
//       </p>
      
//       <h1 style={{ textAlign: "center", alignItems: "center" }}>
//         <Input.Search
//           placeholder="Buscar"
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{
//             width: 400,
//             marginBottom: "0px",
//             textAlign: "center",
//             alignItems: "center",
//           }}
//         />
//       </h1>
//       {/* <p className="p">
//         Puede ordenar ascendente o descendentemente con las flechas en Datos de
//         la tabla
//       </p> */}

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

// export default HorarioProfessionalAntDesing;

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, List, Spin, Alert, Tag, Input } from "antd";
// import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import moment from "moment";
// import swal from "sweetalert";
// import "./Ordenesantd.css";
// import { disponibilidadesTotalesGet } from "../../../../redux/features/professionalSlice";
// // import { newHourArray,localidadesLaborales } from "../../../../data";

// const HorarioProfessionalAntDesing = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [editProduct, setEditProduct] = useState(0);
//   //   const change = useSelector((state) => state.professional.disponibilidad);
//   //separo los useEffect para que no se renderize todo junto
//   useEffect(() => {
//     dispatch(disponibilidadesTotalesGet())
//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [dispatch]);

//   const orders = useSelector(
//     (state) => state.professional.disponibilidad || []
//   );
//   console.log(orders);
//   //// Mapeo ordenes para agregar una key a cada fila
//   const newProducts = orders?.map((product) => ({
//     ...product,
//     key: product._id,
//   }));

//   //se filtran las ordenes para renderizado de la tabla
//   //   const filteredOrdenes = useMemo(() => {
//   //     return newProducts?.filter(
//   //       (orden) =>
//   //         orden.creador.creador.telefono?.includes(searchText) ||
//   //         orden.creador.creador.email?.includes(searchText) ||
//   //         orden.creador.creador.nombre
//   //           ?.toLowerCase()
//   //           .includes(searchText.toLowerCase()) ||
//   //         orden.creador.creador.apellido
//   //           ?.toLowerCase()
//   //           .includes(searchText.toLowerCase()) ||
//   //         (orden.creador.creador.nombre
//   //           ?.toLowerCase()
//   //           .includes(searchText.toLowerCase()) &&
//   //           orden.creador.creador.apellido
//   //             ?.toLowerCase()
//   //             .includes(searchText.toLowerCase())) ||
//   //         orden.servicio?.toLowerCase().includes(searchText.toLowerCase()) ||
//   //         orden.direccion_Servicio
//   //           ?.toLowerCase()
//   //           .includes(searchText.toLowerCase()) ||
//   //         moment(orden.dia_servicio, "YYYY-MM-DD")
//   //           .format("YYYY-MM-DD")
//   //           .includes(searchText) || // Verifica si la búsqueda coincide con la fecha de la orden
//   //         moment(orden.hora_servicio, "hh:mm a")
//   //           .format("hh:mm a")
//   //           .includes(searchText) // Verifica si la búsqueda coincide con la hora de la orden
//   //     );
//   //   }, [newProducts, searchText]);

//   //   const filteredOrdenes = useMemo(() => {
//   //     return newProducts?.filter((orden) => {
//   //       const {
//   //         creador,
//   //         servicio,
//   //         direccion_Servicio,
//   //         dia_servicio,
//   //         hora_servicio,
//   //       } = orden;
//   //       const { telefono, email, nombre, apellido } = creador?.creador;

//   //       const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

//   //       return (
//   //         telefono?.includes(searchText) ||
//   //         email?.includes(searchText) ||
//   //         nombreCompleto.includes(searchText.toLowerCase()) ||
//   //         (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
//   //           apellido?.toLowerCase().includes(searchText.toLowerCase())) ||
//   //         servicio?.toLowerCase().includes(searchText.toLowerCase()) ||
//   //         direccion_Servicio?.toLowerCase().includes(searchText.toLowerCase()) ||
//   //         moment(dia_servicio, "YYYY-MM-DD")
//   //           .format("YYYY-MM-DD")
//   //           .includes(searchText) ||
//   //         moment(hora_servicio, "hh:mm a").format("hh:mm a").includes(searchText)
//   //       );
//   //     });
//   //   }, [newProducts, searchText]);

//   const filteredOrdenes = useMemo(() => {
//     return newProducts?.filter((orden) => {
//       const { creador, fecha, disponibilidad } = orden;
//       const { telefono, email, nombre, apellido, localidadesLaborales } =
//         creador?.creador;

//       const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

//       const matchLocalidad = creador.localidadesLaborales?.some((localidad) =>
//         localidad.toLowerCase().includes(searchText.toLowerCase())
//       );

//       const matchHoraServicio = disponibilidad?.some((hora) =>
//         hora.hora.toLowerCase().includes(searchText.toLowerCase())
//       );

//       return (
//         telefono?.includes(searchText) ||
//         email?.includes(searchText) ||
//         nombreCompleto.includes(searchText.toLowerCase()) ||
//         (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
//           apellido?.toLowerCase().includes(searchText.toLowerCase())) ||
//         moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD").includes(searchText) ||
//         matchHoraServicio ||
//         matchLocalidad
//       );
//     });
//   }, [newProducts, searchText]);

//   const columns = [
//     {
//       title: "Nombre",
//       dataIndex: "creador",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (creador) => (
//         <p>
//           <b>
//             {creador.creador.nombre} {creador.creador.apellido}
//           </b>
//         </p>
//       ),
//     },
//     // {
//     //   title: "Apellido",
//     //   dataIndex: "creador",
//     //   sorter: (a, b) => a.id - b.id,
//     //   defaultSortOrder: "descend",
//     //   render: (creador) => (
//     //     <p>
//     //       <b>{creador.creador.apellido}</b>
//     //     </p>
//     //   ),
//     // },
//     {
//       title: "Telefono",
//       dataIndex: "creador",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (creador) => <p>{creador.creador.telefono}</p>,
//     },
//     {
//       title: "email",
//       dataIndex: "creador",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (creador) => <p>{creador.creador.email}</p>,
//     },
//     {
//       title: "Localidad",
//       dataIndex: "creador",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) =>
//         text.localidadesLaborales.map((localidad) => <p> {localidad} </p>),
//     },
//     {
//       title: "Fecha",
//       dataIndex: "fecha",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Hora",
//       dataIndex: "disponibilidad",
//       //   sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => text.map((localidad) => <p> {localidad.hora} </p>),
//     },
//   ];

//   return (
//     // style={{ width: '100%', height: '400px', overflow: 'auto' }}
//     <div
//       style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}
//     >
//       <p className="p">Horarios disponibles </p>
//       <p className="p">
//         Busqueda :Nombre y apellido del cliente,telefono,email y localidad
//       </p>
//       <h1 style={{ textAlign: "center", alignItems: "center" }}>
//         <Input.Search
//           placeholder="Buscar"
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{
//             width: 400,
//             marginBottom: "0px",
//             textAlign: "center",
//             alignItems: "center",
//           }}
//         />
//       </h1>
//       {/* <p className="p">
//         Puede ordenar ascendente o descendentemente con las flechas en Datos de
//         la tabla
//       </p> */}

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

// export default HorarioProfessionalAntDesing;
