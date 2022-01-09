import React, { useEffect, useState } from "react";
import styles from "./ListenEngagement.module.scss";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost, BiPencil } from "react-icons/bi";
// import { ImShare } from "react-icons/im";
import { FiLink2 } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { IArtist, ITrack, IUserMe } from "../TrackPage";
import { useHistory } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../../context/AuthContext";

export interface ILikeTrack {
  id: number;
}

const ListenEngagement = ({
  track,
  artist,
  userMe,
  fetchTrack,
  isMyTrack,
  setEditModal,
  fetchReposters,
  fetchLikers,
}: {
  track: ITrack;
  artist: IArtist;
  userMe: IUserMe;
  fetchTrack: () => void;
  isMyTrack: boolean | undefined;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchReposters: () => void;
  fetchLikers: () => void;
}) => {
  const [like, setLike] = useState(false);
  const [repost, setRepost] = useState(false);
  const [likeLoading, setLikeLoading] = useState(true);
  const [repostLoading, setRepostLoading] = useState(true);

  const history = useHistory();
  const { userSecret } = useAuthContext();

  useEffect(() => {
    const isLikeTrack = async () => {
      if (userMe.id !== 0 && track.id !== 0) {
        const config: any = {
          method: "get",
          url: `/users/${userMe.id}/likes/tracks`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          // like 트랙 목록 받아오기
          const likeTracks = await axios(config);
          if (likeTracks.data.results.length === 0) {
            setLikeLoading(false);
          } else {
            const trackExist = likeTracks.data.results.find(
              (likeTrack: ILikeTrack) => likeTrack.id === track.id
            );
            if (trackExist !== undefined) {
              setLike(true);
            }
            setLikeLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
        const repostConfig: any = {
          method: "get",
          url: `/users/${userMe.id}/reposts/tracks`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          // repost 트랙 목록 받아오기
          const repostTracks = await axios(repostConfig);
          if (repostTracks.data.results.length === 0) {
            setRepostLoading(false);
          } else {
            const trackExist = repostTracks.data.results.find(
              (repostTrack: ILikeTrack) => repostTrack.id === track.id
            );
            if (trackExist !== undefined) {
              setRepost(true);
            }
            setRepostLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    isLikeTrack();
  }, [userMe, userSecret]);

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
        fetchLikers();
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
        setLike(false);
        fetchTrack();
        fetchLikers();
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
    try {
      await axios(config);
      setRepost(true);
      fetchTrack();
      fetchReposters();
    } catch (error) {
      console.log(error);
    }
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
    try {
      await axios(config);
      setRepost(false);
      fetchTrack();
      fetchReposters();
    } catch (error) {
      console.log(error);
    }
    return;
  };
  const copyLink = async () => {
    await navigator.clipboard.writeText(location.href);
    toast.success("Link has been copied to the clipboard!", {
      position: "top-right",
    });
  };
  const editTrack = () => {
    setEditModal(true);
  };

  const trackLikes = () =>
    history.push(`/${artist.permalink}/${track.permalink}/likes`);
  const trackReposts = () =>
    history.push(`/${artist.permalink}/${track.permalink}/reposts`);

  return (
    <div className={styles.main}>
      <div className={styles.buttonGroup}>
        {isMyTrack === false && like && (
          <button className={styles.like} onClick={unlikeTrack}>
            <BsSuitHeartFill />
            <span>Liked</span>
          </button>
        )}
        {isMyTrack === false && !like && (
          <button
            className={styles.notLike}
            onClick={likeTrack}
            disabled={likeLoading}
          >
            <BsSuitHeartFill />
            <span>Like</span>
          </button>
        )}
        {isMyTrack === false && repost && (
          <button className={styles.repost} onClick={unrepostTrack}>
            <BiRepost />
            <span>Reposted</span>
          </button>
        )}
        {isMyTrack === false && !repost && (
          <button
            className={styles.notRepost}
            onClick={repostTrack}
            disabled={repostLoading}
          >
            <BiRepost />
            <span>Repost</span>
          </button>
        )}
        {/* <button className={styles.share}>
          <ImShare />
          <span>Share</span>
        </button> */}
        <button className={styles.copyLink} onClick={copyLink}>
          <FiLink2 />
          <span>Copy Link</span>
        </button>
        {/* <button className={styles.more}>
          <FiMoreHorizontal />
          <span>More</span>
        </button> */}
        {isMyTrack === true && (
          <button className={styles.edit} onClick={editTrack}>
            <BiPencil />
            <span>Edit</span>
          </button>
        )}
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
        {isMyTrack === false && (
          <div className={styles.repostStats}>
            <BiRepost />
            <span className={styles.pointer} onClick={trackReposts}>
              {track.repost_count}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListenEngagement;
