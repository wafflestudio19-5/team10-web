import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillAppstore } from "react-icons/ai";
import { RiPlayListAddFill } from "react-icons/ri";
import { useHistory } from "react-router";
import { useAuthContext } from "../../../context/AuthContext";
import { useTrackContext } from "../../../context/TrackContext";
import ListItem from "./ListItem";
import styles from "./Playlists.module.scss";

interface IPage {
  like: null | string;
  creator: null | string;
}

const Playlists = () => {
  const history = useHistory();
  const goToSomewhere = (sth: string) => {
    history.push(sth);
  };
  const [filterInput, setFilterInput] = useState("");
  const [nextPage, setNextPage] = useState<IPage>({
    like: null,
    creator: null,
  });
  const [playlist, setPlaylist] = useState([
    {
      id: -1,
      permailink: "",
      title: "",
      type: "playlist",
      is_private: false,
      is_liked: false,
      image: "",
      creator: {
        display_name: "",
        permailink: "",
        id: -1,
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
      permailink: "",
      title: "",
      type: "playlist",
      is_private: false,
      is_liked: false,
      image: "",
      creator: {
        display_name: "",
        permailink: "",
        id: -1,
      },
      tracks: [
        {
          audio: "",
          image: "",
        },
      ],
    },
  ]);
  const [followList, setFollowList] = useState([]);
  const { userSecret, setUserSecret } = useAuthContext();
  const filter = (e: any) => {
    setFilterInput(e.target.value);
    const newList = playlist.filter((item) =>
      item.title.includes(e.target.value)
    );
    setFilteredList(newList);
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
    let newNextPage: IPage = {
      like: null,
      creator: null,
    };
    let newList: any = [];
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/sets?page_size=24`,
    }).then((res) => {
      newList = res.data.results.filter(
        (item: any) => item.type === "playlist"
      );
      res.data.next === null
        ? null
        : (newNextPage = {
            ...newNextPage,
            creator: `users${res.data.next.split("users")[1]}`,
          });
    });
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/likes/sets?page_size=24`,
    }).then((res) => {
      newList = [
        ...newList,
        res.data.results.filter((item: any) => item.type === "playlist"),
      ];
      res.data.next === null
        ? null
        : (newNextPage = {
            ...newNextPage,
            like: `users${res.data.next.split("users")[1]}`,
          });
    });
    const arrUnique = newList.filter((character: any, idx: any, arr: any) => {
      return arr.findIndex((item: any) => item.id === character.id) === idx;
    });
    setNextPage(newNextPage);
    setPlaylist(arrUnique);
    setFilteredList(arrUnique);
  };
  const _ = require("lodash");
  const fetchFollowList = _.throttle(() => {
    const asyncFetchFollwList = async () => {
      await axios.get(`/users/${userSecret.id}/followings`).then((res) => {
        if (res.data.next !== null) {
          let fetchedFollowList = res.data.results.map((item: any) => item.id);
          const nextUrl = res.data.next.split("users")[1];
          const recurse = (url: string) => {
            axios.get(`users${url}`).then((r) => {
              if (r.data.next !== null) {
                fetchedFollowList = [...fetchedFollowList, ...r.data.results];
                const nextUrl = r.data.next.split("users")[1];
                recurse(nextUrl);
              } else {
                fetchedFollowList = [...fetchedFollowList, ...r.data.results];
                setFollowList(fetchedFollowList);
              }
            });
          };
          recurse(nextUrl);
        } else {
          let fetchedFollowList = res.data.results.map((item: any) => item.id);
          setFollowList(fetchedFollowList);
        }
      });
    };
    asyncFetchFollwList();
  }, 200);
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchUserId = async () => {
        try {
          setInitialList();
          fetchFollowList();
        } catch {
          toast.error("유저 정보 불러오기에 실패하였습니다");
        }
      };
      fetchUserId();
    }
  }, [userSecret]);
  const addPlaylist = () => {
    if (playlist.length === filteredList.length) {
      let newNextPage: IPage = {
        like: null,
        creator: null,
      };
      let newList: any = playlist;
      if (
        nextPage ===
        {
          like: null,
          creator: null,
        }
      ) {
        return;
      }
      if (nextPage.like !== null) {
        axios({
          method: "get",
          url: nextPage.like,
        })
          .then((res) => {
            newList = [
              ...newList,
              ...res.data.results.filter(
                (item: any) => item.type === "playlist"
              ),
            ];
            res.data.next === null
              ? (newNextPage.like = null)
              : (newNextPage.like = `users${res.data.next.split("users")[1]}`);
          })
          .catch(() => toast.error("like list 불러오기에 실패하였습니다"));
      }
      if (nextPage.creator !== null) {
        axios({
          method: "get",
          url: nextPage.creator,
        })
          .then((res) => {
            newList = [
              ...newList,
              ...res.data.results.filter(
                (item: any) => item.type === "playlist"
              ),
            ];
            res.data.next === null
              ? (newNextPage.creator = null)
              : (newNextPage.creator = `users${
                  res.data.next.split("users")[1]
                }`);
          })
          .catch(() => toast.error("like list 불러오기에 실패하였습니다"));
      }
      const arrUnique = newList.filter((character: any, idx: any, arr: any) => {
        return arr.findIndex((item: any) => item.id === character.id) === idx;
      });
      setNextPage(newNextPage);
      setPlaylist(arrUnique);
      setFilteredList(arrUnique);
    }
  };
  const fetchPlaylist = _.throttle(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      addPlaylist();
    }
  }, 500);
  useEffect(() => {
    window.addEventListener("scroll", fetchPlaylist);
    return () => {
      window.removeEventListener("scroll", fetchPlaylist);
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
          <div className={styles.focus}>Playlists</div>
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
        </div>
        <div className={styles.recent_played}>
          <div className={styles.listHeader}>
            <div className={styles.headerText}>
              Hear your own playlists and the playlists you’ve liked:
            </div>
            <div className={styles.filterWrapper}>
              <div>View</div>
              <AiFillAppstore className={styles.squareIcon} />
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
              playlist.length === 0
                ? styles.noItemsWrapper
                : styles.itemsWrapper
            }
          >
            {playlist.length === 0 ? (
              <div className={styles.noLikeWrapper}>
                <RiPlayListAddFill className={styles.noLike} />
                <div className={styles.text}>You have no playlists yet</div>
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
                  creatorPermal={item.creator.permailink}
                  togglePlayPause={togglePlayPause}
                  playMusic={playMusic}
                  setInitialList={setInitialList}
                  playlist={item}
                  fetchFollowList={fetchFollowList}
                  followList={followList}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlists;
