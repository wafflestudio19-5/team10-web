import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillAppstore } from "react-icons/ai";
import { FaUserSlash } from "react-icons/fa";
import { useHistory } from "react-router";
import { useAuthContext } from "../../../context/AuthContext";
import Follower from "./Follower";
import styles from "./Following.module.scss";

const Following = () => {
  const history = useHistory();
  const goToSomewhere = (sth: string) => {
    history.push(sth);
  };
  const [filterInput, setFilterInput] = useState("");
  const [followerList, setFollowerList] = useState([
    {
      id: -1,
      permalink: "",
      display_name: "",
      image_profile: "",
      follower_count: 0,
    },
  ]);
  const [filteredList, setFilteredList] = useState([
    {
      id: -1,
      permalink: "",
      display_name: "",
      image_profile: "",
      follower_count: 0,
    },
  ]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const { userSecret, setUserSecret } = useAuthContext();
  const filter = (e: any) => {
    setFilterInput(e.target.value);
    const newList = followerList.filter((item) =>
      item.display_name.includes(e.target.value)
    );
    setFilteredList(newList);
  };
  const _ = require("lodash");
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
  const fetchFollowingList = async () => {
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/followings?page_size=24`,
    }).then((res) => {
      setFollowerList(res.data.results);
      setFilteredList(res.data.results);
      res.data.next === null
        ? null
        : setNextPage(`users${res.data.next.split("users")[1]}`);
    });
  };
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchUserId = async () => {
        try {
          fetchFollowingList();
        } catch {
          toast.error("유저 정보 불러오기에 실패하였습니다");
        }
      };
      fetchUserId();
    }
  }, [userSecret]);
  const addFollowerList = () => {
    if (nextPage !== null && followerList.length === filteredList.length) {
      axios({
        method: "get",
        url: nextPage,
      })
        .then((res) => {
          setFollowerList([...followerList, ...res.data.results]);
          setFilteredList([...followerList, ...res.data.results]);
          res.data.next === null
            ? setNextPage(null)
            : setNextPage(`users${res.data.next.split("users")[1]}`);
        })
        .catch(() => toast.error("follower list 불러오기에 실패하였습니다"));
    }
  };
  const fetchFollowerList = _.throttle(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      addFollowerList();
    }
  }, 500);
  useEffect(() => {
    window.addEventListener("scroll", fetchFollowerList);
    return () => {
      window.removeEventListener("scroll", fetchFollowerList);
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

          <div className={styles.focus}>Following</div>
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
              Hear what the people you follow have posted:
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
              followerList.length === 0
                ? styles.noItemsWrapper
                : styles.itemsWrapper
            }
          >
            {followerList.length === 0 ? (
              <div className={styles.noLikeWrapper}>
                <FaUserSlash className={styles.noLike} />
                <div className={styles.text}>
                  You aren’t following anyone yet
                </div>
                <a href="/discover">Browse trending playlists</a>
              </div>
            ) : (
              filteredList.map((item: any) => (
                <Follower
                  img={item.image_profile}
                  key={item.id}
                  id={item.id}
                  display_name={item.display_name}
                  permalink={item.permalink}
                  follower_count={item.follower_count}
                  followerList={followerList}
                  fetchFollowingList={fetchFollowingList}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Following;
