import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
const UserPanel = ({ socket, actualPlayerNick, actualLevel }) => {
    const playerId = localStorage.getItem('playerId');

    return (
        <div className={styles.userPanelContainer}> 
            <div className={styles.userData}>
                <h2>{actualPlayerNick} {actualLevel}lvl</h2>
            </div>
            <div className={styles.userInventory}>
            
            </div>
            <div className={styles.userBag}>

            </div>

        </div>
    );
};

export default UserPanel;
