import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart } from "react-icons/ai";
import { BiLock } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useTrackContext } from "../../../context/TrackContext";
import styles from "./ListItem.module.scss";

const ListItem = ({
  title,
  setImage,
  setId,
  setPermal,
  is_private,
  is_liked,
  creator,
  creatorId,
  creatorPermal,
  togglePlayPause,
  playMusic,
  setInitialList,
  playlist,
  fetchFollowList,
  followList,
}: any) => {
  const history = useHistory();
  const goSet = () => {
    history.push(`/${creatorPermal}/sets/${setPermal}`);
  };
  const goArtist = () => {
    history.push(`/${creatorPermal}`);
  };
  const [play, setPlay] = useState(false);
  const [heart, setHeart] = useState(true);
  const [follow, setFollow] = useState<boolean | string>(false);
  const { userSecret } = useAuthContext();
  const { trackIsPlaying, trackBarPlaylist } = useTrackContext();
  const handlePlay = (e: any) => {
    e.stopPropagation();
    togglePlayPause(playlist);
    trackBarPlaylist === playlist.tracks
      ? setPlay(!trackIsPlaying)
      : setPlay(true);
  };
  useEffect(() => {
    trackBarPlaylist === playlist.tracks ? null : setPlay(false);
  }, [trackBarPlaylist]);
  const moveWeb = async () => {
    setPlay(true);
  };
  useEffect(() => {
    trackBarPlaylist === playlist.tracks
      ? moveWeb().then(() => playMusic())
      : null;
  }, []);
  useEffect(() => {
    trackBarPlaylist === playlist.tracks ? setPlay(trackIsPlaying) : null;
  }, [trackIsPlaying]);
  useEffect(() => {
    setHeart(is_liked);
  }, [is_liked]);
  const handleHeart = async (e: any) => {
    e.stopPropagation();
    if (heart === false) {
      await axios({
        method: "post",
        url: `/likes/sets/${setId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast("like에 실패하였습니다"));
      setHeart(!heart);
    } else {
      await axios({
        method: "delete",
        url: `/likes/tracks/${setId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast("like에 실패하였습니다"));
      setHeart(!heart);
    }
    setInitialList();
  };
  const handleFollow = async (e: any) => {
    e.stopPropagation();
    if (follow === false) {
      await axios({
        method: "post",
        url: `/users/me/followings/${creatorId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("팔로우에 실패하였습니다"));
      setFollow(!follow);
    } else {
      await axios({
        method: "delete",
        url: `/users/me/followings/${creatorId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("팔로우에 실패하였습니다"));
      setFollow(!follow);
    }
    fetchFollowList();
  };
  const clickDots = (e: any) => {
    e.stopPropagation();
    toast.error("아직 구현되지 않은 기능입니다");
  };
  useEffect(() => {
    if (followList.length !== 0) {
      creatorId === userSecret.id
        ? setFollow("no")
        : followList.includes(creatorId)
        ? setFollow(true)
        : setFollow(false);
    }
  }, [followList]);
  return (
    <div className={styles.wrapper}>
      {setImage === null ? (
        playlist.tracks[0].image === null ? (
          <svg
            className={styles.track}
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="155.294"
              y="155.294"
              width="64.7059"
              height="64.7059"
              fill="#ED8573"
            />
            <rect
              x="64.7059"
              y="155.294"
              width="64.7059"
              height="64.7059"
              fill="#F0975E"
            />
            <rect
              x="155.294"
              y="64.7059"
              width="64.7059"
              height="64.7059"
              fill="#F0975E"
            />
            <rect
              x="64.7059"
              y="64.7059"
              width="64.7059"
              height="64.7059"
              fill="#F0975E"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M64.7059 0H38.8236V38.8235H0V64.7059H38.8236V129.412H0V155.294H38.8236V220H64.7059V155.294H129.412V220H155.294V155.294H220V129.412H155.294V64.7059H220V38.8235H155.294V0H129.412V38.8235H64.7059V0ZM129.412 129.412V64.7059H64.7059V129.412H129.412Z"
              fill="#27181D"
            />
          </svg>
        ) : (
          <img
            src={playlist.tracks[0].image}
            alt="track img"
            className={styles.track}
          />
        )
      ) : (
        <img src={setImage} alt="track img" className={styles.track} />
      )}
      <Link className={styles.link} to={`/${creatorPermal}/sets/${setPermal}`}>
        {is_private ? (
          <BiLock className={styles.titleHeart} />
        ) : heart ? (
          <AiFillHeart className={styles.titleHeart} />
        ) : null}
        &nbsp;{title}
      </Link>
      <div className={styles.artist} onClick={goArtist}>
        {creator}
      </div>
      <div className={styles.hover} onClick={goSet}>
        {play ? (
          <div className={styles.buttonWraaper} onClick={handlePlay}>
            <IoMdPause className={styles.playButton} />
            <div className={styles.functions}>
              {is_private ? null : (
                <AiFillHeart
                  className={heart ? styles.liked : styles.like}
                  onClick={handleHeart}
                />
              )}

              {follow === "no" ? null : follow ? (
                <FaUserCheck className={styles.follow} onClick={handleFollow} />
              ) : (
                <FaUserPlus
                  className={styles.unfollow}
                  onClick={handleFollow}
                />
              )}
              <BsThreeDots className={styles.dots} onClick={clickDots} />
            </div>
          </div>
        ) : (
          <div className={styles.buttonWraaper} onClick={handlePlay}>
            <IoMdPlay className={styles.playButton} />
            <div className={styles.functions}>
              {is_private ? null : (
                <AiFillHeart
                  className={heart ? styles.liked : styles.like}
                  onClick={handleHeart}
                />
              )}
              {follow === "no" ? null : follow ? (
                <FaUserCheck className={styles.follow} onClick={handleFollow} />
              ) : (
                <FaUserPlus
                  className={styles.unfollow}
                  onClick={handleFollow}
                />
              )}
              <BsThreeDots className={styles.dots} onClick={clickDots} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItem;
