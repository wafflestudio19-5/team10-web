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
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
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
  const [trackCount, setTrackCount] = useState<number | null>(null);
  const [isFinalPage, setIsFinalPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTracks, setCurrentTracks] = useState<IYourTracks[]>([]);
  const nextPage = useRef(1);
  const finalPage = useRef(0);
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
        setUsername(response.data.display_name);
        const tracksConfig: any = {
          method: "get",
          url: `/users/${userSecret.id}/tracks?page=${1}&page_size=${10}`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          const { data } = await axios(tracksConfig);
          setTrackCount(data.count);
          setYourTracks(data.results);
          setCurrentTracks(data.results);
          setLoading(false);
          if (data.next) {
            // 다음 페이지가 있다면 nextPage에 다음 코멘트 페이지 저장
            nextPage.current += 1;
          } else {
            // 다음 페이지가 없다면 현재 nextPage 값 === 현재 받아온 코멘트 페이지 를 마지막 페이지로 저장
            finalPage.current = nextPage.current;
            setIsFinalPage(true);
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const fetchNextTracks = async () => {
    setLoading(true);
    const tracksConfig: any = {
      method: "get",
      url: `/users/${userSecret.id}/tracks?page=${
        nextPage.current
      }&page_size=${10}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const { data } = await axios(tracksConfig);
      setTrackCount(data.count);
      setYourTracks(yourTracks.concat(data.results));
      setCurrentPage(currentPage + 1);
      setLoading(false);
      if (data.next) {
        // 다음 페이지가 있다면 nextPage에 다음 코멘트 페이지 저장
        nextPage.current += 1;
      } else {
        // 다음 페이지가 없다면 현재 nextPage 값 === 현재 받아온 코멘트 페이지 를 마지막 페이지로 저장
        finalPage.current = nextPage.current;
        setIsFinalPage(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchYourTracks();
  }, [userSecret.jwt]);
  useEffect(() => {
    if (yourTracks.length > 10) {
      setCurrentTracks(yourTracks.slice(-10));
    }
  }, [yourTracks]);

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
                  <div></div>
                  //   <ul>
                  //     <li>Privacy and tags</li>
                  //     <li>Artwork</li>
                  //   </ul>
                )}
              </div>
              <button className={styles.addToPlaylist}>
                <MdPlaylistAdd />
                <span>&nbsp;&nbsp;Add to playlist</span>
              </button>
              <div className={styles.pageSelector}>
                <div className={styles.pageInfo}>
                  1 - {yourTracks.length} of {trackCount} tracks
                </div>
                <div className={styles.pageButtons}>
                  <button
                    className={styles.backButton}
                    disabled={currentPage === 1}
                  >
                    <AiFillCaretLeft />
                  </button>
                  <button
                    className={styles.nextButton}
                    disabled={isFinalPage}
                    onClick={fetchNextTracks}
                  >
                    <AiFillCaretRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {!loading && yourTracks.length !== 0 && (
            <ul className={styles.trackContainer}>
              {currentTracks.map((track) => {
                return (
                  <Track
                    key={track.id}
                    track={track}
                    checkedItemHandler={checkedItemHandler}
                    username={username}
                    setModal={setModal}
                    setEditTrack={setEditTrack}
                    fetchYourTracks={fetchYourTracks}
                    yourTracks={currentTracks}
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
  fetchYourTracks,
  yourTracks,
}: {
  track: IYourTracks;
  checkedItemHandler: (id: number, isChecked: boolean) => void;
  username: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTrack: React.Dispatch<React.SetStateAction<ITrack | undefined>>;
  fetchYourTracks: () => void;
  yourTracks: IYourTracks[];
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
  }, [userSecret, yourTracks]);
  const headerTrackSrc = track.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];
  useEffect(() => {
    if (headerTrackSrc === barTrackSrc && trackIsPlaying) {
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
        if (headerTrackSrc !== barTrackSrc) {
          setPlayingTime(0);
          audioPlayer.current.src = track.audio;
          setAudioSrc(track.audio);
          audioPlayer.current.load();
          setTrackBarTrack(fetchedTrack);
        }
        setPlay(true);
        setTrackIsPlaying(true);
        setTimeout(() => {
          audioPlayer.current.play();
        }, 1);
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

  const onEditTrack: React.MouseEventHandler = (event) => {
    event.stopPropagation();
    if (fetchedTrack) {
      setModal(true);
      setEditTrack(fetchedTrack);
    }
  };
  const deleteTrack = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    confirmAlert({
      message: "Do you really want to delete this track?",
      buttons: [
        {
          label: "Cancel",
          onClick: () => {
            return null;
          },
        },
        {
          label: "Yes",
          onClick: async () => {
            const config: any = {
              method: "delete",
              url: `/tracks/${id}`,
              headers: {
                Authorization: `JWT ${userSecret.jwt}`,
              },
              data: {},
            };
            try {
              const response = await axios(config);
              if (response) {
                fetchYourTracks();
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    });
    return;
  };
  const onClickName = () => history.push(`/${userSecret.permalink}`);

  return (
    <li key={track.id} onClick={() => setChecked(!checked)}>
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
        <img
          className={styles.trackImage}
          src={track.image || "/default.track_image.svg"}
        />
        <div className={styles.playButton} onClick={togglePlayButton}>
          {play ? <IoMdPause /> : <IoMdPlay />}
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <div className={styles.username}>
            <span onClick={onClickName}>{username}</span>
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
              <button onClick={(event) => deleteTrack(event, track.id)}>
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
