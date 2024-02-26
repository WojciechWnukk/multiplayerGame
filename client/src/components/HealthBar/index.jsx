import styles from "./styles.module.css";

const HealthBarAction = ({ maxHp = 100, hp }) => {
  const barWidth = (hp / maxHp) * 100;
  return (
    <div>
      <div className={styles.health_bar}>
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
          {hp}%
        </div>
      </div>
    </div>
  );
};

export default function HealthBar({ hp }) {
  return (
    <div className={styles.App}>
      <HealthBarAction hp={hp} />
    </div>
  );
}
