import styles from "./Discover.module.scss";

const Discover = () => {
  return (
    <div className={styles.box}>
      <div className={styles.main}>
        <div className={styles.most}>
          <div>
            <h2>More of what you like</h2>
            <div>Suggestions based on what you've liked or played</div>
          </div>
          <div>Slider</div>
        </div>
        <div className={styles.recent}>
          <h2>Recently Played</h2>
          <div>Slider</div>
        </div>
      </div>
      <div className={styles.fluid}>
        <div className={styles.likes}>
          <div className={styles.header}>
            🤍 12 likes
            <button>View all</button>
          </div>
          {/* 이자리에 like 리스트 컴포넌트 */}
        </div>
        <div className={styles.history}>
          <div className={styles.header}>
            📅 Listening history
            <button>View all</button>
          </div>
          {/* 이자리에 Listening history 리스트 컴포넌트 */}
        </div>
      </div>
    </div>
  );
};

export default Discover;
