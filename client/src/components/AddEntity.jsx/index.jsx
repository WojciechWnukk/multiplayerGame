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
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities`;
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
      </form>
    </div>
  );
};

export default AddEntity;
