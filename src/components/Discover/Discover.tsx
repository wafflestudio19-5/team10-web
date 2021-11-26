import { useRef } from "react";
import styles from "./Discover.module.scss";
import MostList from "./MostList/MostList";
import NewList from "./NewList/NewList";

const Discover = () => {
  const listScroll = useRef<HTMLDivElement>(null);
  const rightButton = useRef<HTMLButtonElement>(null);
  const leftButton = useRef<HTMLButtonElement>(null);
  const handleScrollRight = () => {
    listScroll.current?.scrollTo({
      top: 350,
      left: 340,
      behavior: "smooth",
    });
    console.log(listScroll.current?.scrollLeft);
  };
  const handleScrollLeft = () => {
    listScroll.current?.scrollTo({
      top: 350,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.box}>
      <div className={styles.main}>
        <div className={styles.most}>
          <div>
            <h2>More of what you like</h2>
            <div>Suggestions based on what you've liked or played</div>
          </div>
          <MostList />
          {/* 아티스트 프로필이 있어야 가능 */}
        </div>
        <div className={styles.new}>
          <h2>New tracks</h2>
          <div>
            <button
              className={styles.left}
              ref={leftButton}
              onClick={handleScrollLeft}
            >
              &lt;
            </button>
            <button
              className={styles.right}
              ref={rightButton}
              onClick={handleScrollRight}
            >
              &gt;
            </button>
            <NewList listScroll={listScroll} />
            {/* 아티스트 프로필이 있어야 가능 */}
          </div>
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
