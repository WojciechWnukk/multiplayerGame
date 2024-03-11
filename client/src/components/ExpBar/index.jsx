import styles from "./styles.module.css";

const ExpBarAction = ({ maxExp = 100, exp }) => {
  const barWidth = (exp / maxExp) * 100;
  return (
    <div>
      <div className={styles.exp_bar}>
        <div className={styles.bar} style={{ width: `${barWidth}%` }}></div>
        <div className={styles.hit} style={{ width: `${0}%` }}></div>
        <div
          style={{
            top: "5px",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: "12px",
          }}
        >
          {exp}%
        </div>
      </div>
    </div>
  );
};

export default function ExpBar({ exp }) {
  return (
    <div className={styles.App}>
      <ExpBarAction exp={exp} />
    </div>
  );
}
