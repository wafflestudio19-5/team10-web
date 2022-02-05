import React, { useEffect, useRef } from "react";
import styles from "./PlaylistModal.module.scss";
import { GrClose } from "react-icons/gr";
// import { IArtist, ITrack } from "../TrackPage";
import { useState } from "react";
import toast from "react-hot-toast";
// import { useAuthContext } from "../../../../context/AuthContext";
import axios from "axios";
// import { IPlaylist } from "../../Set/SetPage";
import { IoStatsChart } from "react-icons/io5";
import { BsFillFileLock2Fill } from "react-icons/bs";
import { throttle } from "lodash";
import { useHistory } from "react-router";
// import { IArtist, ITrack } from "../../ArtistPage/Track/TrackPage";
import { IPlaylist } from "../../ArtistPage/Set/SetPage";
import { useAuthContext } from "../../../context/AuthContext";

const PlaylistModal = ({
  modal,
  closeModal,
  checkedId,
}: {
  modal: boolean;
  closeModal: () => void;
  checkedId: number[];
}) => {
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [myPlaylist, setMyPlaylist] = useState<IPlaylist[]>([]);
  const [isFinal, setIsFinal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setPermalink, setSetPermalink] = useState<string>("");
  const ADD = "add";
  const CREATE = "create";
  const [mode, setMode] = useState(CREATE);
  const currentPage = useRef(1);
  const playlistContainer = useRef<HTMLDivElement>(null);
  const { userSecret } = useAuthContext();
  const onTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPlaylistTitle(event.target.value);
  };
  const changeSetPermalink: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setSetPermalink(event.target.value);
  };
  const onPrivacyChange = () => setIsPrivate(!isPrivate);
  const onSave = async () => {
    if (playlistTitle.trim().length === 0) {
      return toast.error("플레이리스트 이름을 작성해 주세요");
    }
    if (setPermalink.trim().length === 0) {
      return toast.error("플레이리스트 링크를 작성해주세요");
    }
    if (!/^[0-9a-z_-]+$/g.test(setPermalink)) {
      return toast.error(
        `링크에는 숫자, 알파벳 소문자, -, _ 만 사용해 주세요.`
      );
    }
    const config: any = {
      method: "post",
      url: `/sets`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {
        title: playlistTitle,
        permalink: setPermalink,
        type: "playlist",
        is_private: isPrivate,
      },
    };
    try {
      const response = await axios(config);
      const trackConfig: any = {
        method: "post",
        url: `/sets/${response.data.id}/tracks`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          track_ids: checkedId.map((number) => {
            return { id: number };
          }),
        },
      };
      try {
        await axios(trackConfig);
        toast.success("트랙이 추가되었습니다");
        setSetPermalink("");
        setPlaylistTitle("");
        closeModal();
        // console.log(response);
      } catch (error) {
        console.log(error);
        toast.error("트랙을 추가하는데 실패했습니다");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error &&
        error?.response?.status === 400
      ) {
        toast.error("플레이리스트 링크를 변경해 주세요");
      }
    }
  };
  const fetchMyPlaylists = async (page: number) => {
    if (currentPage.current === 1) {
      setIsLoading(true);
    }
    const config: any = {
      method: "get",
      url: `/users/${userSecret.id}/sets?page=${page}&page_size=${5}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const { data } = await axios(config);
      if (currentPage.current !== 1) {
        setMyPlaylist(myPlaylist.concat(data.results));
      } else {
        setMyPlaylist(data.results);
      }
      if (data.next === null) {
        setIsFinal(true);
      } else {
        currentPage.current += 1;
      }
      if (data.count !== 0) setMode(ADD);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("플레이리스트 정보를 받아올 수 없습니다");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userSecret.id) {
      currentPage.current = 1;
      setIsFinal(false);
      fetchMyPlaylists(1);
    }
  }, [userSecret.id, modal]);
  console.log(currentPage.current);

  const handleScroll = () => {
    if (!isFinal && !isLoading) {
      const scrollHeight = playlistContainer.current?.scrollHeight;
      const scrollTop = playlistContainer.current?.scrollTop;
      const clientHeight = playlistContainer.current?.clientHeight;
      if (
        scrollHeight &&
        scrollTop &&
        clientHeight &&
        scrollHeight - scrollTop == clientHeight
      ) {
        fetchMyPlaylists(currentPage.current);
      }
    }
  };
  //   스크롤 함수에 스로틀 적용
  const throttleScroll = throttle(handleScroll, 300);

  const clickAdd = () => setMode(ADD);
  const clickCreate = () => setMode(CREATE);

  return (
    <div
      className={`${styles["modal"]} ${
        modal ? styles["openModal"] : styles["closedModal"]
      }`}
      onClick={closeModal}
    >
      <div className={styles.closeButton} onClick={closeModal}>
        <GrClose />
      </div>
      {modal && (
        <section onClick={(event) => event.stopPropagation()}>
          <div className={styles.header}>
            {myPlaylist.length !== 0 && (
              <div
                className={`${styles.modalTitle} ${
                  mode === ADD && styles.headerSelected
                }`}
                onClick={clickAdd}
              >
                Add to Playlist
              </div>
            )}
            {isLoading === false && (
              <div
                className={`${styles.modalTitle} ${
                  mode === CREATE && styles.headerSelected
                }`}
                onClick={clickCreate}
              >
                Create a Playlist
              </div>
            )}
          </div>
          <div className={styles.main}>
            {mode === ADD && isLoading === false && (
              <div
                className={styles.myPlaylist}
                ref={playlistContainer}
                onScroll={throttleScroll}
              >
                <ul>
                  {myPlaylist.length !== 0 &&
                    myPlaylist.map((playlist) => {
                      return (
                        <li key={playlist.id}>
                          <PlaylistList
                            playlist={playlist}
                            key={playlist.id}
                            checkedId={checkedId}
                            closeModal={closeModal}
                          />
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
            {mode === CREATE && isLoading === false && (
              <>
                <div className={styles.playlistTitle}>
                  <label htmlFor="playlist-title">Playlist title</label>
                  <div className={styles.titleInput}>
                    <input
                      id="playlist-title"
                      type="text"
                      value={playlistTitle}
                      onChange={(event) => onTitleChange(event)}
                    />
                  </div>
                </div>
                <div className={styles.playlistPermalink}>
                  <div
                    className={styles.defaultPermalink}
                  >{`soundcloud.com/${userSecret.permalink}/sets/`}</div>
                  <input
                    className={styles.newPermalink}
                    value={setPermalink}
                    onChange={changeSetPermalink}
                  />
                </div>
                <div className={styles.buttonWrapper}>
                  <div className={styles.privacy}>
                    <span>Privacy:</span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="Public"
                      id="radio-public"
                      checked={!isPrivate}
                      onChange={onPrivacyChange}
                    />
                    <label htmlFor="radio-public" className={styles.radioLabel}>
                      Public
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="Private"
                      id="radio-private"
                      checked={isPrivate}
                      onChange={onPrivacyChange}
                    />
                    <label
                      htmlFor="radio-private"
                      className={styles.radioLabel}
                    >
                      Private
                    </label>
                  </div>
                  <button className={styles.saveButton} onClick={onSave}>
                    Save
                  </button>
                </div>
                {/* <div className={styles.trackItem}>
                  <div className={styles.image}>
                    <img
                      src={track.image || "/default_track_image.svg"}
                      onError={onImageError}
                    />
                  </div>
                  <div className={styles.content}>
                    <span className={styles.artistName}>
                      {artist.display_name} -
                    </span>{" "}
                    <span className={styles.trackTitle}>{track.title}</span>
                  </div>
                </div> */}
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

const PlaylistList = ({
  playlist,
  checkedId,
  closeModal,
}: {
  playlist: IPlaylist;
  checkedId: number[];
  closeModal: () => void;
}) => {
  const [isAlreadyIn, setIsAlreadyIn] = useState<boolean | undefined>(
    undefined
  );
  const { userSecret } = useAuthContext();
  useEffect(() => {
    if (
      checkedId
        .map((id) => playlist.tracks.find((track) => track.id === id))
        .filter((element) => element !== undefined).length === checkedId.length
    ) {
      setIsAlreadyIn(true);
    } else {
      setIsAlreadyIn(false);
    }
  }, [playlist]);
  const POST = "post";
  const DELETE = "delete";
  const addTrack = async (action: string) => {
    const config: any = {
      method: action === POST ? "post" : "delete",
      url: `/sets/${playlist.id}/tracks`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data:
        action === POST
          ? {
              track_ids: checkedId
                .filter(
                  (number) =>
                    playlist.tracks.find((track) => track.id === number) ===
                    undefined
                )
                .map((checked) => {
                  return { id: checked };
                }),
            }
          : {
              track_ids: checkedId.map((checked) => {
                return { id: checked };
              }),
            },
    };
    try {
      await axios(config);
      const prevValue = !isAlreadyIn;
      setIsAlreadyIn(prevValue);
      toast.success(`트랙이 ${action === POST ? "추가" : "제거"}되었습니다`);
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error("실패했습니다");
    }
  };

  const history = useHistory();
  const clickPlaylist = () =>
    history.push(`/${userSecret.permalink}/sets/${playlist.permalink}`);
  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_track_image.svg";
  };

  return (
    <div className={styles.playlist}>
      <img
        src={
          playlist?.image ||
          (playlist?.tracks !== null &&
            playlist.tracks.length !== 0 &&
            playlist.tracks[0].image) ||
          "/default_track_image.svg"
        }
        onError={onImageError}
      />
      <div className={styles.playlistInfo}>
        <div className={styles.playlistTitle} onClick={clickPlaylist}>
          {playlist.title}
        </div>
        <div className={styles.trackCount}>
          <IoStatsChart />
          {playlist.track_count}
        </div>
      </div>
      <div className={styles.addToPlaylist}>
        {playlist.is_private && <BsFillFileLock2Fill />}
        {isAlreadyIn === false && (
          <button onClick={() => addTrack(POST)}>Add to Playlist</button>
        )}
        {isAlreadyIn === true && (
          <button className={styles.selected} onClick={() => addTrack(DELETE)}>
            Added
          </button>
        )}
      </div>
    </div>
  );
};
export default PlaylistModal;
