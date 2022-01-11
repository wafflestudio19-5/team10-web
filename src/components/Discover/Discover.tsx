import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
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
  const [likeCount, setLikeCount] = useState(0);
  const [mostTrackList, setMostTrackList] = useState([
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999999,
    },
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999998,
    },
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999997,
    },
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999996,
    },
  ]);
  const [newTrackList, setNewTrackList] = useState([
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999999,
    },
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999998,
    },
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999997,
    },
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999996,
    },
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999995,
    },
    {
      title: "",
      image: "",
      permalink: "",
      artist: {
        permalink: "",
      },
      id: 999994,
    },
  ]);
  useEffect(() => {
    const checkValid = async () => {
      const jwtToken = localStorage.getItem("jwt_token");
      const permal = localStorage.getItem("permalink");
      const ID = localStorage.getItem("id");
      await setUserSecret({
        ...userSecret,
        jwt: jwtToken,
        permalink: permal,
        id: ID,
      });
    };
    const fetchMostNewList = () => {
      axios
        .get("/tracks")
        .then((r: any) => {
          const mostList = r.data.results.slice(0, 4);
          const newList = r.data.results.slice(-6);
          setMostTrackList(mostList);
          setNewTrackList(newList);
        })
        .catch(() => toast.error("트랙 정보 불러오기를 실패하였습니다"));
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
            .get(`/users/${userSecret.id}/likes/tracks`)
            .then((res) => {
              setLikeCount(res.data.count);
              setLikeList(res.data.results);
              console.log(res.data);
            });
        } catch {
          toast.error("like list 불러오기를 실패하였습니다");
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
            <MostList
              mostTrackList={mostTrackList}
              likeListId={likeListId}
              setLikeList={setLikeList}
              setLikeCount={setLikeCount}
            />
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
                setLikeList={setLikeList}
                setLikeCount={setLikeCount}
              />
              {/* 아티스트 프로필이 있어야 가능 */}
            </div>
          </div>
        </div>
        <div className={styles.fluid}>
          <div className={styles.likes}>
            <div className={styles.header}>
              🤍 {likeCount} likes
              <button>View all</button>
            </div>
            <LikeList
              likeList={likeList}
              setLikeList={setLikeList}
              setLikeCount={setLikeCount}
            />
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
