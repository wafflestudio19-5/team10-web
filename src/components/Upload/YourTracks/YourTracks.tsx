import React, { useRef } from "react";
import { BiPencil } from "react-icons/bi";
import { MdPlaylistAdd } from "react-icons/md";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import { BsSoundwave, BsFillFileLock2Fill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FcComments } from "react-icons/fc";
import { BsSuitHeartFill, BsTrashFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import styles from "./YourTracks.module.scss";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import UploadHeader from "../UploadHeader/UploadHeader";
import { useAuthContext } from "../../../context/AuthContext";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import { ITag, ITrack } from "../../ArtistPage/Track/TrackPage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTrackContext } from "../../../context/TrackContext";
import EditModal from "./EditModal";
dayjs.extend(relativeTime);

interface IYourTracks {
  id: number;
  title: string;
  permalink: string;
  audio: string;
  image: string;
  like_count: number;
  repost_count: number;
  comment_count: number;
  genre: number | null;
  count: number;
}

const YourTracks = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [yourTracks, setYourTracks] = useState<IYourTracks[]>([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [username, setUsername] = useState("");
  const [modal, setModal] = useState(false);
  const [editTrack, setEditTrack] = useState<ITrack>();
  const [loading, setLoading] = useState(true);
  const { userSecret } = useAuthContext();

  const fetchYourTracks = async () => {
    if (userSecret.jwt) {
      const config: any = {
        method: "get",
        url: `/users/me`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        const response = await axios(config);
        const userId = response.data.id;
        setUsername(response.data.display_name);
        const tracksConfig: any = {
          method: "get",
          url: `/users/${userId}/tracks`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          const { data } = await axios(tracksConfig);
          setYourTracks(data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchYourTracks();
  }, [userSecret.jwt]);

  const editToggle = () => setIsEditOpen(!isEditOpen);

  const history = useHistory();
  const uploadTrack = () => history.push(`/upload`);

  const checkedItemHandler = (id: number, isChecked: boolean) => {
    if (isChecked) {
      checkedItems.add(id);
      setCheckedItems(checkedItems);
    } else if (!isChecked && checkedItems.has(id)) {
      checkedItems.delete(id);
      setCheckedItems(checkedItems);
    }
  };

  return (
    <div className={styles.yourTracksPage}>
      {modal && editTrack && (
        <EditModal
          setModal={setModal}
          track={editTrack}
          fetchYourTracks={fetchYourTracks}
        />
      )}
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.uploadHeader}>
            <UploadHeader />
          </div>
          <div className={styles.header}>
            <div className={styles.title}>
              <span>Your tracks</span>
            </div>
            <div className={styles.editButtons}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" />
              </div>
              <div className={styles.dropdownContainer}>
                <button className={styles.editTracks} onClick={editToggle}>
                  <BiPencil />
                  <span>Edit tracks</span>
                  <AiOutlineDown />
                </button>
                {isEditOpen && (
                  <ul>
                    <li>Privacy and tags</li>
                    <li>Artwork</li>
                  </ul>
                )}
              </div>
              <button className={styles.addToPlaylist}>
                <MdPlaylistAdd />
                <span>&nbsp;&nbsp;Add to playlist</span>
              </button>
              <div className={styles.pageSelector}>
                <div className={styles.pageInfo}>
                  1 - 0 of {yourTracks.length} tracks
                </div>
                <div className={styles.pageButtons}>
                  <button className={styles.backButton}>
                    <AiFillCaretLeft />
                  </button>
                  <button className={styles.nextButton}>
                    <AiFillCaretRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {!loading && yourTracks.length !== 0 && (
            <ul className={styles.trackContainer}>
              {yourTracks.map((track) => {
                return (
                  <Track
                    key={track.id}
                    track={track}
                    checkedItemHandler={checkedItemHandler}
                    username={username}
                    setModal={setModal}
                    setEditTrack={setEditTrack}
                  />
                );
              })}
            </ul>
          )}
          {!loading && yourTracks.length === 0 && (
            <div className={styles.uploadTrack}>
              <div className={styles.waveContainer}>
                <BsSoundwave />
              </div>
              <div className={styles.seemQuiet}>
                Seems a little quiet over here
              </div>
              <div className={styles.uploadLink} onClick={uploadTrack}>
                Upload a track to share with your followers.
              </div>
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
};

const Track = ({
  track,
  checkedItemHandler,
  username,
  setModal,
  setEditTrack,
}: {
  track: IYourTracks;
  checkedItemHandler: (id: number, isChecked: boolean) => void;
  username: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTrack: React.Dispatch<React.SetStateAction<ITrack | undefined>>;
}) => {
  const [checked, setChecked] = useState(false);
  const [fetchedTrack, setFetchedTrack] = useState<ITrack>();
  const [duration, setDuration] = useState(0);
  const [play, setPlay] = useState(false);
  const player = useRef<HTMLAudioElement>(null);
  const { userSecret } = useAuthContext();
  const {
    audioSrc,
    setAudioSrc,
    trackIsPlaying,
    setTrackIsPlaying,
    setTrackBarTrack,
    audioPlayer,
    setPlayingTime,
  } = useTrackContext();
  const history = useHistory();

  const checkHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setChecked(!checked);
    checkedItemHandler(track.id, event.target.checked);
  };
  useEffect(() => {
    const fetchTrack = async () => {
      if (userSecret.jwt) {
        const config: any = {
          method: "get",
          url: `/tracks/${track.id}`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          const { data } = await axios(config);
          const tagList = data.tags.map((value: ITag) => value.name);
          setFetchedTrack({
            id: data.id,
            title: data.title,
            permalink: data.permalink,
            audio: data.audio,
            comment_count: data.comment_count,
            count: data.count,
            created_at: data.created_at,
            description: data.description,
            genre: data.genre,
            image: data.image,
            like_count: data.like_count,
            repost_count: data.repost_count,
            tags: tagList,
            is_private: data.is_private,
          });
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchTrack();
  }, [userSecret]);
  useEffect(() => {
    if (audioSrc === track.audio && trackIsPlaying) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  }, [audioSrc, trackIsPlaying]);

  const calculateTime = (secs: number) => {
    // 트랙 길이를 분:초 단위로 환산
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const onLoadedMetadata = () => {
    if (player.current) {
      setDuration(player.current.duration);
    }
  };

  const togglePlayButton = () => {
    if (fetchedTrack) {
      if (!play) {
        if (audioSrc !== track.audio) {
          setPlayingTime(0);
          audioPlayer.current.src =
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
          audioPlayer.current.load();
          setTimeout(() => {
            audioPlayer.current.play();
          }, 1);
        } else {
          audioPlayer.current.play();
        }
        setPlay(true);
        setAudioSrc(track.audio);
        setTrackIsPlaying(true);
        setTrackBarTrack(fetchedTrack);
      } else {
        audioPlayer.current.pause();
        setPlay(false);
        setTrackIsPlaying(false);
      }
    }
  };

  const releasedDate = dayjs(fetchedTrack?.created_at).fromNow();
  const clickTitle = () =>
    history.push(`/${userSecret.permalink}/${track.permalink}`);

  const onEditTrack = () => {
    if (fetchedTrack) {
      setModal(true);
      setEditTrack(fetchedTrack);
    }
  };

  return (
    <li key={track.id}>
      <audio
        ref={player}
        src={fetchedTrack?.audio}
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
      />
      <input
        type="checkbox"
        className={styles.trackCheckBox}
        checked={checked}
        onChange={(event) => checkHandler(event)}
      />
      <div className={styles.playContainer}>
        <img className={styles.trackImage} src={track.image} />
        <div className={styles.playButton} onClick={togglePlayButton}>
          {play ? <IoMdPause /> : <IoMdPlay />}
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <div className={styles.username}>
            <span>{username}</span>
          </div>
          <div className={styles.title}>
            <span onClick={clickTitle}>{track.title}</span>
          </div>
        </div>
        <ul className={styles.stats}>
          {track.comment_count !== 0 && (
            <li>
              <FcComments />
              <span>{track.comment_count}</span>
            </li>
          )}
          {track.count !== 0 && (
            <li>
              <FaPlay />
              <span>{track.count}</span>
            </li>
          )}
          {track.like_count !== 0 && (
            <li>
              <BsSuitHeartFill />
              <span>{track.like_count}</span>
            </li>
          )}
          {track.repost_count !== 0 && (
            <li>
              <BiRepost />
              <span>{track.repost_count}</span>
            </li>
          )}
        </ul>
        <div className={styles.additional}>
          <div className={styles.actions}>
            <div className={styles.smallButtons}>
              <button onClick={onEditTrack}>
                <BiPencil />
              </button>
              <button>
                <BsTrashFill />
              </button>
            </div>
          </div>
          <div className={styles.extra}>
            {fetchedTrack?.is_private && (
              <div className={styles.private}>
                <span data-tip="This track is private.">
                  <BsFillFileLock2Fill />
                </span>
                <ReactTooltip />
              </div>
            )}
          </div>
          <div className={styles.duration}>
            <span>{duration !== 0 && calculateTime(duration)}</span>
          </div>
          <div className={styles.uploadTime}>{releasedDate}</div>
        </div>
      </div>
    </li>
  );
};

export default YourTracks;
