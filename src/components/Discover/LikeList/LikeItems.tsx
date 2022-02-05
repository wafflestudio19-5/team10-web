import styles from "./LikeItem.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useEffect, useState } from "react";
import { BsFillPlayFill, BsThreeDots } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { useTrackContext } from "../../../context/TrackContext";
// import toast from "react-hot-toast";

const LikeItems = ({
  userPermal,
  trackPermal,
  title,
  img,
  artist,
  play_count,
  like,
  comment,
  repost,
  trackId,
  setLikeList,
  setLikeCount,
  togglePlayPause,
  track,
  playMusic,
  setNewTrackList,
  setMostTrackList,
}: {
  userPermal: string;
  trackPermal: string;
  title: string;
  img: string;
  artist: string;
  play_count: number;
  like: number;
  comment: number;
  repost: number;
  trackId: number;
  setLikeList: any;
  setLikeCount: any;
  togglePlayPause: any;
  track: any;
  playMusic: any;
  setNewTrackList: any;
  setMostTrackList: any;
}) => {
  const [play, setPlay] = useState(false);
  const [heart, setHeart] = useState(true);
  const history = useHistory();
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
  const goArtistPage = () => {
    history.push(`/${userPermal}`);
  };
  const goTrackPage = () => {
    history.push(`/${userPermal}/${trackPermal}`);
  };
  const handleHeart = async (e: any) => {
    e.stopPropagation();
    if (heart === false) {
      await axios({
        method: "post",
        url: `/likes/tracks/${trackId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      });
      setHeart(!heart);
    } else {
      await axios({
        method: "delete",
        url: `/likes/tracks/${trackId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      });
      setHeart(!heart);
    }
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/likes/tracks`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    })
      .then((res) => {
        setLikeCount(res.data.count);
        setLikeList(res.data.results);
      })
      .catch(() => toast.error("like list 불러오기를 실패하였습니다"));
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
  const clickDots = (e: any) => {
    e.stopPropagation();
    toast.error("아직 구현되지 않은 기능입니다");
  };
  return (
    <div className={styles.itemWrapper}>
      <div className={styles.imgWrapper}>
        {img === null ? (
          <svg
            className={styles.track}
            width="45"
            height="45"
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
          <img src={img} alt="trackImg" className={styles.img} />
        )}
      </div>
      <div className={styles.description}>
        <div className={styles.artist} onClick={goArtistPage}>
          {artist}
        </div>
        <div className={styles.trackName} onClick={goTrackPage}>
          {title}
        </div>
        <div className={styles.counts}>
          <div className={styles.playCount}>
            <BsFillPlayFill />
            &nbsp; {play_count}
          </div>
          <div className={styles.likeCount}>
            <AiFillHeart />
            &nbsp; {like}
          </div>
          <div className={styles.repostCount}>
            <BiRepost />
            &nbsp; {repost}
          </div>
          <div className={styles.commentCount}>
            <FaCommentAlt />
            &nbsp; {comment}
          </div>
        </div>
      </div>
      <div className={styles.hover}>
        {play ? (
          <>
            <div className={styles.playButton}>
              <IoMdPause onClick={handlePlay} />
            </div>
            <div className={styles.functions}>
              <AiFillHeart
                className={heart ? styles.liked : styles.like}
                onClick={handleHeart}
              />
              <BsThreeDots className={styles.details} onClick={clickDots} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.playButton}>
              <IoMdPlay onClick={handlePlay} />
            </div>
            <div className={styles.functions}>
              <AiFillHeart
                className={heart ? styles.liked : styles.like}
                onClick={handleHeart}
              />
              <BsThreeDots className={styles.details} onClick={clickDots} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default LikeItems;
