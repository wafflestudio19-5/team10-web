import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useTrackContext } from "../../context/TrackContext";
import Follower from "./Following/Follower";
import styles from "./Library.module.scss";
import LikeItem from "./Likes/LikeItem";
import ListItem from "./Playlists/ListItem";

const Library = () => {
  const [recentList, setRecentList] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
        is_followed: false,
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
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
  ]);
  const [likeList, setLikeList] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
        is_followed: false,
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
      created_at: "",
      description: "",
      genre: null,
      tags: [],
      is_private: false,
      audio_length: 0,
    },
  ]);
  const [followerList, setFollowerList] = useState([
    {
      id: -1,
      permalink: "",
      display_name: "",
      image_profile: "",
      follower_count: 0,
    },
  ]);
  const [playlist, setPlaylist] = useState([
    {
      id: -1,
      permalink: "",
      title: "",
      type: "playlist",
      is_private: false,
      is_liked: false,
      image: "",
      creator: {
        display_name: "",
        permalink: "",
        id: -1,
        is_followed: false,
      },
      tracks: [
        {
          audio: "",
          image: "",
        },
      ],
    },
  ]);
  const [albumsList, setAlbumsList] = useState([
    {
      id: -1,
      permalink: "",
      title: "",
      type: "album",
      is_private: false,
      is_liked: false,
      image: "",
      creator: {
        display_name: "",
        permalink: "",
        id: -1,
        is_followed: false,
      },
      tracks: [
        {
          audio: "",
          image: "",
        },
      ],
    },
  ]);
  const [isExist, setIsExist] = useState({
    recent: false,
    likes: false,
    playlists: false,
    albums: false,
    following: false,
  });
  const { userSecret, setUserSecret } = useAuthContext();
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
      url: `/users/${userSecret.id}/followings?page_size=6`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    }).then((res) => {
      setFollowerList(res.data.results);
      res.data.count !== 0 ? setIsExist({ ...isExist, following: true }) : null;
    });
  };
  const fetchLikesList = async () => {
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/likes/tracks?page_size=6`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    }).then((res) => {
      setLikeList(res.data.results);
      res.data.count !== 0 ? setIsExist({ ...isExist, likes: true }) : null;
    });
  };
  const setInitialList = async () => {
    let newIsExist = isExist;
    let newList: any = [];
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/sets?page_size=6`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    }).then((res) => {
      newList = res.data.results;
    });
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/likes/sets?page_size=6`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    }).then((res) => {
      newList = [...newList, ...res.data.results];
    });
    const arrUnique = newList.filter((character: any, idx: any, arr: any) => {
      return arr.findIndex((item: any) => item.id === character.id) === idx;
    });
    const fetchedPlaylist = arrUnique.filter(
      (item: any) => item.type === "playlist"
    );
    const fetchedAlbumsList = arrUnique.filter(
      (item: any) => item.type === "album"
    );
    const isExistPlayList = fetchedPlaylist.length === 0 ? false : true;
    const isExistAlbumsList = fetchedAlbumsList.length === 0 ? false : true;
    newIsExist = {
      ...newIsExist,
      playlists: isExistPlayList,
      albums: isExistAlbumsList,
    };
    setPlaylist(fetchedPlaylist);
    setAlbumsList(fetchedAlbumsList);
    setIsExist(newIsExist);
  };
  const fetchRecentList = async () => {
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/history/tracks?page_size=6`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    }).then((res) => {
      setRecentList(res.data.results);
      res.data.count !== 0 ? setIsExist({ ...isExist, recent: true }) : null;
    });
  };
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchUserId = async () => {
        try {
          let newIsExist = isExist;
          let newList: any = [];
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/followings?page_size=6`,
            headers: { Authorization: `JWT ${userSecret.jwt}` },
            data: {
              user_id: userSecret.id,
            },
          }).then((res) => {
            setFollowerList(res.data.results);
            res.data.count !== 0
              ? (newIsExist = { ...newIsExist, following: true })
              : null;
          });
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/history/tracks?page_size=6`,
            headers: { Authorization: `JWT ${userSecret.jwt}` },
            data: {
              user_id: userSecret.id,
            },
          }).then((res) => {
            setRecentList(res.data.results);
            res.data.count !== 0
              ? (newIsExist = { ...newIsExist, recent: true })
              : null;
          });
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/likes/tracks?page_size=6`,
            headers: { Authorization: `JWT ${userSecret.jwt}` },
            data: {
              user_id: userSecret.id,
            },
          }).then((res) => {
            setLikeList(res.data.results);
            res.data.count !== 0
              ? (newIsExist = { ...newIsExist, likes: true })
              : null;
          });
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/sets?page_size=6`,
            headers: { Authorization: `JWT ${userSecret.jwt}` },
            data: {
              user_id: userSecret.id,
            },
          }).then((res) => {
            newList = res.data.results;
          });
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/likes/sets?page_size=6`,
            headers: { Authorization: `JWT ${userSecret.jwt}` },
            data: {
              user_id: userSecret.id,
            },
          }).then((res) => {
            newList = [...newList, ...res.data.results];
          });
          const arrUnique = newList.filter(
            (character: any, idx: any, arr: any) => {
              return (
                arr.findIndex((item: any) => item.id === character.id) === idx
              );
            }
          );
          const fetchedPlaylist = arrUnique.filter(
            (item: any) => item.type === "playlist"
          );
          const fetchedAlbumsList = arrUnique.filter(
            (item: any) => item.type === "album"
          );
          const isExistPlayList = fetchedPlaylist.length === 0 ? false : true;
          const isExistAlbumsList =
            fetchedAlbumsList.length === 0 ? false : true;
          newIsExist = {
            ...newIsExist,
            playlists: isExistPlayList,
            albums: isExistAlbumsList,
          };
          setPlaylist(fetchedPlaylist);
          setAlbumsList(fetchedAlbumsList);
          setIsExist(newIsExist);
        } catch {
          toast.error("유저 정보 불러오기에 실패하였습니다");
        }
      };
      fetchUserId();
    }
  }, [userSecret]);
  const {
    setTrackIsPlaying,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    trackIsPlaying,
    trackBarTrack,
    trackBarPlaylist,
    setTrackBarPlaylist,
  } = useTrackContext();
  const playMusic = () => {
    if (trackIsPlaying) {
      audioPlayer.current.play();
      setPlayingTime(audioPlayer.current.currentTime);
    } else {
      audioPlayer.current.pause();
      setPlayingTime(audioPlayer.current.currentTime);
    }
  };
  const hitTrack = async (track_id: string | number) => {
    await axios({
      method: "put",
      url: `tracks/${track_id}/hit`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    });
  };
  const hitSet = async (set_id: string | number, track_id: string | number) => {
    await axios({
      method: "put",
      url: `tracks/${track_id}/hit?set_id=${set_id}`,
      headers: { Authorization: `JWT ${userSecret.jwt}` },
      data: {
        user_id: userSecret.id,
      },
    });
  };
  const togglePlayPause = (track: any, artist: any) => {
    // 재생/일시정지 버튼 누를 때
    if (trackBarTrack.id === track.id) {
      const prevValue = trackIsPlaying;
      setTrackIsPlaying(!prevValue);
      if (!prevValue) {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      } else {
        audioPlayer.current.pause();
        setPlayingTime(audioPlayer.current.currentTime);
      }
    } else {
      setAudioSrc(track.audio);
      setTrackIsPlaying(true);
      setTrackBarArtist(artist);
      setTrackBarTrack(track);
      audioPlayer.current.src = track.audio;
      setTrackBarPlaylist([]);
      hitTrack(track.id);
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      }, 1);
    }
  };
  const togglePlayPauseSet = (playlist: any) => {
    // 재생/일시정지 버튼 누를 때
    if (trackBarPlaylist === playlist.tracks) {
      const prevValue = trackIsPlaying;
      setTrackIsPlaying(!prevValue);
      if (!prevValue) {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      } else {
        audioPlayer.current.pause();
        setPlayingTime(audioPlayer.current.currentTime);
      }
    } else {
      setAudioSrc(playlist.tracks[0].audio);
      setTrackIsPlaying(true);
      setTrackBarArtist(playlist.tracks[0].artist);
      setTrackBarTrack(playlist.tracks[0]);
      setTrackBarPlaylist(playlist.tracks);
      audioPlayer.current.src = playlist.tracks[0].audio;
      hitSet(playlist.id, playlist.tracks[0].id);
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      }, 1);
    }
  };
  const history = useHistory();
  const goToSomewhere = (sth: string) => {
    history.push(sth);
  };
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.focus}>Overview</div>
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
        <div className={styles.likes}>
          <div className={styles.listHeader}>
            <div className={styles.listName}>Recently played</div>
            <div className={styles.listHeaderRight}>
              {isExist.recent ? null : (
                <div className={styles.notExist}>
                  You have no listening history yet
                </div>
              )}
              <button onClick={() => goToSomewhere("/you/history")}>
                View all
              </button>
            </div>
          </div>
          {isExist.recent ? (
            <div className={styles.likesWrapper}>
              {recentList.slice(0, 6).map((item: any) => (
                <LikeItem
                  title={item.title}
                  img={item.image}
                  key={item.id}
                  trackId={item.id}
                  artist={item.artist.display_name}
                  artistId={item.artist.id}
                  trackPermal={item.permalink}
                  artistPermal={item.artist.permalink}
                  is_followed={item.artist.is_followed}
                  togglePlayPause={togglePlayPause}
                  track={item}
                  playMusic={playMusic}
                  fetchLikesList={fetchRecentList}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noItemList}>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
            </div>
          )}
        </div>
        <div className={styles.likes}>
          <div className={styles.listHeader}>
            <div className={styles.listName}>Likes</div>
            <div className={styles.listHeaderRight}>
              {isExist.likes ? null : (
                <div className={styles.notExist}>You have no likes yet</div>
              )}
              <button onClick={() => goToSomewhere("/you/likes")}>
                View all
              </button>
            </div>
          </div>
          {isExist.likes ? (
            <div className={styles.likesWrapper}>
              {likeList.slice(0, 6).map((item: any) => (
                <LikeItem
                  title={item.title}
                  img={item.image}
                  key={item.id}
                  trackId={item.id}
                  artist={item.artist.display_name}
                  artistId={item.artist.id}
                  trackPermal={item.permalink}
                  artistPermal={item.artist.permalink}
                  is_followed={item.artist.is_followed}
                  togglePlayPause={togglePlayPause}
                  track={item}
                  playMusic={playMusic}
                  fetchLikesList={fetchLikesList}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noItemList}>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
            </div>
          )}
        </div>
        <div className={styles.playlists}>
          <div className={styles.listHeader}>
            <div className={styles.listName}>Playlists</div>
            <div className={styles.listHeaderRight}>
              {isExist.playlists ? null : (
                <div className={styles.notExist}>You have no playlists yet</div>
              )}
              <button onClick={() => goToSomewhere("/you/sets")}>
                View all
              </button>
            </div>
          </div>
          {isExist.playlists ? (
            <div className={styles.setWrapper}>
              {playlist.slice(0, 6).map((item: any) => (
                <ListItem
                  title={item.title}
                  setImage={item.image}
                  key={item.id}
                  setId={item.id}
                  setPermal={item.permalink}
                  is_private={item.is_private}
                  is_liked={item.is_liked}
                  creator={item.creator.display_name}
                  creatorId={item.creator.id}
                  creatorPermal={item.creator.permalink}
                  togglePlayPause={togglePlayPauseSet}
                  playMusic={playMusic}
                  setInitialList={setInitialList}
                  playlist={item}
                  is_followed={item.creator.is_followed}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noItemList}>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
            </div>
          )}
        </div>
        <div className={styles.albums}>
          <div className={styles.listHeader}>
            <div className={styles.listName}>Albums</div>
            <div className={styles.listHeaderRight}>
              {isExist.albums ? null : (
                <div className={styles.notExist}>
                  You haven't liked any albums yet
                </div>
              )}
              <button onClick={() => goToSomewhere("/you/albums")}>
                View all
              </button>
            </div>
          </div>
          {isExist.albums ? (
            <div className={styles.setrWrapper}>
              {albumsList.slice(0, 6).map((item: any) => (
                <ListItem
                  title={item.title}
                  setImage={item.image}
                  key={item.id}
                  setId={item.id}
                  setPermal={item.permalink}
                  is_private={item.is_private}
                  is_liked={item.is_liked}
                  creator={item.creator.display_name}
                  creatorId={item.creator.id}
                  creatorPermal={item.creator.permalink}
                  togglePlayPause={togglePlayPauseSet}
                  playMusic={playMusic}
                  setInitialList={setInitialList}
                  playlist={item}
                  is_followed={item.creator.is_followed}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noItemList}>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
            </div>
          )}
        </div>
        <div className={styles.following}>
          <div className={styles.listHeader}>
            <div className={styles.listName}>Following</div>
            <div className={styles.listHeaderRight}>
              {isExist.following ? null : (
                <div className={styles.notExist}>
                  You aren’t following anyone yet
                </div>
              )}
              <button onClick={() => goToSomewhere("/you/following")}>
                View all
              </button>
            </div>
          </div>
          {isExist.following ? (
            <div className={styles.followerWrapper}>
              {followerList.slice(0, 6).map((item: any) => (
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
              ))}
            </div>
          ) : (
            <div className={styles.noItemList}>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
              <div className={styles.noItem}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
