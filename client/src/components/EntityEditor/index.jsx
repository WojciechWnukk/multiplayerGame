import { useState } from "react";
import styles from "../Home/styles.module.css";
import axios from "axios";
import Modal from "react-modal";
Modal.setAppElement("#root");

const EntityEditorAction = ({ entityId, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    id: entityId,
    name: "",
    x: 0,
    y: 0,
    lvl: 1,
    alive: true,
    respawnTime: 0,
    image: "",
    type: "monster",
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
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/entities/form/${playerId}`;
      await axios.put(url, formData);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
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

        <button type="submit">Submit</button>
        <button className={styles.btn_close} onClick={() => setIsOpen(false)}>
          close
        </button>
      </form>
    </Modal>
  );
};

export default EntityEditorAction;
