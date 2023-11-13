import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import axios from 'axios';
import Chat from '../Chat';
import UserPanel from '../UserPanel';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
const Home = () => {
  const [players, setPlayers] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({});
  const [isMoving, setIsMoving] = useState(false);
  const playerId = localStorage.getItem('playerId');
  const [actualLevel, setActualLevel] = useState(1);
  const [actualPlayer, setActualPlayer] = useState({});
  const [entities, setEntities] = useState([]);
  const [previousPlayerPosition, setPreviousPlayerPosition] = useState({});
  const [socketData, setSocketData] = useState({
    message: 'Elo'
  });
  const [socket, setSocket] = useState(null);

  useEffect (() => {
    console.log("Socket data", socketData)
  }, [socketData])

  const connect = () => {
    let socket = new SockJS('http://localhost:8080/ws');
    stompClient = over(socket);
    setSocket(socket);
    stompClient.connect({}, onConnected, onError);
  }

  const onConnected = () => {
    setSocketData({...socketData, "connected": true})
    stompClient.subscribe('/topic/connection', onMessageReceived);
  }

  const onError = (err) => {
    console.log(err);
    
}

  const onMessageReceived = (payload) => {
  }

  const sendMessage = () => {
    
      console.log(socketData)
      stompClient.send('/app/connection', {}, JSON.stringify(socketData));
    
  }
  
  useEffect(() => {
    connect()
  }, [])

  const getPlayers = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/users`;
      const response = await axios.get(url);
      const players = response.data.data;
      setPlayers(players);
      const player = players.find((player) => player._id === playerId);
      setPlayerPosition({ x: player.x, y: player.y });
      setActualLevel(player.lvl);
      setActualPlayer(player);
      console.log('Gram na ', player);
    } catch (error) {
      console.log('Error fetching players', error);
    }
  };

  const movePlayer = async (playerId, x, y) => {
    try {
      const checkedX = x < 0 ? 0 : x > 1160 ? 1160 : x;
      const checkedY = y < 0 ? 0 : y > 760 ? 760 : y;
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/users/${playerId}`;
      const response = await axios.put(url, {
        x: checkedX,
        y: checkedY,
      });
      const player = response.data.data;
      console.log(player);
      sendMessage()

      //websocket
      
    } catch (error) {
      console.log('Error fetching players', error);
    }
  };

  useEffect(() => {
    getPlayers();
    setEntityXY()
    
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const speed = 40; // Szybkość poruszania się gracza

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (!isMoving) {
            setIsMoving(true);
            if (playerPosition.y <= 0) break;
            setPreviousPlayerPosition(playerPosition);
            setPlayerPosition((prevPos) => ({ ...prevPos, y: prevPos.y - speed }));
            movePlayer(playerId, playerPosition.x, playerPosition.y - speed);
          }
          break;
        case 'ArrowDown':
        case 's':
          if (!isMoving) {
            setIsMoving(true);
            if (playerPosition.y >= 760) break;
            setPreviousPlayerPosition(playerPosition);
            setPlayerPosition((prevPos) => ({ ...prevPos, y: prevPos.y + speed }));
            movePlayer(playerId, playerPosition.x, playerPosition.y + speed);
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (!isMoving) {
            setIsMoving(true);
            if (playerPosition.x <= 0) break;
            setPreviousPlayerPosition(playerPosition);
            setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x - speed }));
            movePlayer(playerId, playerPosition.x - speed, playerPosition.y);
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (!isMoving) {
            setIsMoving(true);
            if (playerPosition.x >= 1160) break;
            setPreviousPlayerPosition(playerPosition);
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
    checkEntityCollision();
  }, [playerId, playerPosition]);

  const getEntities = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities`;
      const response = await axios.get(url);
      const entities = response.data.data;
      console.log('Entities', entities)
      setEntities(entities);
    } catch (error) {
      console.log('Error fetching entities', error);
    }
  };

  const setEntityXY = async () => {
    for (const currentEntity of entities) {
      console.log("Current", currentEntity)
      if (currentEntity.alive) {
        console.log("Enitity is alive")
        const gridSize = 40
        const x = Math.floor(Math.random() * (1200 / gridSize)) * gridSize;
        const y = Math.floor(Math.random() * (800 / gridSize)) * gridSize;
        try {
          const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities/${currentEntity._id}`;
          const response = await axios.put(url, {
            x: x,
            y: y,
            alive: true,
          });
          const entity = response.data.data;
          console.log(entity);
        } catch (error) {
          console.log('Error fetching entities', error);
        }
      }
    }
  }

  const checkEntityCollision = async () => {
    if (entities.length > 0) {
      for (const currentEntity of entities) {
        if (currentEntity.alive === false) continue;
        console.log(playerPosition.x, currentEntity.x, playerPosition.y, currentEntity.y)
        if (
          playerPosition.x === currentEntity.x &&
          playerPosition.y === currentEntity.y &&
          (previousPlayerPosition.x !== currentEntity.x ||
            previousPlayerPosition.y !== currentEntity.y)) {
          //zabijanie przez websocket

          console.log("Entity killed")
          //if (socket) {
            //socket.emit('killEntity', { entityId: currentEntity._id, playerId: playerId })
          //}
          setEntityXY()
        }
      }
    }
  }

  useEffect(() => {
    getEntities();
  }, []);



  return (
    <div className={styles.container}>
      <div className={styles.baner}></div>
      {/*<div className={styles.title}>
        <h1>Twój poziom: {actualLevel}</h1>
  </div>*/}
      <div className={styles.chatContainer}>
        {socket && actualPlayer.nick && <Chat socket={socket} actualPlayerNick={actualPlayer.nick} />}
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
              title={`Poziom gracza: ${player.lvl}`}
            ></div>
          ))
        ) : null}
        {entities.length > 0 ? entities.map((entity, index) => (
          <div
            key={`entity-${index}`}
            className={entity.alive === true ? styles.entity : styles.entity_disabled}
            style={{
              transform: `translate(${entity.x}px, ${entity.y}px)`,
            }}
          ></div>
        )) : null}
      </div>
      <div className={styles.userPanelContainer}>
        {socket && actualPlayer.nick && <UserPanel socket={socket} actualPlayerNick={actualPlayer.nick} actualLevel={actualLevel} />}
      </div>


    </div>
  );
};

export default Home;
