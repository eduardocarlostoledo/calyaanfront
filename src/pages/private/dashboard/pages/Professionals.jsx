import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, List, Spin, Alert, Tag, Input } from "antd";
import { FaWhatsapp } from "react-icons/fa";
import { obtenerUsuarios } from "../../../../redux/features/usuariosSlice";

const Professionals = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");  
  const [editProduct, setEditProduct] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    dispatch(obtenerUsuarios())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  const orders = useSelector((state) => state.usuarios.users || []);

  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  const filteredOrdenes = useMemo(() => {
    return newProducts?.filter((orden) => {
      const { nombre, apellido, email, rol, telefono, ultimaConexion } = orden;

      const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

      return (
        rol?.includes(searchText) ||
        telefono?.includes(searchText) ||
        email?.includes(searchText) ||
        nombreCompleto.includes(searchText.toLowerCase()) ||
        (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
          apellido?.toLowerCase().includes(searchText.toLowerCase())) 
      );
    });
  }, [newProducts, searchText]);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Rol",
      dataIndex: "rol",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
      filters: [
        { text: "CLIENTE", value: "CLIENTE" },
        { text: "PROFESIONAL", value: "PROFESIONAL" },
        { text: "ADMIN", value: "ADMIN" },
      ],
      onFilter: (value, record) => record.rol.includes(value),
      filteredValue: ["PROFESIONAL"],
    },
    {
      title: "Email",
      dataIndex: "email",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Telefono",
      dataIndex: "telefono",
      defaultSortOrder: "descend",
      render: (text) => (
        <div>
          <p>{text}</p>
          <a
            href={`https://api.whatsapp.com/send/?phone=57${text}&text&type=phone_number&app_absent=0`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={25} />
          </a>
        </div>
      ),
    },
    {
      title: "Ultimo Acceso",
      dataIndex: "ultimaConexion",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);

    const selectedRows = filteredOrdenes.filter((orden) =>
      selectedRowKeys.includes(orden.key)
    );
    console.log(selectedRows);
  };

  return (
    <div style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}>
      <p className="p">USUARIOS</p>
      <p className="p">BUSQUEDA POR NOMBRE, APELLIDO, TELEFONO, EMAIL, ROL</p>

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
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
        />
      </div>
    </div>
  );
};

export default Professionals;





