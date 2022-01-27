import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useTrackContext } from "../../context/TrackContext";
import styles from "./Discover.module.scss";
import FollowingList from "./FollowingList/FollowingList";
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
        id: -1,
        city: "",
        country: "",
      },
      permailink: "",
      title: "",
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      play_count: 0,
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
      is_liked: false,
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
      is_liked: false,
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
      is_liked: false,
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
      is_liked: false,
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
      is_liked: false,
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
      is_liked: false,
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
      is_liked: false,
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
      is_liked: false,
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
      is_liked: false,
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
      is_liked: false,
    },
  ]);
  const [followingList, setFollowingList] = useState([
    {
      id: -1,
      permalink: "",
      display_name: "",
      image_profile: "",
      follower_count: 0,
    },
  ]);
  const {
    setTrackIsPlaying,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    trackIsPlaying,
    trackBarTrack,
    setTrackBarPlaylist,
  } = useTrackContext();
  const playMusic = () => {
    if (trackIsPlaying) {
      audioPlayer.current.play();
      setPlayingTime(audioPlayer.current.currentTime);
    } else {
      audioPlayer.current.pause();
      setPlayingTime(audioPlayer.current.currentTime);
    }
  };
  const history = useHistory();
  const goLikes = () => history.push("/you/likes");
  const goFollowing = () => history.push("/you/following");
  const hitTrack = async (track_id: string | number) => {
    await axios({
      method: "put",
      url: `tracks/${track_id}/hit`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    });
  };
  const togglePlayPause = (track: any, artist: any) => {
    // 재생/일시정지 버튼 누를 때
    if (trackBarTrack.id === track.id) {
      const prevValue = trackIsPlaying;
      setTrackIsPlaying(!prevValue);
      if (!prevValue) {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      } else {
        audioPlayer.current.pause();
        setPlayingTime(audioPlayer.current.currentTime);
      }
    } else {
      setAudioSrc(track.audio);
      setTrackIsPlaying(true);
      setTrackBarArtist(artist);
      setTrackBarTrack(track);
      audioPlayer.current.src = track.audio;
      setTrackBarPlaylist([]);
      hitTrack(track.id);
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      }, 1);
    }
  };
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
    checkValid();
  }, []);
  const _ = require("lodash");
  const fetchFollowList = _.throttle(() => {
    const asyncFetchFollwList = async () => {
      await axios.get(`/users/${userSecret.id}/followings`).then((res) => {
        if (res.data.next !== null) {
          let fetchedFollowList = res.data.results;
          const nextUrl = res.data.next.split("users")[1];
          const recurse = (url: string) => {
            axios.get(`users${url}`).then((r) => {
              if (r.data.next !== null) {
                fetchedFollowList = [...fetchedFollowList, ...r.data.results];
                const nextUrl = r.data.next.split("users")[1];
                recurse(nextUrl);
              } else {
                fetchedFollowList = [...fetchedFollowList, ...r.data.results];
                setFollowingList(fetchedFollowList);
              }
            });
          };
          recurse(nextUrl);
        } else {
          let fetchedFollowList = res.data.results;
          setFollowingList(fetchedFollowList);
        }
      });
    };
    asyncFetchFollwList();
  }, 200);
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchMostNewList = () => {
        axios({
          method: "get",
          url: "/tracks",
          headers: { Authorization: `JWT ${userSecret.jwt}` },
          data: {
            user_id: userSecret.id,
          },
        })
          .then((r: any) => {
            const mostList = r.data.results.slice(0, 4);
            const newList = r.data.results.slice(-6);
            setMostTrackList(mostList);
            setNewTrackList(newList);
          })
          .catch(() => toast.error("트랙 정보 불러오기를 실패하였습니다"));
      };
      const fetchUserId = async () => {
        try {
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/likes/tracks`,
            headers: { Authorization: `JWT ${userSecret.jwt}` },
            data: {
              user_id: userSecret.id,
            },
          }).then((res) => {
            setLikeCount(res.data.count);
            setLikeList(res.data.results);
          });
          fetchFollowList();
        } catch {
          toast.error("like list 불러오기를 실패하였습니다");
        }
      };
      fetchMostNewList();
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
              setLikeList={setLikeList}
              setLikeCount={setLikeCount}
              togglePlayPause={togglePlayPause}
              playMusic={playMusic}
            />
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
                setLikeList={setLikeList}
                setLikeCount={setLikeCount}
                togglePlayPause={togglePlayPause}
                playMusic={playMusic}
              />
            </div>
          </div>
        </div>
        <div className={styles.fluid}>
          <div className={styles.likes}>
            <div className={styles.header}>
              🤍 {likeCount} likes
              <button onClick={goLikes}>View all</button>
            </div>
            <LikeList
              likeList={likeList}
              setLikeList={setLikeList}
              setLikeCount={setLikeCount}
              togglePlayPause={togglePlayPause}
              playMusic={playMusic}
              setNewTrackList={setNewTrackList}
              setMostTrackList={setMostTrackList}
            />
          </div>
          <div className={styles.following}>
            <div className={styles.header}>
              📅 following artists
              <button onClick={goFollowing}>View all</button>
            </div>
            <FollowingList
              followingList={followingList}
              fetchFollowList={fetchFollowList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
