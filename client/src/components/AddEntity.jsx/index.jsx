import React, { useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";

const AddEntity = () => {
  const [formData, setFormData] = useState({
    name: "",
    x: 0,
    y: 0,
    lvl: 1,
    alive: true,
    respawnTime: 0,
    image: "",
    type: "monster"
  });

  const playerId = localStorage.getItem("playerId");

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
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities/${playerId}`;
      const { formData: res } = await axios.post(url, formData);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Add Entity</h1>
        <label>
          Name:
          <input
            className={styles.input}
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
            className={styles.input}
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
            className={styles.input}
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
            className={styles.input}
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
            className={styles.input}
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
            className={styles.input}
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
            className={styles.input}
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Type:
          <select
            className={styles.input}
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="monster">Monster</option>
            <option value="npc">NPC</option>
          </select>
        </label>
        <br />

        <button className={styles.button} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEntity;
