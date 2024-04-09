import React, { useEffect, useState } from 'react';
import clienteAxios from '../../config/axios';
import swal from 'sweetalert';
import ModalLogin from '../../components/ModalLogin';

const Chat = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [cargando, setCargando] = useState(false)
  const [modal, setModal] = useState(false);

  const handleModalLogin = () => {
    setModal(!modal);
  };

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

  }, [update, messageCount, id, usuario]);

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
      //console.log("ERROR DE CHAT", error.response?.data?.msg)
      if (error.response?.status === 401 && error.response?.data?.msg === "Token no valido") {
        setLoading(false); // Asegúrate de establecer cargando como falso aquí
        setModal(true);
        
      } else {        
      console.error('Error saving message:', error);
    }
  }};

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
    <div className="p-4 h-1/2">      
      <div className="h-32 xl:h-64 border border-gray-300 mb-4 p-4 overflow-auto">
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

      <div className="mb-1">
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
          placeholder="Escribir mensaje y Enviar..."
        />
      </div>

      <div className="p-1">
        <div className="flex flex-col sm:flex-row">
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded mr-2 mb-2 sm:mb-0 text-sm"
          >
            Enviar
          </button>

          <button
            onClick={shareLocation}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 sm:px-4 rounded mr-2 mb-2 sm:mb-0 text-sm"
          >
            Compartir Ubicación
          </button>

          <button
            onClick={handleSendMessageNotificacion}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 sm:px-4 rounded mr-2 mb-2 sm:mb-0 text-sm"
          >
            Enviar Notificacion
          </button>
        </div>



        <p className="py-1 text-sm sm:text-base text-center">
          Envía una notificación a tu paciente/profesional haciendo click en{' '}
          <strong>Enviar Notificación</strong>{' '}
        </p>     
      </div>
      {modal && <ModalLogin handleModalLogin={handleModalLogin} />}
    </div>
  );
}

export default Chat;