import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getLast50Messages } from '../api';
import withAppContext from '../withAppContext';
import { AppContextPropType } from '../helpers/PropTypeConstants';
import '../styles/ChatRoom.css';

const backendUrl: string = 'http://localhost:8080';
const socket: Socket = io(backendUrl);

const ChatRoomWithoutContext: React.FC<{ appContext: AppContextPropType }> = ({ appContext }) => {
  const [messageText, setMessageText] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [rateLimitExceeded, setRateLimitExceeded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const initialMessages = await getLast50Messages();
      setMessages(initialMessages.messages.reverse());
    };
    fetchData();

    socket.on('receiveMessage', (data: { username: any; message: any }) => {
      const { username, message } = data;
      setMessages((prevMessages) => [...prevMessages, { messageSender: username, message }]);
    });

    socket.on('errorMessage', () => {
      setRateLimitExceeded(true);
      setTimeout(() => {
        setRateLimitExceeded(false);
      }, 5000);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value);
  };

  const handleSubmitAsync = async () => {
    const data = { username: appContext.username, message: messageText };
    socket.emit('message', data);
    setMessageText('');
  };

  const onKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      await handleSubmitAsync();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className="header-wrapper">
        <h1>Rate limited chat</h1>
      </div>
      <div className="chat-room">
        {messages.map((message, i) => (
          <div key={`${i}wrapper${message.message.replace(/\s/g, '')}`}>
            <span key={`${i}sender${message.message.replace(/\s/g, '')}`}>
              {`${message.messageSender}: `}
            </span>
            <span key={`${i}message${message.message.replace(/\s/g, '')}`}>{message.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {rateLimitExceeded && (
        <div className="rate-limit">
          Rate limit exceeded. Please wait before sending more messages.
        </div>
      )}
      <form onSubmit={(event) => event.preventDefault()} className="message-form">
        <textarea
          onKeyDown={onKeyDown}
          value={messageText}
          onChange={handleMessageTextChange}
          className="message-text-box"
        />
        <input type="submit" value="send" id="sendMessageButton" className="send-button" />
      </form>
    </div>
  );
};

export default withAppContext(ChatRoomWithoutContext);
