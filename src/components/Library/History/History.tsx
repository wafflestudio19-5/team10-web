import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiClock } from "react-icons/fi";
import { useHistory } from "react-router";
import { useAuthContext } from "../../../context/AuthContext";
import { useTrackContext } from "../../../context/TrackContext";
import ListItem from "../Playlists/ListItem";
import styles from "./History.module.scss";
import HistoryItem from "./HistoryItem";

const History = () => {
  const history = useHistory();
  const goToSomewhere = (sth: string) => {
    history.push(sth);
  };
  const [filterInput, setFilterInput] = useState("");
  const [setList, setSetlist] = useState([
    {
      id: -1,
      permalink: "",
      title: "",
      type: "album",
      is_private: false,
      is_liked: false,
      image: "",
      creator: {
        display_name: "",
        permalink: "",
        id: -1,
        is_followed: false,
      },
      tracks: [
        {
          audio: "",
          image: "",
        },
      ],
    },
  ]);
  const [filteredList, setFilteredList] = useState([
    {
      id: -1,
      permalink: "",
      title: "",
      type: "album",
      is_private: false,
      is_liked: false,
      image: "",
      creator: {
        display_name: "",
        permalink: "",
        id: -1,
        is_followed: false,
      },
      tracks: [
        {
          audio: "",
          image: "",
        },
      ],
    },
  ]);
  const [historyList, setHistoryList] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
      },
      permailink: "",
      title: "",
      is_liked: false,
      is_reposted: false,
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      play_count: 0,
      audio: "",
      image: "",
      id: -1,
      created_at: "",
      tags: [],
      is_private: false,
      audio_length: 0,
    },
  ]);
  const [filteredHistory, setFilteredHistory] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
      },
      permailink: "",
      title: "",
      is_liked: false,
      is_reposted: false,
      repost_count: 0,
      like_count: 0,
      comment_count: 0,
      play_count: 0,
      audio: "",
      image: "",
      id: -1,
      created_at: "",
      tags: [],
      is_private: false,
      audio_length: 0,
    },
  ]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [userImg, setUserImg] = useState("");
  const { userSecret, setUserSecret } = useAuthContext();
  const filter = (e: any) => {
    setFilterInput(e.target.value);
    const newList = setList.filter((item) =>
      item.title.includes(e.target.value)
    );
    const newTracks = historyList.filter((item) =>
      item.title.includes(e.target.value)
    );
    setFilteredList(newList);
    setFilteredHistory(newTracks);
  };
  useEffect(() => {
    const checkValid = async () => {
      if (userSecret.permalink === undefined) {
        const jwtToken = localStorage.getItem("jwt_token");
        const permal = localStorage.getItem("permalink");
        const ID = localStorage.getItem("id");
        await setUserSecret({
          ...userSecret,
          jwt: jwtToken,
          permalink: permal,
          id: ID,
        });
      }
    };
    checkValid();
  }, []);
  const setInitialList = async () => {
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/history/sets?page_size=6`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    })
      .then((res) => {
        setSetlist(res.data.results);
        setFilteredList(res.data.results);
      })
      .catch(() => toast.error("set list를 가져오지 못하였습니다"));
    setFilterInput("");
  };
  const fetchHistoryTracks = async () => {
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/history/tracks?page_size=10`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    })
      .then((res) => {
        setHistoryList(res.data.results);
        setFilteredHistory(res.data.results);
        res.data.next === null
          ? null
          : setNextPage(`users${res.data.next.split("users")[1]}`);
      })
      .catch(() => toast.error("history list를 가져오지 못하였습니다"));
    setFilterInput("");
  };
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchUserId = async () => {
        try {
          setInitialList();
          fetchHistoryTracks();
          axios({
            method: "get",
            url: "/users/me",
            headers: { Authorization: `JWT ${userSecret.jwt}` },
            data: {
              user_id: userSecret.id,
            },
          }).then((res) => {
            setUserImg(res.data.image_profile);
          });
        } catch {
          toast.error("유저 정보 불러오기에 실패하였습니다");
        }
      };
      fetchUserId();
    }
  }, [userSecret]);
  const addHistoryList = () => {
    if (nextPage !== null && historyList.length === filteredHistory.length) {
      axios({
        method: "get",
        url: nextPage,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
        data: {
          user_id: userSecret.id,
        },
      })
        .then((res) => {
          setHistoryList([...historyList, ...res.data.results]);
          setFilteredHistory([...historyList, ...res.data.results]);
          res.data.next === null
            ? setNextPage(null)
            : setNextPage(`users${res.data.next.split("users")[1]}`);
        })
        .catch(() => toast.error("history list 불러오기에 실패하였습니다"));
    }
  };
  const _ = require("lodash");
  const fetchHistoryList = _.throttle(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      addHistoryList();
    }
  }, 500);
  useEffect(() => {
    window.addEventListener("scroll", fetchHistoryList);
    return () => {
      window.removeEventListener("scroll", fetchHistoryList);
    };
  });
  const {
    setTrackIsPlaying,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    trackIsPlaying,
    trackBarPlaylist,
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
  const hitSet = async (set_id: string | number, track_id: string | number) => {
    await axios({
      method: "put",
      url: `tracks/${track_id}/hit?set_id=${set_id}`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    });
  };
  const togglePlayPause = (playlist: any) => {
    // 재생/일시정지 버튼 누를 때
    if (trackBarPlaylist === playlist.tracks) {
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
      setAudioSrc(playlist.tracks[0].audio);
      setTrackIsPlaying(true);
      setTrackBarArtist(playlist.tracks[0].artist);
      setTrackBarTrack(playlist.tracks[0]);
      setTrackBarPlaylist(playlist.tracks);
      audioPlayer.current.src = playlist.tracks[0].audio;
      hitSet(playlist.id, playlist.tracks[0].id);
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      }, 1);
    }
  };
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div
            className={styles.others}
            onClick={() => goToSomewhere("/you/library")}
          >
            Overview
          </div>
          <div
            className={styles.others}
            onClick={() => goToSomewhere("/you/likes")}
          >
            Likes
          </div>
          <div
            className={styles.others}
            onClick={() => goToSomewhere("/you/sets")}
          >
            Playlists
          </div>
          <div
            className={styles.others}
            onClick={() => goToSomewhere("/you/albums")}
          >
            Albums
          </div>

          <div
            className={styles.others}
            onClick={() => goToSomewhere("/you/following")}
          >
            Following
          </div>
          <div className={styles.focus}>History</div>
        </div>

        <div className={styles.recent_played}>
          <div className={styles.listHeader}>
            <div className={styles.headerText}>Recently played sets:</div>
            <div className={styles.filterWrapper}>
              <input
                type="text"
                className={styles.filter}
                placeholder="Filter"
                value={filterInput}
                onChange={filter}
              />
            </div>
          </div>
          <div
            className={
              setList.length === 0 ? styles.noItemsWrapper : styles.itemsWrapper
            }
          >
            {setList.length === 0 ? (
              <div className={styles.noLikeWrapper}>
                <FiClock className={styles.noLike} />
                <div className={styles.text}>
                  You have no listening history of sets yet.
                </div>
                <a href="/discover">Browse trending playlists</a>
              </div>
            ) : (
              filteredList.map((item: any) => (
                <ListItem
                  title={item.title}
                  setImage={item.image}
                  key={item.id}
                  setId={item.id}
                  setPermal={item.permalink}
                  is_private={item.is_private}
                  is_liked={item.is_liked}
                  creator={item.creator.display_name}
                  creatorId={item.creator.id}
                  is_followed={item.creator.is_followed}
                  creatorPermal={item.creator.permalink}
                  togglePlayPause={togglePlayPause}
                  playMusic={playMusic}
                  setInitialList={setInitialList}
                  playlist={item}
                />
              ))
            )}
          </div>
        </div>
        <div className={styles.trackBox}>
          {historyList.length === 0
            ? null
            : filteredHistory.map((item: any) => (
                <HistoryItem
                  key={item.key}
                  historyTrack={item}
                  userImg={userImg}
                  fetchHistoryTracks={fetchHistoryTracks}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default History;
