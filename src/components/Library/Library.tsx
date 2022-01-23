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
  const [likeList, setLikeList] = useState([
    {
      artist: {
        permalink: "",
        display_name: "",
        id: -1,
        city: "",
        country: "",
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
  const [followList, setFollowList] = useState([]);
  const [playlist, setPlaylist] = useState([
    {
      id: -1,
      permailink: "",
      title: "",
      type: "playlist",
      is_private: false,
      is_liked: false,
      image: "",
      creator: {
        display_name: "",
        permailink: "",
        id: -1,
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
      permailink: "",
      title: "",
      type: "album",
      is_private: false,
      is_liked: false,
      image: "",
      creator: {
        display_name: "",
        permailink: "",
        id: -1,
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
  const _ = require("lodash");
  const fetchFollowList = _.throttle(() => {
    const asyncFetchFollwList = async () => {
      await axios.get(`/users/${userSecret.id}/followings`).then((res) => {
        if (res.data.next !== null) {
          let fetchedFollowList = res.data.results.map((item: any) => item.id);
          const nextUrl = res.data.next.split("users")[1];
          const recurse = (url: string) => {
            axios.get(`users${url}`).then((r) => {
              if (r.data.next !== null) {
                fetchedFollowList = [...fetchedFollowList, ...r.data.results];
                const nextUrl = r.data.next.split("users")[1];
                recurse(nextUrl);
              } else {
                fetchedFollowList = [...fetchedFollowList, ...r.data.results];
                setFollowList(fetchedFollowList);
              }
            });
          };
          recurse(nextUrl);
        } else {
          let fetchedFollowList = res.data.results.map((item: any) => item.id);
          setFollowList(fetchedFollowList);
        }
      });
    };
    asyncFetchFollwList();
  }, 200);
  const fetchFollowingList = async () => {
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/followings?page_size=6`,
    }).then((res) => {
      setFollowerList(res.data.results);
      res.data.count !== 0 ? setIsExist({ ...isExist, following: true }) : null;
    });
  };
  const fetchLikesList = async () => {
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/likes/tracks?page_size=6`,
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
    }).then((res) => {
      newList = res.data.results;
    });
    await axios({
      method: "get",
      url: `/users/${userSecret.id}/likes/sets?page_size=6`,
    }).then((res) => {
      newList = [...newList, res.data.results];
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
  useEffect(() => {
    if (userSecret.permalink !== undefined) {
      const fetchUserId = async () => {
        try {
          let newIsExist = isExist;
          let newList: any = [];
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/followings?page_size=6`,
          }).then((res) => {
            setFollowerList(res.data.results);
            res.data.count !== 0
              ? (newIsExist = { ...newIsExist, following: true })
              : null;
          });
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/likes/tracks?page_size=6`,
          }).then((res) => {
            setLikeList(res.data.results);
            res.data.count !== 0
              ? (newIsExist = { ...newIsExist, likes: true })
              : null;
          });
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/sets?page_size=6`,
          }).then((res) => {
            newList = res.data.results;
          });
          await axios({
            method: "get",
            url: `/users/${userSecret.id}/likes/sets?page_size=6`,
          }).then((res) => {
            newList = [...newList, res.data.results];
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
          fetchFollowList();
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
                  followList={followList}
                  fetchFollowList={fetchFollowList}
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
                  creatorPermal={item.creator.permailink}
                  togglePlayPause={togglePlayPauseSet}
                  playMusic={playMusic}
                  setInitialList={setInitialList}
                  playlist={item}
                  fetchFollowList={fetchFollowList}
                  followList={followList}
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
                  creatorPermal={item.creator.permailink}
                  togglePlayPause={togglePlayPauseSet}
                  playMusic={playMusic}
                  setInitialList={setInitialList}
                  playlist={item}
                  fetchFollowList={fetchFollowList}
                  followList={followList}
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
