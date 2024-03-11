import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
const Chat = ({ socket, actualPlayerNick }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const handleMessage = (message) => {
      const messageData = JSON.parse(message.body);

      if (
        !lastMessage ||
        lastMessage.author !== messageData.author ||
        lastMessage.text !== messageData.text
      ) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setLastMessage(messageData);
      } else {
        console.log("Ta sama wiadomość", lastMessage, messageData);
      }
    };

    if (socket) {
      const subscription = socket.subscribe("/topic/chat", handleMessage);
      return () => subscription.unsubscribe();
    }
  }, [socket, actualPlayerNick, lastMessage]);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const message = {
        text: inputMessage,
        author: actualPlayerNick,
      };
      socket.send("/app/chat", {}, JSON.stringify(message));
      setInputMessage("");
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
