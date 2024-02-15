import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import HealthBar from "../HealthBar";
const UserPanel = ({ socket, actualPlayerNick, actualLevel, playerHp }) => {
  const playerId = localStorage.getItem("playerId");

  return (
    <div className={styles.userPanelContainer}>
      <div className={styles.userData}>
        <h2>
          {actualPlayerNick} {actualLevel}lvl <br />
          <HealthBar hp={playerHp} />
        </h2>
      </div>
      <div className={styles.userInventory}></div>
      <div className={styles.userBag}></div>
      <div className={styles.footer}>
        <div
          className={styles.btn_logout}
          onClick={() => {
            localStorage.removeItem("playerId");
            window.location = "/login";
          }}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
