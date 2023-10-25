import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import clienteAxios from 'axios';
import { set } from 'date-fns';

const HorariosTabla = ({ _id }) => {
  console.log('HORARIOSTABLA', _id);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerDisponibilidades = async () => {
      try {
        setLoading(true);
        const response = await clienteAxios.post(
          `/api/profesional/disponibilidad-por-id`,
          { _id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setDisponibilidades(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las disponibilidades:', error);
        setLoading(false); // asegúrate de cambiar el estado de carga en caso de error también
      }
    };

    obtenerDisponibilidades();
  }, [_id]); // agrega _id a las dependencias de useEffect

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha'
    },
    {
      title: 'Horarios',
      dataIndex: 'horarios',
      key: 'horarios',
      render: horarios => (
        <ul>
          {horarios.map(horario => (
            <li key={horario._id}>{horario.hora}</li>
          ))}
        </ul>
      )
    },
    {
      title: 'Creador',
      dataIndex: 'creador',
      key: 'creador'
    }
  ];

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table dataSource={disponibilidades} columns={columns} pagination={false} />
      )}
    </div>
  );
};

export default HorariosTabla;

// import React, { useState, useEffect } from 'react';
// import { Table } from 'antd';
// import clienteAxios from 'axios';
// import { set } from 'date-fns';

// const HorariosTabla = ({_id}) => {
//     console.log("HORARIOSTABLA",_id);
//   const [disponibilidades, setDisponibilidades] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const obtenerDisponibilidades = async () => {
//       try {
//         setLoading(true);
//         const response = await clienteAxios.post(
//           `/api/profesional/disponibilidad-por-id`,
//           { _id },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         setDisponibilidades(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error al obtener las disponibilidades:', error);
//       }
//     };

//     obtenerDisponibilidades();
//   }, []);

//   const columns = [
//     {
//       title: 'Fecha',
//       dataIndex: 'fecha',
//       key: 'fecha'
//     },
//     {
//       title: 'Horarios',
//       dataIndex: 'horarios',
//       key: 'horarios',
//       render: horarios => (
//         <ul>
//           {horarios.map(horario => (
//             <li key={horario._id}>{horario.hora}</li>
//           ))}
//         </ul>
//       )
//     },
//     {
//       title: 'Creador',
//       dataIndex: 'creador',
//       key: 'creador'
//     }
//   ];

//   return (
//     { loading ? (
//         <p>Cargando...</p>
//         ) : ( 
//     <Table
//       dataSource={disponibilidades}
//       columns={columns}
//       pagination={false}
//     />) 
//    }
//   );
// };

// export default HorariosTabla;
