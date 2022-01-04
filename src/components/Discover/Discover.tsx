import axios from "axios";
import { useEffect, useRef } from "react";
import Cookies from "universal-cookie";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./Discover.module.scss";
import LikeList from "./LikeList/LikeList";
import MostList from "./MostList/MostList";
import NewList from "./NewList/NewList";

const Discover = () => {
  const cookies = new Cookies();
  const { userSecret, setUserSecret } = useAuthContext();
  useEffect(() => {
    const checkValid = async () => {
      const jwtToken = cookies.get("jwt_token");
      const permal = cookies.get("permalink");
      await setUserSecret({ jwt: jwtToken, permalink: permal });
    };
    checkValid();
  }, []);
  useEffect(() => {
    userSecret.permalink === undefined // 나중에 === undefined 로 바꿔야함
      ? null
      : axios.get(`https://api.soundwaffle.com/users/${userSecret.permalink}`);
    // 여기에 permalink가 아니라 해당 url을 통해 아래와 같이 정보를 얻을 수 있음
    //HTTP GET: https://api.soundcloud.com/resolve.json?url=https%3A%2F%2Fsoundcloud.com%2Fmsmrsounds%2Fms-mr-hurricane-chvrches-remix&client_id=[permalink]
  }, [userSecret]);
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
          <LikeList />
        </div>
        <div className={styles.following}>
          <div className={styles.header}>
            📅 following artists
            <button>View all</button>
          </div>
          {/* 이자리에 following artists 리스트 컴포넌트 */}
        </div>
      </div>
    </div>
  );
};

export default Discover;
