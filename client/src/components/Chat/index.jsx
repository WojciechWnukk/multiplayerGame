import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [websocket, setWebsocket] = useState(null);
    const playerId = localStorage.getItem('playerId');
    const [actualPlayer, setActualPlayer] = useState({});

    const getPlayer = async () => {
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/users`;
            const response = await axios.get(url);
            const players = response.data.data;
            const player = players.find((player) => player._id === playerId);
            setActualPlayer(player);
            console.log('Gram na ', player);
        } catch (error) {
            console.log('Error fetching players', error);
        }
    }
    useEffect(() => {
        getPlayer();
    }, []);

    useEffect(() => {
        // Utwórz połączenie WebSocket
        const ws = new io('http://localhost:5000');

        // Nasłuchuj otwarcia połączenia WebSocket
        ws.on('connection', () => {
            console.log('Połączono z serwerem WebSocket');
        });
        // Nasłuchuj wiadomości przychodzących z serwera WebSocket
        ws.on('message', (message) => {
            console.log('Otrzymano wiadomość:', message);
            if(message.author !== actualPlayer.nick) {
                console.log(message.author, actualPlayer.nick)
            setMessages((prevMessages) => [...prevMessages, message]);
            }
        });


        setWebsocket(ws);

        return () => {
            // Zamknij połączenie WebSocket przy odmontowywaniu komponentu
            ws.close();
        };
    }, []);


    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            const message = {
                text: inputMessage,
                author: actualPlayer.nick, // Tutaj można pobrać autora z logowania lub innego źródła
            };

            // Wyślij wiadomość na serwer WebSocket
            websocket.send(JSON.stringify(message));

            // Dodaj wiadomość do lokalnego stanu
            setMessages((prevMessages) => [...prevMessages, message]);

            // Wyczyść pole wprowadzania wiadomości
            setInputMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.author}:</strong> {message.text}
                    </div>
                ))}
            </div>
            <div>
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
