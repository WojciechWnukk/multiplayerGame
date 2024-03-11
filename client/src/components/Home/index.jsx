import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import Chat from "../Chat";
import UserPanel from "../UserPanel";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import Modal from "react-modal";
import GameMap from "../GameMap";
Modal.setAppElement("#root");
let stompClient = null;
const Home = () => {
  const [players, setPlayers] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({});
  const [isMoving, setIsMoving] = useState(false);
  const playerId = localStorage.getItem("playerId");
  const [actualLevel, setActualLevel] = useState(1);
  const [actualPlayer, setActualPlayer] = useState({});
  const [entities, setEntities] = useState([]);
  const [previousPlayerPosition, setPreviousPlayerPosition] = useState({});
  const [socketData, setSocketData] = useState({
    playerId: playerId,
    online: true,
  });
  const actualPlayerRef = useRef(null);
  const [playerHealth, setPlayerHealth] = useState(1);
  const [playerExp, setPlayerExp] = useState(1);
  const [playerAlive, setPlayerAlive] = useState();

  const connect = () => {
    let socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    if (stompClient && stompClient.connected) {
      stompClient.subscribe("/topic/playerPosition", onMessageReceived);
      stompClient.subscribe("/topic/entities", updatedEntities);
      stompClient.subscribe("/topic/killEntity", onMessageReceived);
      stompClient.subscribe("/topic/connectPlayer", onMessageReceived);
      stompClient.subscribe("/topic/disconnectPlayer", onMessageReceived);
    }

    sendMessage();
  };

  const onError = (err) => {
    console.error(err);
  };

  const onMessageReceived = (payload) => {
    try {
      const responseData = JSON.parse(payload.body);
      if (responseData && responseData.body && responseData.body.data) {
        const updatedPlayers = responseData.body.data;
        setPlayers(updatedPlayers);
        const player = updatedPlayers.find((player) => player.id === playerId);
        actualPlayerRef.current = player;

        setActualLevel(player.lvl);
        setPlayerHealth(player.health);
        setPlayerExp(player.exp);
        setPlayerAlive(player.alive);
        setPlayers(updatedPlayers);
      } else {
        console.error(
          "Nieprawidłowa struktura danych w odpowiedzi:",
          responseData
        );
      }
    } catch (error) {
      console.error("Błąd podczas parsowania danych JSON:", error);
    }
  };

  const updatedEntities = (payload) => {
    try {
      const responseData = JSON.parse(payload.body);

      if (responseData && responseData.body && responseData.body.data) {
        const updatedEntities = responseData.body.data;
        setEntities(updatedEntities);
      } else {
        console.error(
          "Nieprawidłowa struktura danych w odpowiedzi:",
          responseData
        );
      }
    } catch (error) {
      console.error("Błąd podczas parsowania danych JSON:", error);
    }
  };
  /*
  const killEntity = (payload) => {
    try {
      const responseData = JSON.parse(payload.body);
      console.log("kill entity", responseData.body.data);

      if (responseData && responseData.body && responseData.body.data) {
        const updatedUsers = responseData.body.data;
        setPlayers(updatedUsers);
      } else {
        console.error(
          "Nieprawidłowa struktura danych w odpowiedzi:",
          responseData
        );
      }
    } catch (error) {
      console.error("Błąd podczas parsowania danych JSON:", error);
    }
  };*/

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send("/app/connection", {}, JSON.stringify(socketData));
    }
  };

  const getPlayers = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/users`;
      const response = await axios.get(url);
      const players = response.data.data;
      setPlayers(players);
      const player = players.find((player) => player.id === playerId);
      setPlayerPosition({ x: player.x, y: player.y });
      setActualLevel(player.lvl);
      setActualPlayer(player);
      setPlayerHealth(player.health);
      setPlayerExp(player.exp);
      setSocketData({
        playerId: playerId,
        x: player.x,
        y: player.y,
        lvl: player.lvl,
        exp: playerExp,
        online: true,
        health: playerHealth,
      });
    } catch (error) {
      console.error("Error fetching players", error);
    }
  };

  const movePlayer = async (playerId, x, y) => {
    try {
      const checkedX = x < 0 ? 0 : x > 1160 ? 1160 : x;
      const checkedY = y < 0 ? 0 : y > 760 ? 760 : y;
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/users/${playerId}`;
      await axios.put(url, {
        id: playerId,
        x: checkedX,
        y: checkedY,
      });

      setSocketData((prevSocketData) => ({
        ...prevSocketData,
        playerId: playerId,
        x: checkedX,
        y: checkedY,
        lvl: actualLevel,
        exp: playerExp,
        online: true,
        health: playerHealth,
      }));
    } catch (error) {
      console.error("Error fetching players", error);
    }
  };

  useEffect(() => {
    connect();
    getPlayers();
    setEntityXY();
    sendMessage();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    // Wyślij wiadomość na serwer przed zamknięciem okna
    if (stompClient && stompClient.connected) {
      stompClient.send(
        "/app/disconnectPlayer",
        {},
        JSON.stringify({ playerId: playerId, online: false })
      );
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const speed = 40; // Szybkość poruszania się gracza
      const isInputFocused = document.activeElement.tagName === "INPUT";

      if (isInputFocused) {
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (!isMoving) {
            setIsMoving(true);
            if (playerPosition.y <= 0) break;
            setPreviousPlayerPosition(playerPosition);
            setPlayerPosition((prevPos) => ({
              ...prevPos,
              y: prevPos.y - speed,
            }));
            movePlayer(playerId, playerPosition.x, playerPosition.y - speed);
          }
          break;
        case "ArrowDown":
        case "s":
          if (!isMoving) {
            setIsMoving(true);
            if (playerPosition.y >= 760) break;
            setPreviousPlayerPosition(playerPosition);
            setPlayerPosition((prevPos) => ({
              ...prevPos,
              y: prevPos.y + speed,
            }));
            movePlayer(playerId, playerPosition.x, playerPosition.y + speed);
          }
          break;
        case "ArrowLeft":
        case "a":
          if (!isMoving) {
            setIsMoving(true);
            if (playerPosition.x <= 0) break;
            setPreviousPlayerPosition(playerPosition);
            setPlayerPosition((prevPos) => ({
              ...prevPos,
              x: prevPos.x - speed,
            }));
            movePlayer(playerId, playerPosition.x - speed, playerPosition.y);
          }
          break;
        case "ArrowRight":
        case "d":
          if (!isMoving) {
            setIsMoving(true);
            if (playerPosition.x >= 1160) break;
            setPreviousPlayerPosition(playerPosition);
            setPlayerPosition((prevPos) => ({
              ...prevPos,
              x: prevPos.x + speed,
            }));
            movePlayer(playerId, playerPosition.x + speed, playerPosition.y);
          }
          break;
        default:
          break;
      }

      setTimeout(() => {
        setIsMoving(false);
      }, 500); // czas opóźnienia
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isMoving, playerId, playerPosition]);

  useEffect(() => {
    if (playerPosition.x === undefined || playerPosition.y === undefined)
      return;
    movePlayer(playerId, playerPosition.x, playerPosition.y);
    setTimeout(() => {
      checkEntityCollision();
    }, 50);
  }, [playerId, playerPosition]);

  const getEntities = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities`;
      const response = await axios.get(url);
      const entities = response.data.data;
      setEntities(entities);
    } catch (error) {
      console.error("Error fetching entities", error);
    }
  };

  const setEntityXY = async (killedEntityId) => {
    const currentEntity = entities.find(
      (entity) => entity.id === killedEntityId
    );
    if (currentEntity && currentEntity.alive) {
      const gridSize = 40;
      const x = Math.floor(Math.random() * (1200 / gridSize)) * gridSize;
      const y = Math.floor(Math.random() * (800 / gridSize)) * gridSize;
      try {
        const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities/${currentEntity.id}`;
        await axios.put(url, {
          id: currentEntity.id,
          name: currentEntity.name,
          x: x,
          y: y,
          lvl: currentEntity.lvl,
          alive: true,
          respawnTime: currentEntity.respawnTime,
          image: currentEntity.image,
          type: currentEntity.type,
        });
      } catch (error) {
        console.error("Error fetching entities", error);
      }
    }
  };

  const checkEntityCollision = async () => {
    if (entities.length > 0) {
      for (const currentEntity of entities) {
        if (currentEntity.alive === false) continue;
        if (
          playerPosition.x === currentEntity.x &&
          playerPosition.y === currentEntity.y &&
          (previousPlayerPosition.x !== currentEntity.x ||
            previousPlayerPosition.y !== currentEntity.y)
        ) {
          stompClient.send(
            "/app/killEntity",
            {},
            JSON.stringify({ entityId: currentEntity.id, playerId: playerId })
          );
          setEntityXY(currentEntity.id);
        }
      }
    }
  };

  useEffect(() => {
    getEntities();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.baner}></div>
      <div className={styles.chatContainer}>
        {stompClient && actualPlayer.nick && (
          <Chat socket={stompClient} actualPlayerNick={actualPlayer.nick} />
        )}
      </div>
      <GameMap
        players={players}
        entities={entities}
        playerId={playerId}
        playerPosition={playerPosition}
      />
      <div className={styles.userPanelContainer}>
        {stompClient && actualPlayer.nick && (
          <UserPanel
            socket={stompClient}
            actualPlayerNick={actualPlayer.nick}
            actualLevel={actualLevel}
            playerHp={playerHealth}
            playerExp={playerExp}
          />
        )}
      </div>

      <Modal isOpen={playerAlive === false} className={styles.modal_container}>
        <h2>Umarłeś!</h2>
        <button onClick={() => getPlayers()}>Zagraj ponownie za 15s</button>
      </Modal>
    </div>
  );
};

export default Home;
