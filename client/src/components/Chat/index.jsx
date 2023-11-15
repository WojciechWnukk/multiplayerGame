import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
const Chat = ({ socket, actualPlayerNick }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [lastMessage, setLastMessage] = useState(null);
    //const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      console.log("Komponent chatu się załadował")
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
          // Używamy stompClient.subscribe zamiast socket.on
          const subscription = socket.subscribe('/topic/chat', handleMessage);
    
          // Pamiętaj o odsubskrybowaniu po opuszczeniu komponentu
          return () => subscription.unsubscribe();
        }
      }, [socket, actualPlayerNick, lastMessage]);


    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            const message = {
                text: inputMessage,
                author: actualPlayerNick,
            };

            // Wyślij wiadomość na serwer WebSocket
            socket.send('/app/chat', {}, JSON.stringify(message));

            // Dodaj wiadomość do lokalnego stanu
            //setMessages((prevMessages) => [...prevMessages, message]);

            // Wyczyść pole wprowadzania wiadomości
            setInputMessage('');
        }
    };

    return (
        <div className={styles.chat_container}>
            <ul className={styles.message_list}>
                {messages.map((message, index) => (
                    <li key={index} className={styles.message}>
                        <span className={styles.message_author}>{message.author}:</span>
                        <span className={styles.message_text}>{message.text}</span>
                    </li>
                ))}
            </ul>
            <div className={styles.message_input}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Wyślij</button> 
            </div>
        </div>
    );
};

export default Chat;
