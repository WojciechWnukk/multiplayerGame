import React, { useState } from "react";
import styles from "./styles.module.css";
import EntityEditor from "../EntityEditor";

const GameMap = ({ players, entities, playerId, playerPosition }) => {
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [isEntityEditorOpen, setIsEntityEditorOpen] = useState(false);

  const handleEntityClick = (entityId) => {
    setSelectedEntityId(entityId);
    setIsEntityEditorOpen(true);
  };
  return (
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
                entity.alive === true
                  ? entity.type === "monster"
                    ? styles.entity
                    : styles.npc
                  : styles.entity_disabled
              }
              style={{
                transform: `translate(${entity.x}px, ${entity.y}px)`,
              }}
              onClick={() => handleEntityClick(entity.id)}
            ></div>
          ))
        : null}
      {isEntityEditorOpen && (
        <EntityEditor
          entityId={selectedEntityId}
          isOpen={isEntityEditorOpen}
          setIsOpen={setIsEntityEditorOpen}
        />
      )}
    </div>
  );
};

export default GameMap;
