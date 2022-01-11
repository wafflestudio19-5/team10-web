import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillAppstore } from "react-icons/ai";
import { BiHeartSquare } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { useHistory } from "react-router";
import { useAuthContext } from "../../../context/AuthContext";
import LikeItem from "./LikeItem";
import styles from "./Likes.module.scss";

const Likes = () => {
  const history = useHistory();
  const goToSomewhere = (sth: string) => {
    history.push(sth);
  };
  const [filterInput, setFilterInput] = useState("");
  const [likeList, setLikeList] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
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
  const [filteredLike, setFilteredLike] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
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
  const [followList, setFollowList] = useState([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const { userSecret, setUserSecret } = useAuthContext();
  const filter = (e: any) => {
    setFilterInput(e.target.value);
    const newList = likeList.filter((item) =>
      item.title.includes(e.target.value)
    );
    setFilteredLike(newList);
  };
  const _ = require("lodash");
  const fetchFollowList = _.throttle(() => {
    const asyncFetchFollwList = async () => {
      await axios.get(`/users/${userSecret.id}/followings`).then((res) => {
        if (res.data.next !== null) {
          let fetchFollowList = res.data.results.map((item: any) => item.id);
          const nextUrl = res.data.next.split("users")[1];
          const recurse = (url: string) => {
            axios.get(`users${url}`).then((r) => {
              if (r.data.next !== null) {
                fetchFollowList = [...fetchFollowList, ...r.data.results];
                const nextUrl = r.data.next.split("users")[1];
                recurse(nextUrl);
              } else {
                fetchFollowList = [...fetchFollowList, ...r.data.results];
                setFollowList(fetchFollowList);
              }
            });
          };
          recurse(nextUrl);
        } else {
          let fetchFollowList = res.data.results.map((item: any) => item.id);
          setFollowList(fetchFollowList);
        }
      });
    };
    asyncFetchFollwList();
  }, 200);
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
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchUserId = async () => {
        try {
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/likes/tracks?page_size=24`,
          }).then((res) => {
            setLikeList(res.data.results);
            setFilteredLike(res.data.results);
            res.data.next === null
              ? null
              : setNextPage(`users${res.data.next.split("users")[1]}`);
          });
          fetchFollowList();
        } catch {
          toast.error("유저 정보 불러오기에 실패하였습니다");
        }
      };
      fetchUserId();
    }
  }, [userSecret]);
  const addLikeList = () => {
    if (nextPage !== null && likeList.length === filteredLike.length) {
      axios({
        method: "get",
        url: nextPage,
      })
        .then((res) => {
          setLikeList([...likeList, ...res.data.results]);
          setFilteredLike([...likeList, ...res.data.results]);
          res.data.next === null
            ? setNextPage(null)
            : setNextPage(`users${res.data.next.split("users")[1]}`);
        })
        .catch(() => toast.error("like list 불러오기에 실패하였습니다"));
    }
  };
  const fetchLikeList = _.throttle(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      addLikeList();
    }
  }, 500);
  useEffect(() => {
    window.addEventListener("scroll", fetchLikeList);
    return () => {
      window.removeEventListener("scroll", fetchLikeList);
    };
  });
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
          <div className={styles.focus}>Likes</div>
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
            onClick={() => goToSomewhere("/you/stations")}
          >
            Stations
          </div>
          <div
            className={styles.others}
            onClick={() => goToSomewhere("/you/following")}
          >
            Following
          </div>
          <div
            className={styles.others}
            onClick={() => goToSomewhere("/you/history")}
          >
            History
          </div>
        </div>
        <div className={styles.recent_played}>
          <div className={styles.listHeader}>
            <div className={styles.headerText}>
              Hear the tracks you’ve liked:
            </div>
            <div className={styles.filterWrapper}>
              <div>View</div>
              <AiFillAppstore className={styles.squareIcon} />
              <FaList className={styles.listIcon} />
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
              likeList.length === 0
                ? styles.noItemsWrapper
                : styles.itemsWrapper
            }
          >
            {likeList.length === 0 ? (
              <div className={styles.noLikeWrapper}>
                <BiHeartSquare className={styles.noLike} />
                <div className={styles.text}>You have no likes yet</div>
                <a href="/discover">Browse trending playlists</a>
              </div>
            ) : (
              filteredLike.map((item: any) => (
                <LikeItem
                  title={item.title}
                  img={item.image}
                  key={item.id}
                  trackId={item.id}
                  artist={item.artist.display_name}
                  artistId={item.artist.id}
                  trackPermal={item.permalink}
                  artistPermal={item.artist.permalink}
                  followList={followList}
                  fetchFollowList={fetchFollowList}
                  setLikeList={setLikeList}
                  setFilteredLike={setFilteredLike}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Likes;
