import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../config/axios';
import swal from 'sweetalert';

const Chat = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

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
        

        const newMessages = response.data.messages;
        if (newMessages.length !== messageCount) {
          setMessages(newMessages);
          setMessageCount(newMessages.length);
        }

        setLoading(false);
      } catch (error) {
        console.error('No hay mensajes');
        setLoading(false);
      }
    };

    const intervalId = setInterval(() => {
      getChats();
    }, 5000);

    return () => clearInterval(intervalId);

  }, [update, messageCount, id]);

  const handleSendMessage = async () => {
    try {
      if (currentMessage.trim() !== '') {
        const messageToSend = `${usuario.nombre}: ${currentMessage}`;
        setMessages([...messages, messageToSend]);
        setCurrentMessage('');

        const body = {
          id: id,
          user: usuario.nombre,
          message: currentMessage,
        };

        await clienteAxios.post('/api/chat/savechat/', body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        setUpdate(!update);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const mapLink = `https://www.google.com/maps/place/${latitude},${longitude}`;
        const messageToSend = (
          <a href={mapLink} target="_blank" rel="noopener noreferrer">
            {usuario.nombre} ha compartido su ubicación: Ver en Google Maps
          </a>
        );

        setMessages([...messages, messageToSend]);
        setCurrentMessage('');

        const body = {
          id: id,
          user: usuario.nombre,
          message: `Ubicación compartida: ${mapLink}`,
        };

        await clienteAxios.post('/api/chat/savechat/', body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        setUpdate(!update);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSendMessageNotificacion = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem('profile') || '{}');
      const body = {
        id: id,
        email: profile.email,
      };

      await clienteAxios.post('/api/chat/notificacion/', body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      swal({
        title: 'Notificacion enviada',
        text: 'Se ha enviado una notificacion al usuario, para que se comunique contigo.',
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const filterSensitiveData = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /\b\d{6,}\b/g; // Ajustado para números de al menos 6 dígitos
    const filteredText = text.replace(emailRegex, '*******').replace(phoneRegex, '*******');
    return filteredText;
  };
  
  

  const convertUrlsToLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);

    if (urls && urls.length > 0) {
      urls.forEach((url) => {
        const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        text = text.replace(url, link);
      });
    }

    return text;
  };

  const renderMessageContent = (messageText) => {
    if (!messageText) {
      return null;
    }
    if (messageText.includes('Ubicación compartida')) {
      let processedText = convertUrlsToLinks(messageText)
      return <span dangerouslySetInnerHTML={{ __html: processedText }} />
    }

    let processedText = filterSensitiveData(messageText);
    return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  return (
    <div className="p-4">
      <div className="h-48 border border-gray-300 mb-4 p-4 overflow-auto">
        {messages.map((message, index) => (
          <div key={index}>
            <p>
              {message.timestamp
                ? new Date(message.timestamp).toLocaleString('es-ES')
                : 'Cargando...'}{' '}
              @{message.user} dice: {renderMessageContent(message.message)}
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
      <p className="py-1">
        Deja un mensaje a tu paciente/profesional en el Chat. Escribe tu mensaje en el cuadro de texto y haz click en{' '}
        <strong>Enviar</strong>{' '}
      </p>
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Enviar
      </button>

      <button
        onClick={shareLocation}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 mt-2"
      >
        Compartir Ubicación
      </button>

      <button
        onClick={handleSendMessageNotificacion}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 mt-2"
      >
        Enviar Notificacion
      </button>
      <p className="py-3">
        Recuerda que puedes enviarle una notificación a tu paciente/profesional haciendo click en{' '}
        <strong>Enviar Notificación</strong>{' '}
      </p>
    </div>
  );
};

export default Chat;

// import React, { useEffect, useState } from 'react';
// import clienteAxios from '../../../config/axios';
// import swal from 'sweetalert';

// const Chat = ({ id }) => {
  
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [update, setUpdate] = useState(false);
//   const [messageCount, setMessageCount] = useState(0);

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

//         const newMessages = response.data.messages;
//         // Verificar si hay nuevos mensajes
//         if (newMessages.length !== messageCount) {
//           setMessages(newMessages);
//           setMessageCount(newMessages.length);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching chat messages:', error);
//         setLoading(false);
//       }
//     };

//     const intervalId = setInterval(() => {
//       getChats();
//     }, 3000);
  
//     // Limpia el intervalo al desmontar el componente
//     return () => clearInterval(intervalId);
    
//   }, [update, messageCount]); // Solo depende de id y messageCount

//   //post mensaje al backend
//   const handleSendMessage = () => {
//     if (currentMessage.trim() !== '') {
//       const messageToSend = `${usuario.nombre}: ${currentMessage}`;
//       setMessages([...messages, messageToSend]);
//       setCurrentMessage('');

//       const body = {
//         id: id,
//         user: usuario.nombre,
//         message: currentMessage,     
//       };

//       clienteAxios
//         .post('/api/chat/savechat/', body, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//           },
//         })
//         .then((response) => {
//           console.log('Message saved successfully', response.data);
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
//         const mapLink = `https://www.google.com/maps/place/${latitude},${longitude}`;
//         const messageToSend = (
//           <a href={mapLink} target="_blank" rel="noopener noreferrer">
//             {usuario.nombre} ha compartido su ubicación: Ver en Google Maps
//           </a>
//         );
  
//         setMessages([...messages, messageToSend]);
//         setCurrentMessage('');
  
//         const body = {
//           id: id,
//           user: usuario.nombre,
//           message: `Ubicación compartida: ${mapLink}`,
//         };
  
//         clienteAxios
//           .post('/api/chat/savechat/', body, {
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
  

//   //post notificaciones al backend
//   const handleSendMessageNotificacion = () => {    
//     const profile = JSON.parse(localStorage.getItem('profile') || '{}');
//     console.log("PROFILE", profile.email);    

//       const body = {
//         id: id,      
//         email: profile.email,  
//       };

//       clienteAxios
//         .post('/api/chat/notificacion/', body, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//           },
//         })
//         .then((response) => {
//           console.log('Notificacion enviada', response.data);          
//         })
//         .then(
//           swal({
//             title: "Notificacion enviada",
//             text: "Se ha enviado una notificacion al usuario, para que se comunique contigo.",
//             icon: "success",
//             button: "Aceptar",
//           })
//         )
//         .catch((error) => {
//           console.error('Error enviando notificacion:', error);
//         });
//     };

//     //filtrar informacion sensible
//     const filterSensitiveData = (text) => {
//       // Filtrar correos electrónicos
//       const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
//       const filteredEmails = text.replace(emailRegex, '*******');
    
//       // Filtrar números de teléfono
//       const phoneRegex = /\b\d{10,}\b/g;
//       const filteredText = text.replace(phoneRegex, '*******');
    
//       return filteredText;
//     };
    
//     const convertUrlsToLinks = (text) => {
//       const urlRegex = /(https?:\/\/[^\s]+)/g;
//       const urls = text.match(urlRegex);
    
//       if (urls && urls.length > 0) {
//         urls.forEach((url) => {
//           const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
//           text = text.replace(url, link);
//         });
//       }
    
//       return text;
//     };
    
//     const renderMessageContent = (messageText) => {      
//       if (!messageText) {
//         return null; // or an empty string, depending on your preference
//       }
    
//       let processedText = filterSensitiveData(messageText);      
//       processedText = convertUrlsToLinks(processedText);      
    
//       return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
//     };

//   return (
//     <div className="p-4">
//       <div className="h-48 border border-gray-300 mb-4 p-4 overflow-auto">
//         {messages.map((message, index) => (
//           <div key={index}>
//             <p>
//               {message.timestamp
//                 ? new Date(message.timestamp).toLocaleString('es-ES')
//                 : 'Cargando...'}{' '}
//               @{message.user}{" dice: "} 
//               {renderMessageContent(message.message)}
//             </p>
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
//       <p className='py-1'> Deja un mensaje a tu paciente/profesional en el Chat. Escribe tu mensaje en el cuadro de texto y haz click en <strong>Enviar</strong> </p>
//       <button
//         onClick={handleSendMessage}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//       >
//         Enviar
//       </button>

//       <button
//         onClick={shareLocation}
//         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 mt-2"
//       >
//         Compartir Ubicación
//       </button>

//       <button
//         onClick={handleSendMessageNotificacion}
//         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 mt-2"
//       >
//         Enviar Notificacion
//       </button>      
//       <p className='py-3'> Recuerda que puedes enviarle una notificación a tu paciente/profesional haciendo click en <strong>Enviar Notificación</strong> </p>

//     </div>
//   );
// };

// export default Chat;