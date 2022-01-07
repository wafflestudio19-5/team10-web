import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./Discover.module.scss";
import LikeList from "./LikeList/LikeList";
import MostList from "./MostList/MostList";
import NewList from "./NewList/NewList";

const Discover = () => {
  const { userSecret, setUserSecret } = useAuthContext();
  const [likeList, setLikeList] = useState<any>([
    {
      artist: {
        permalink: "",
        display_name: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: -1,
    },
  ]);
  const [likeListId, setLikeListId] = useState([-1]);
  const [mostTrackList, setMostTrackList] = useState([
    {
      title: "",
      image: "",
      id: 999999,
    },
    {
      title: "",
      image: "",
      id: 999998,
    },
    {
      title: "",
      image: "",
      id: 999997,
    },
    {
      title: "",
      image: "",
      id: 999996,
    },
  ]);
  const [newTrackList, setNewTrackList] = useState([
    {
      title: "",
      image: "",
      id: 999999,
    },
    {
      title: "",
      image: "",
      id: 999998,
    },
    {
      title: "",
      image: "",
      id: 999997,
    },
    {
      title: "",
      image: "",
      id: 999996,
    },
    {
      title: "",
      image: "",
      id: 999995,
    },
    {
      title: "",
      image: "",
      id: 999994,
    },
  ]);
  useEffect(() => {
    const checkValid = async () => {
      const jwtToken = localStorage.getItem("jwt_token");
      const permal = localStorage.getItem("permalink");
      await setUserSecret({ jwt: jwtToken, permalink: permal });
    };
    const fetchMostNewList = () => {
      axios.get("/tracks").then((r: any) => {
        const mostList = r.data.results.slice(0, 4);
        const newList = r.data.results.slice(-6);
        setMostTrackList(mostList);
        setNewTrackList(newList);
      });
    };
    checkValid();
    fetchMostNewList();
  }, []);
  useEffect(() => {
    console.log();
    if (likeList !== [] || likeList[0].id !== -1) {
      setLikeListId(likeList.map((item: any) => item.id));
    }
  }, [likeList]);
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchUserId = async () => {
        try {
          await axios
            .get(
              `/resolve?url=https%3A%2F%2Fsoundwaffle.com%2F${userSecret.permalink}`
            )
            .then((r) => {
              const userId = r.data.id;
              axios.get(`/users/${userId}/likes/tracks`).then((res) => {
                setLikeList(res.data.results);
              });
            });
        } catch (error) {
          console.log(error);
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
    <div className={styles.pageWrapper}>
      <div className={styles.box}>
        <div className={styles.main}>
          <div className={styles.most}>
            <div>
              <h2>More of what you like</h2>
              <div>Suggestions based on what you've liked or played</div>
            </div>
            <MostList mostTrackList={mostTrackList} likeListId={likeListId} />
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
              <NewList
                listScroll={listScroll}
                newTrackList={newTrackList}
                likeListId={likeListId}
              />
              {/* 아티스트 프로필이 있어야 가능 */}
            </div>
          </div>
        </div>
        <div className={styles.fluid}>
          <div className={styles.likes}>
            <div className={styles.header}>
              🤍 {likeListId.length} likes
              <button>View all</button>
            </div>
            <LikeList likeList={likeList} />
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
    </div>
  );
};

export default Discover;
