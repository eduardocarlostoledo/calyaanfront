import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../config/axios';

const Chat = ({ id }) => {
  
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const usuario = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    const getChats = async () => {
      try {
        setLoading(true);
        const response = await clienteAxios.get(`/api/chat/getchat/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessages(response.data.messages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        setLoading(false);
      }
    };
    getChats();
  }, [id, update]);

  const handleSendMessage = () => {
    if (currentMessage.trim() !== '') {
      const messageToSend = `${usuario.nombre}: ${currentMessage}`;
      setMessages([...messages, messageToSend]);
      setCurrentMessage('');

      const body = {
        id: id,
        user: usuario.nombre,
        message: currentMessage,     
      };

      clienteAxios
        .post('/api/chat/savechat/', body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log('Message saved successfully', response.data);
          setUpdate(!update);
        })
        .catch((error) => {
          console.error('Error saving message:', error);
        });
    }
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const messageToSend = `${usuario.nombre} ha compartido su ubicación: https://www.google.com/maps/place/${latitude}+${longitude}`;
        setMessages([...messages, messageToSend]);
        setCurrentMessage('');

        const body = {
          id: id,
          user: usuario.nombre,
          message: `Ubicación compartida: https://www.google.com/maps/place/${latitude}+${longitude}`,
        };

        clienteAxios
          .post('/api/chat/savechat/', body, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            console.log('Message saved successfully', response.data);
            setUpdate(!update);
          })
          .catch((error) => {
            console.error('Error saving message:', error);
          });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="p-4">
      <div className="h-96 border border-gray-300 mb-4 p-4 overflow-auto">
        {messages.map((message, index) => (
          <div key={index}>
            <p>
              {message.timestamp
                ? new Date(message.timestamp).toLocaleString('es-ES')
                : 'Cargando...'}{' '}
              @{message.user} <strong> {message.message} </strong>{' '}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <input
          className="border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Escribe un mensaje..."
        />
      </div>

      <button
        onClick={handleSendMessage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Enviar
      </button>

      <button
        onClick={shareLocation}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Compartir Ubicación
      </button>
    </div>
  );
};

export default Chat;


// import React, { useEffect, useState } from 'react';
// import clienteAxios from '../../../config/axios';

// const Chat = ({ id }) => {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [update, setUpdate] = useState(false);

//   const usuario = JSON.parse(localStorage.getItem('profile'));

//   useEffect(() => {
//     const getChats = async () => {
//       try {
//         setLoading(true);
//         const response = await clienteAxios.get(`/api/chat/getchat/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setMessages(response.data.messages); // Ajuste para acceder a la propiedad 'messages' del objeto de respuesta
//         setLoading(false);
//         //console.log("MENSAJE", response.data.messages)
//       } catch (error) {
//         console.error('Error fetching chat messages:', error);
//         setLoading(false);
//       }
//     };
//     getChats();
//   }, [id, update]); // Agrega 'id' como dependencia para que la solicitud se actualice cuando cambie el ID

//   const handleSendMessage = () => {

//     if (currentMessage !== '') {
//       const messageToSend = `${usuario.nombre}: ${currentMessage}`;
//       setMessages([...messages, messageToSend]);
//       setCurrentMessage('');

//       const body = {
//         id: id,
//         user: usuario.nombre,
//         message: currentMessage,
//       };

//       clienteAxios
//         .post("/api/chat/savechat/", body, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//           },
//         })
//         .then((response) => {
//           console.log('Message saved successfully', response.data)
//           setUpdate(!update);
//         })
//         .catch((error) => {
//           console.error('Error saving message:', error);
//         });
//     }
//   };

//   const shareLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         const messageToSend = `${usuario.nombre} ha compartido su ubicación: https://www.google.com/maps/place/${latitude}+${longitude}`;
//         setMessages([...messages, messageToSend]);
//         setCurrentMessage('');

//         const body = {
//           id: id,
//           user: usuario.nombre,
//           message: `Ubicación compartida: https://www.google.com/maps/place/${latitude}+${longitude}`,
//         };

//         clienteAxios
//           .post("/api/chat/savechat/", body, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//               'Content-Type': 'application/json',
//             },
//           })
//           .then((response) => {
//             console.log('Message saved successfully', response.data);
//             setUpdate(!update);
//           })
//           .catch((error) => {
//             console.error('Error saving message:', error);
//           });
//       });
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   };

//   return (
//     <div>
//       <div style={{ height: '300px', border: '1px solid', marginBottom: '10px', padding: '10px', overflow: 'auto' }}>
//         {messages?.map((message, index) => (
//           <div key={index}>
//             <div key={index}>
//               <p>
//                 {message?.timestamp ? (
//                   new Date(message.timestamp).toLocaleString('es-ES')
//                 ) : (
//                   'Cargando...'
//                 )} @{message?.user} <strong> {message?.message} </strong>{' '}
//               </p>


//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mb-4">
//         <input
//           className="border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
//           type="text"
//           value={currentMessage}
//           onChange={(e) => setCurrentMessage(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === 'Enter') {
//               handleSendMessage();
//             }
//           }}
//           placeholder="Escribe un mensaje..."
//         />
//       </div>

//       <button
//         onClick={handleSendMessage}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//       >
//         Enviar
//       </button>

//       <button
//         onClick={shareLocation}
//         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//       >
//         Compartir Ubicación
//       </button>


//     </div>
//   );
// };

// export default Chat;
