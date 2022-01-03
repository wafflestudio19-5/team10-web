import axios from "axios";
import { useEffect, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./Discover.module.scss";
import LikeList from "./LikeList/LikeList";
import MostList from "./MostList/MostList";
import NewList from "./NewList/NewList";

const Discover = () => {
  const { userSecret, setUserSecret } = useAuthContext();
  useEffect(() => {
    const checkValid = async () => {
      const jwtToken = localStorage.getItem("jwt_token");
      const permal = localStorage.getItem("permalink");
      await setUserSecret({ jwt: jwtToken, permalink: permal });
    };
    checkValid();
  }, []);
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchUserId = async () => {
        try {
          await axios.get(
            `/resolve?url=https%3A%2F%2Fsoundwaffle.com%2F${userSecret.permalink}`
          );
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            const linkParts = error.response.data.link.split(
              "api.soundwaffle.com/"
            );
            try {
              const response = await axios.get(`/${linkParts[1]}`);
              console.log(response);
            } catch (e) {
              console.log(e);
            }
          }
        }
      };
      fetchUserId();
    }
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
