import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { useTrackContext } from "../../context/TrackContext";
import styles from "./Discover.module.scss";
import LikeList from "./LikeList/LikeList";
import MostList from "./MostList/MostList";
import NewList from "./NewList/NewList";
import throttle from "lodash/throttle";

const Discover = () => {
  const { userSecret, setUserSecret } = useAuthContext();
  const [likeList, setLikeList] = useState<any>([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
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
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
  ]);
  const [likeListId, setLikeListId] = useState([-1]);
  const [likeCount, setLikeCount] = useState(0);
  const [mostTrackList, setMostTrackList] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999999,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999998,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999997,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999996,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
  ]);
  const [newTrackList, setNewTrackList] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999999,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999998,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999997,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999996,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999995,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      count: 0,
      audio: "",
      image: "",
      id: 999994,
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
  ]);
  const {
    setTrackIsPlaying,
    playingTime,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    trackIsPlaying,
    trackBarTrack,
  } = useTrackContext();
  const animationRef = useRef(0); // 재생 애니메이션
  const playMusic = () => {
    if (trackIsPlaying) {
      audioPlayer.current.play();
      setPlayingTime(audioPlayer.current.currentTime);
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      setPlayingTime(audioPlayer.current.currentTime);
      cancelAnimationFrame(animationRef.current);
    }
  };
  const togglePlayPause = (track: any, artist: any) => {
    // 재생/일시정지 버튼 누를 때
    if (trackBarTrack.id === track.id) {
      const prevValue = trackIsPlaying;
      setTrackIsPlaying(!prevValue);
      if (!prevValue) {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
        animationRef.current = requestAnimationFrame(whilePlaying);
      } else {
        audioPlayer.current.pause();
        setPlayingTime(audioPlayer.current.currentTime);
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setAudioSrc(track.audio);
      setTrackIsPlaying(true);
      setTrackBarArtist(artist);
      setTrackBarTrack(track);
      audioPlayer.current.src = track.audio;
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      }, 1);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };
  const whilePlaying = () => {
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };
  const changePlayerCurrentTime = useCallback(
    throttle(() => {
      setPlayingTime(audioPlayer.current.currentTime);
    }, 30000),
    [playingTime]
  );
  changePlayerCurrentTime();
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
              togglePlayPause={togglePlayPause}
              playMusic={playMusic}
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
                togglePlayPause={togglePlayPause}
                playMusic={playMusic}
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
              togglePlayPause={togglePlayPause}
              playMusic={playMusic}
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
