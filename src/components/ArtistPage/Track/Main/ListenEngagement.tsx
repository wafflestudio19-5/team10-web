import React, { useEffect, useState } from "react";
import styles from "./ListenEngagement.module.scss";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { ImShare } from "react-icons/im";
import { FiLink2, FiMoreHorizontal } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { ITrack } from "../TrackPage";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";

interface ILikeTrack {
  id: number;
}

const ListenEngagement = ({
  track,
  fetchTrack,
}: {
  track: ITrack;
  fetchTrack: () => void;
}) => {
  const [like, setLike] = useState(false);
  const [repost, setRepost] = useState(false);

  const history = useHistory();
  const { userSecret } = useAuthContext();

  useEffect(() => {
    const isLikeTrack = async () => {
      const config: any = {
        method: "get",
        url: `/users/me`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        // 로그인한 유저 id 받아오기
        const response = await axios(config);
        if (response) {
          const config: any = {
            method: "get",
            url: `/users/${response.data.id}/likes/tracks`,
            headers: {
              Authorization: `JWT ${userSecret.jwt}`,
            },
            data: {},
          };
          try {
            // like 트랙 목록 받아오기
            const likeTracks = await axios(config);
            if (likeTracks.data.length === 0) {
              return;
            } else {
              const trackExist = likeTracks.data.find(
                (likeTrack: ILikeTrack) => likeTrack.id === track.id
              );
              if (trackExist !== undefined) {
                setLike(true);
              }
            }
          } catch (error) {
            console.log(error);
          }
          const repostConfig: any = {
            method: "get",
            url: `/users/${response.data.id}/reposts/tracks`,
            headers: {
              Authorization: `JWT ${userSecret.jwt}`,
            },
            data: {},
          };
          try {
            // repost 트랙 목록 받아오기
            const repostTracks = await axios(repostConfig);
            if (repostTracks.data.length === 0) {
              return;
            } else {
              const trackExist = repostTracks.data.find(
                (repostTrack: ILikeTrack) => repostTrack.id === track.id
              );
              if (trackExist !== undefined) {
                setRepost(true);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    isLikeTrack();
  }, []);

  const likeTrack = async () => {
    const config: any = {
      method: "post",
      url: `/likes/tracks/${track.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      if (response) {
        console.log("asdfsadj");
        setLike(true);
        fetchTrack();
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error &&
        error?.response?.status === 401
      ) {
        console.log("asdfasd");
      }
    }
    // axios
    //   .post(config)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  };

  const unlikeTrack = async () => {
    const config: any = {
      method: "delete",
      url: `/likes/tracks/${track.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      if (response) {
        console.log("asdfsadj");
        setLike(false);
        fetchTrack();
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error &&
        error?.response?.status === 401
      ) {
        console.log("asdfasd");
      }
    }
  };
  const repostTrack = async () => {
    console.log(axios.defaults.headers);
    const config: any = {
      method: "post",
      url: `/reposts/tracks/${track.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    const { data } = await axios(config);
    console.log(data);
    setRepost(true);
    fetchTrack();
    return;
  };
  const unrepostTrack = async () => {
    const config: any = {
      method: "delete",
      url: `/reposts/tracks/${track.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    const { data } = await axios(config);
    console.log(data);

    setRepost(false);
    fetchTrack();
    return;
  };
  const copyLink = async () => {
    await navigator.clipboard.writeText(location.href);
    console.log("success");
  };

  const trackLikes = () => history.push(`/username/trackname/likes`);
  const trackReposts = () => history.push(`/username/trackname/reposts`);

  console.log(like);

  return (
    <div className={styles.main}>
      <div className={styles.buttonGroup}>
        {like ? (
          <button className={styles.like} onClick={unlikeTrack}>
            <BsSuitHeartFill />
            <span>Liked</span>
          </button>
        ) : (
          <button className={styles.notLike} onClick={likeTrack}>
            <BsSuitHeartFill />
            <span>Like</span>
          </button>
        )}
        {repost ? (
          <button className={styles.repost} onClick={unrepostTrack}>
            <BiRepost />
            <span>Reposted</span>
          </button>
        ) : (
          <button className={styles.notRepost} onClick={repostTrack}>
            <BiRepost />
            <span>Repost</span>
          </button>
        )}
        <button className={styles.share}>
          <ImShare />
          <span>Share</span>
        </button>
        <button className={styles.copyLink} onClick={copyLink}>
          <FiLink2 />
          <span>Copy Link</span>
        </button>
        <button className={styles.more}>
          <FiMoreHorizontal />
          <span>More</span>
        </button>
      </div>
      <div className={styles.stats}>
        <div className={styles.playStats}>
          <FaPlay />
          <span>{track.count}</span>
        </div>
        <div className={styles.likeStats}>
          <BsSuitHeartFill />
          <span className={styles.pointer} onClick={trackLikes}>
            {track.like_count}
          </span>
        </div>
        <div className={styles.repostStats}>
          <BiRepost />
          <span className={styles.pointer} onClick={trackReposts}>
            {track.repost_count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListenEngagement;
