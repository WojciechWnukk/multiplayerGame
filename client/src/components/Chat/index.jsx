import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import styles from './styles.module.css';
const Chat = ({ socket, actualPlayerNick }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const playerId = localStorage.getItem('playerId');
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        const handleMessage = (message) => {
          console.log('Otrzymano wiadomość:', message);
          console.log(message.author, actualPlayerNick);
          if (!lastMessage || (lastMessage.author !== message.author || lastMessage.text !== message.text)) {
            setMessages((prevMessages) => [...prevMessages, message]);
            setLastMessage(message);
          } else {
            console.log('Ta sama wiadomość', lastMessage, message);
          }
        };
      
        if (socket) {
          socket.on('message', handleMessage);
        }
      
        return () => {
          if (socket) {
            socket.off('message', handleMessage);
          }
        };
      }, [socket, actualPlayerNick, lastMessage]);


    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            const message = {
                text: inputMessage,
                author: actualPlayerNick, // Tutaj można pobrać autora z logowania lub innego źródła
            };

            // Wyślij wiadomość na serwer WebSocket
            socket.send(JSON.stringify(message));

            // Dodaj wiadomość do lokalnego stanu
            //setMessages((prevMessages) => [...prevMessages, message]);

            // Wyczyść pole wprowadzania wiadomości
            setInputMessage('');
        }
    };

    return (
        <div className={styles.chat_container}> {/* Dodaj klasę stylu do kontenera głównego */}
            <ul className={styles.message_list}> {/* Dodaj klasę stylu do listy wiadomości */}
                {messages.map((message, index) => (
                    <li key={index} className={styles.message}> {/* Dodaj klasę stylu do pojedynczej wiadomości */}
                        <span className={styles.message_author}>{message.author}:</span> {/* Dodaj klasę stylu do autora wiadomości */}
                        <span className={styles.message_text}>{message.text}</span> {/* Dodaj klasę stylu do treści wiadomości */}
                    </li>
                ))}
            </ul>
            <div className={styles.message_input}> {/* Dodaj klasę stylu do pola wprowadzania wiadomości */}
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Wyślij</button> {/* Dodaj klasę stylu do przycisku */}
            </div>
        </div>
    );
};

export default Chat;
