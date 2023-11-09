import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import styles from "./styles.module.css"
const Signup = () => {
    const [data, setData] = useState({
        nick: "",
        email: "",
        password: "",
        lvl: 1,
        x: 0,
        y: 0,
        online: true
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/users`
            const { data: res } = await axios.post(url, data)
            console.log("tutaj wchodzi", res)
            localStorage.setItem("playerId", res) //nie wiem jak wysyłać dane z backendu do frontendu jako całość
            navigate("/login")
            console.log("res" + res.message)

        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
            }
        }
    }

/*
    const newPlayer = () => {
        axios.post('http://localhost:8080/api/players', {
            name: 'New Player 2',
            x: 0,
            y: 0,
            online: true
        })
            .then((response) => {
                console.log(response);
                const newPlayerId = response.data.data._id;
                setPlayerId(newPlayerId);
                getPlayers();
            })
            .catch((error) => {
                console.log(error);
            });
    }*/

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Witamy ponownie</h1>
                    <Link to="/login">
                        <button type="button"
                            className={styles.white_btn}>
                            Zaloguj się
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container}
                        onSubmit={handleSubmit}>
                        <h1>Utwórz konto</h1>
                        <input
                            type="text"
                            placeholder="nick"
                            name="nick"
                            onChange={handleChange}
                            value={data.nick}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Hasło"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {error && <div
                            className={styles.error_msg}>{error}</div>}
                        <button type="submit"
                            className={styles.green_btn}>
                            Zarejestruj
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Signup