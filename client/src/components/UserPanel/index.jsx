import React from "react";
import styles from "./styles.module.css";
import HealthBar from "../HealthBar";
import ExpBar from "../ExpBar";
const UserPanel = ({
  actualPlayerNick,
  actualLevel,
  playerHp,
  playerExp,
}) => {
  return (
    <div className={styles.userPanelContainer}>
      <div className={styles.userData}>
        <h2>
          {actualPlayerNick} {actualLevel}lvl <br />
          <HealthBar hp={playerHp} />
          <ExpBar exp={playerExp} />
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
