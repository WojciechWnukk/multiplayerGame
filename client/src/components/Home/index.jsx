import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import axios from 'axios';
import io from 'socket.io-client';

//ch[ech]

const Home = ({ }) => {
  const [players, setPlayers] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({});
  const [isMoving, setIsMoving] = useState(false);
  const playerId = localStorage.getItem('playerId');
  const [socket, setSocket] = useState(null); // Stan socketa
  const [entities, setEntities] = useState([]);
  useEffect(() => {
    if (!socket) {
      // Otwórz początkowe połączenie WebSocket
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        query: {
          userId: playerId,
        },
      });
      setSocket(newSocket);
    }

    return () => {
      // Nie zamykaj połączenia WebSocket przy odmontowywaniu komponentu
    };
  }, [socket, playerId]);

  const getPlayers = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/users`;
      const response = await axios.get(url);
      const players = response.data.data;
      setPlayers(players);
      const player = players.find((player) => player._id === playerId);
      setPlayerPosition({ x: player.x, y: player.y });
      console.log('Gram na ', player);
    } catch (error) {
      console.log('Error fetching players', error);
    }
  };

  const movePlayer = async (playerId, x, y) => {
    try {
      const checkedX = x < 0 ? 0 : x > 800 ? 800 : x;
      const checkedY = y < 0 ? 0 : y > 600 ? 600 : y;
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/users/${playerId}`;
      const response = await axios.put(url, {
        x: checkedX,
        y: checkedY,
      });
      const player = response.data.data;
      console.log(player);

      if (socket) {
        // Wyślij aktualizację pozycji na sockecie
        socket.emit('updatePosition', { playerId, x: checkedX, y: checkedY });
      }
    } catch (error) {
      console.log('Error fetching players', error);
    }
  };

  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const speed = 40; // Szybkość poruszania się gracza

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (!isMoving) {
            setIsMoving(true);
            setPlayerPosition((prevPos) => ({ ...prevPos, y: prevPos.y - speed }));
            movePlayer(playerId, playerPosition.x, playerPosition.y - speed);
          }
          break;
        case 'ArrowDown':
        case 's':
          if (!isMoving) {
            setIsMoving(true);
            setPlayerPosition((prevPos) => ({ ...prevPos, y: prevPos.y + speed }));
            movePlayer(playerId, playerPosition.x, playerPosition.y + speed);
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (!isMoving) {
            setIsMoving(true);
            setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x - speed }));
            movePlayer(playerId, playerPosition.x - speed, playerPosition.y);
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (!isMoving) {
            setIsMoving(true);
            setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x + speed }));
            movePlayer(playerId, playerPosition.x + speed, playerPosition.y);
          }
          break;
        default:
          break;
      }
      setTimeout(() => {
        setIsMoving(false);
      }, 500); // Tutaj możesz dostosować czas opóźnienia
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMoving, playerId, playerPosition]);

  useEffect(() => {
    if (playerPosition.x === undefined || playerPosition.y === undefined) return;
    movePlayer(playerId, playerPosition.x, playerPosition.y);
  }, [playerId, playerPosition]);

  useEffect(() => {
    if (!socket) return;

    socket.on('connection', (refreshPlayers) => {
      setPlayers(refreshPlayers);
      console.log('WebSocket connected');
    });

    socket.on('disconnect', (refreshPlayers) => {
      console.log('WebSocket disconnected');
      setPlayers(refreshPlayers)
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socket.on('updatePosition', ({ playerId, x, y }) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === playerId ? { ...player, x, y } : player
        )
      );
    });
  }, [socket]);
  useEffect(() => {
    // Nasłuchuj na zdarzenie refreshPlayers i aktualizuj listę graczy
    if (socket) {
      socket.on('refreshPlayers', (newPlayers) => {
        setPlayers(newPlayers);
      });
    }

    // ... reszta kodu
  }, [socket]);


  useEffect(() => {
    // Generowanie pozycji dla encji po pobraniu graczy
    const entityPositions = [];
    const gridSize = 40
    for (let i = 0; i < 1; i++) { // Generuj 10 encji (możesz dostosować ilość)
      const x = Math.floor(Math.random() * (800 / gridSize)) * gridSize; // 800 to szerokość mapy
      const y = Math.floor(Math.random() * (600 / gridSize)) * gridSize; // 600 to wysokość mapy
      entityPositions.push({ x, y });
    }
    setEntities(entityPositions);
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.baner}></div>
      <div className={styles.title}>
        <h1>Home</h1>
      </div>
      <div className={styles.map}>
        {players ? (
          players.map((player) => (
            <div
              key={player._id}
              className={player.online === true ? styles.player : styles.player_disabled}
              style={{
                transform: `translate(${player._id === playerId ? playerPosition.x : player.x}px, ${player._id === playerId ? playerPosition.y : player.y
                  }px)`,
                transition: 'transform 0.1s ease-in-out', // Dodaj animację CSS
              }}
            ></div>
          ))
        ) : null}
        {entities.map((entity, index) => (
          <div
            key={`entity-${index}`}
            className={styles.entity}
            style={{
              transform: `translate(${entity.x}px, ${entity.y}px)`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Home;
