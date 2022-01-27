import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { Link, useHistory } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useTrackContext } from "../../../context/TrackContext";
import styles from "./LikeItem.module.scss";

const LikeItem = ({
  title,
  img,
  trackId,
  artist,
  artistId,
  trackPermal,
  artistPermal,
  togglePlayPause,
  track,
  playMusic,
  fetchLikesList,
  is_followed,
}: {
  title: string;
  img: string;
  trackId: number;
  artist: string;
  artistId: number;
  trackPermal: string;
  artistPermal: string;
  togglePlayPause: any;
  track: any;
  playMusic: any;
  fetchLikesList: any;
  is_followed: any;
}) => {
  const history = useHistory();
  const goTrack = () => {
    history.push(`/${artistPermal}/${trackPermal}`);
  };
  const goArtist = () => {
    history.push(`/${artistPermal}`);
  };
  const [play, setPlay] = useState(false);
  const [heart, setHeart] = useState(true);
  const [follow, setFollow] = useState<boolean | string>(false);
  const { userSecret } = useAuthContext();
  const { trackIsPlaying, trackBarTrack } = useTrackContext();
  const handlePlay = (e: any) => {
    e.stopPropagation();
    togglePlayPause(track, track.artist);
    trackBarTrack.id === trackId ? setPlay(!trackIsPlaying) : setPlay(true);
  };
  useEffect(() => {
    trackBarTrack.id === trackId ? null : setPlay(false);
  }, [trackBarTrack]);
  const moveWeb = async () => {
    setPlay(true);
  };
  useEffect(() => {
    trackBarTrack.id === trackId ? moveWeb().then(() => playMusic()) : null;
  }, []);
  useEffect(() => {
    trackBarTrack.id === trackId ? setPlay(trackIsPlaying) : null;
  }, [trackIsPlaying]);
  const handleHeart = async (e: any) => {
    e.stopPropagation();
    if (heart === false) {
      await axios({
        method: "post",
        url: `/likes/tracks/${trackId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("like에 실패하였습니다"));
      setHeart(!heart);
    } else {
      await axios({
        method: "delete",
        url: `/likes/tracks/${trackId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("like에 실패하였습니다"));
      setHeart(!heart);
    }
    fetchLikesList();
  };
  const handleFollow = async (e: any) => {
    e.stopPropagation();
    if (follow === false) {
      await axios({
        method: "post",
        url: `/users/me/followings/${artistId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("팔로우에 실패하였습니다"));
      setFollow(!follow);
    } else {
      await axios({
        method: "delete",
        url: `/users/me/followings/${artistId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("팔로우에 실패하였습니다"));
      setFollow(!follow);
    }
    fetchLikesList();
  };
  const clickDots = (e: any) => {
    e.stopPropagation();
    toast.error("아직 구현되지 않은 기능입니다");
  };
  useEffect(() => {
    artistId === userSecret.id
      ? setFollow("no")
      : is_followed
      ? setFollow(true)
      : setFollow(false);
  }, [is_followed]);
  return (
    <div className={styles.wrapper}>
      {img === null ? (
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
        <img src={img} alt="track img" className={styles.track} />
      )}
      <Link className={styles.link} to={`/${artistPermal}/${trackPermal}`}>
        <AiFillHeart className={styles.titleHeart} />
        &nbsp;{title}
      </Link>
      <div className={styles.artist} onClick={goArtist}>
        {artist}
      </div>
      <div className={styles.hover} onClick={goTrack}>
        {play ? (
          <div className={styles.buttonWraaper} onClick={handlePlay}>
            <IoMdPause className={styles.playButton} />
            <div className={styles.functions}>
              <AiFillHeart
                className={heart ? styles.liked : styles.like}
                onClick={handleHeart}
              />
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
              <AiFillHeart
                className={heart ? styles.liked : styles.like}
                onClick={handleHeart}
              />
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

export default LikeItem;
