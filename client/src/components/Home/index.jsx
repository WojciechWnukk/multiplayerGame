import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import Chat from "../Chat";
import UserPanel from "../UserPanel";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import Modal from "react-modal";
Modal.setAppElement("#root");
var stompClient = null;
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
  const [socket, setSocket] = useState(null);
  const actualPlayerRef = useRef(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [entityId, setEntityId] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(1);
  const [playerExp, setPlayerExp] = useState(1);
  const [playerAlive, setPlayerAlive] = useState();

  const connect = () => {
    let socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    setSocket(socket);
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
    console.log(err);
  };

  const onMessageReceived = (payload) => {
    try {
      const responseData = JSON.parse(payload.body);
      if (responseData && responseData.body && responseData.body.data) {
        const updatedPlayers = responseData.body.data;
        setPlayers(updatedPlayers);
        const player = updatedPlayers.find((player) => player.id === playerId);
        console.log("player", player);
        actualPlayerRef.current = player;

        setActualLevel(player.lvl);
        setPlayerHealth(player.health);
        setPlayerExp(player.exp);
        setPlayerAlive(player.alive);
        setPlayers(updatedPlayers);
      } else {
        console.error(
          "Nieprawidłowa struktura danych w odpowiedzi:",
          responseData,
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
        console.log(updatedEntities);
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
    console.log(socketData);
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

      console.log("Gram na ", player);
    } catch (error) {
      console.log("Error fetching players", error);
    }
  };

  const movePlayer = async (playerId, x, y) => {
    try {
      const checkedX = x < 0 ? 0 : x > 1160 ? 1160 : x;
      const checkedY = y < 0 ? 0 : y > 760 ? 760 : y;
      console.log("Move player", playerId, checkedX, checkedY);
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/users/${playerId}`;
      const response = await axios.put(url, {
        id: playerId,
        x: checkedX,
        y: checkedY,
      });
      const player = response.data.data;
      console.log(player);

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
      console.log("Data" + socketData);
    } catch (error) {
      console.log("Error fetching players", error);
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

      if (isInputFocused || modalIsOpen) {
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
      }, 500); // Tutaj możesz dostosować czas opóźnienia
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
      console.log("Entities", entities);
      setEntities(entities);
    } catch (error) {
      console.log("Error fetching entities", error);
    }
  };

  const setEntityXY = async (killedEntityId) => {
    const currentEntity = entities.find(
      (entity) => entity.id === killedEntityId
    );
    console.log("Current", currentEntity);
    if (currentEntity && currentEntity.alive) {
      console.log("Enitity is alive");
      const gridSize = 40;
      const x = Math.floor(Math.random() * (1200 / gridSize)) * gridSize;
      const y = Math.floor(Math.random() * (800 / gridSize)) * gridSize;
      try {
        const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities/${currentEntity.id}`;
        const response = await axios.put(url, {
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
        const entity = response.data.data;
        console.log(entity);
      } catch (error) {
        console.log("Error fetching entities", error);
      }
    }
  };

  const checkEntityCollision = async () => {
    if (entities.length > 0) {
      for (const currentEntity of entities) {
        if (currentEntity.alive === false) continue;
        console.log(
          playerPosition.x,
          currentEntity.x,
          playerPosition.y,
          currentEntity.y
        );
        if (
          playerPosition.x === currentEntity.x &&
          playerPosition.y === currentEntity.y &&
          (previousPlayerPosition.x !== currentEntity.x ||
            previousPlayerPosition.y !== currentEntity.y)
        ) {
          //zabijanie przez websocket

          console.log("Entity killed");
          stompClient.send(
            "/app/killEntity",
            {},
            JSON.stringify({ entityId: currentEntity.id, playerId: playerId })
          );
          console.log("Entity killed", currentEntity.id);
          setEntityXY(currentEntity.id);
        }
      }
    }
  };

  const handleEntityClick = () => {
    setIsOpen(true);
  };

  const [formData, setFormData] = useState({
    name: " ",
    x: 0,
    y: 0,
    lvl: 1,
    alive: true,
    respawnTime: 0,
    image: " ",
    type: "monster",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities/form/${playerId}`;
      const { formData: res } = await axios.put(url, formData);
      console.log(res);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
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
      <div className={styles.map}>
        {players
          ? players.map((player) => (
              <div
                key={player.id}
                className={
                  player.online === true && player.alive === true
                    ? styles.player
                    : styles.player_disabled
                }
                style={{
                  transform: `translate(${
                    player.id === playerId ? playerPosition.x : player.x
                  }px, ${
                    player.id === playerId ? playerPosition.y : player.y
                  }px)`,
                  transition: "transform 0.1s ease-in-out",
                }}
                title={`Poziom gracza ${player.nick}: ${player.lvl}lvl`}
              ></div>
            ))
          : null}
        {entities.length > 0
          ? entities.map((entity, index) => (
              <div
                key={`entity-${index}`}
                className={
                  entity.alive === true ? (entity.type==="monster" ? styles.entity : styles.npc) : styles.entity_disabled
                }
                style={{
                  transform: `translate(${entity.x}px, ${entity.y}px)`,
                }}
                onClick={() => {
                  setEntityId(entity.id);
                  handleEntityClick();
                  setFormData(entity);
                }}
              ></div>
            ))
          : null}
      </div>
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Modal"
        className={styles.modal_container}
      >
        <h2 className={styles.modal_title}>Edit Entity {entityId}</h2>
        <form className={styles.modal_form} onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            X:
            <input
              type="number"
              name="x"
              value={formData.x}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Y:
            <input
              type="number"
              name="y"
              value={formData.y}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Level:
            <input
              type="number"
              name="lvl"
              value={formData.lvl}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Alive:
            <input
              type="checkbox"
              name="alive"
              checked={formData.alive}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Respawn Time:
            <input
              type="number"
              name="respawnTime"
              value={formData.respawnTime}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Image:
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </label>
          <br />

          <button type="submit">Submit</button>
          <button className={styles.btn_close} onClick={() => setIsOpen(false)}>
            close
          </button>
        </form>
      </Modal>

      <Modal
      isOpen={playerAlive === false}
      className={styles.modal_container}
      >
        <h2>Umarłeś!</h2>
        <button onClick={() => getPlayers()}>Zagraj ponownie za 15s</button>
      </Modal>
    </div>
  );
};

export default Home;
