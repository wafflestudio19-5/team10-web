import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/AuthContext";
import { useTrackContext } from "../../../context/TrackContext";
import "./PlaylistBox.scss";

function PlaylistBox({ item, currentPlay, setCurrentPlay }: any) {
  const { userSecret } = useAuthContext();

  const player = useRef<any>();
  const [isPlaying, setIsPlaying] = useState<boolean>();
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [current, setCurrent] = useState<any>(0);

  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [reposted, setReposted] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(item.like_count);
  const [reposts, setReposts] = useState<number>(item.repost_count);

  const likePlaylist = async () => {
    const config: any = {
      method: "post",
      url: `/likes/sets/${item.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setIsLiking(true);
      setLikes(likes + 1);
    } catch (error) {
      toast("플레이리스트 좋아요 실패");
    }
  };

  const unlikePlaylist = async () => {
    const config: any = {
      method: "delete",
      url: `/likes/sets/${item.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setIsLiking(false);
      setLikes(likes - 1);
    } catch (error) {
      toast("플레이리스트 좋아요 취소 실패");
    }
  };

  const repostPlaylist = async () => {
    const config: any = {
      method: "post",
      url: `/reposts/sets/${item.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setReposted(true);
      setReposts(reposts + 1);
    } catch (error) {
      toast("플레이리스트 리포스트 실패");
    }
  };

  const unrepostPlaylist = async () => {
    const config: any = {
      method: "delete",
      url: `/reposts/sets/${item.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setReposted(false);
      setReposts(reposts - 1);
    } catch (error) {
      toast("플레이리스트 리포스트 취소 실패");
    }
  };

  useEffect(() => {
    player.current.audio.current.pause();

    const getIsLiking = (id: any) => {
      axios.get(`/users/${id}/likes/sets`).then((res) => {
        const pages = Array.from(
          { length: Math.floor(res.data.count / 10) + 1 },
          (_, i) => i + 1
        );
        pages.map((page) => {
          axios.get(`users/${id}/likes/sets?page=${page}`).then((res) => {
            const filter1 = res.data.results.filter(
              (track: any) => track.id === item.id
            );
            if (filter1.length !== 0) {
              setIsLiking(true);
            }
          });
        });
      });
    };

    const getReposted = (id: any) => {
      axios.get(`/users/${id}/reposts/sets`).then((res) => {
        const pages = Array.from(
          { length: Math.floor(res.data.count / 10) + 1 },
          (_, i) => i + 1
        );
        pages.map((page) => {
          axios.get(`users/${id}/reposts/sets?page=${page}`).then((res) => {
            const filter2 = res.data.results.filter(
              (track: any) => track.id === item.id
            );
            if (filter2.length !== 0) {
              setReposted(true);
            }
          });
        });
      });
    };

    const myPermalink = localStorage.getItem("permalink");

    // 내 아이디 받아오기 (나중에 context로 바꾸기)
    const myResolve = `https://soundwaffle.com/${myPermalink}`;
    axios
      .get(`resolve?url=${myResolve}`)
      .then((res) => {
        getIsLiking(res.data.id);
        getReposted(res.data.id);
      })
      .catch(() => {
        toast("유저 아이디 불러오기 실패");
      });
  }, []);

  // 하단바 재생 관련
  const {
    setTrackIsPlaying,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    trackIsPlaying,
    trackBarTrack,
    seekTime,
    setTrackBarPlaylist,
  } = useTrackContext();

  const playMusicBar = () => {
    if (trackIsPlaying) {
      audioPlayer.current.play();
      setPlayingTime(audioPlayer.current.currentTime);
    } else {
      audioPlayer.current.pause();
      setPlayingTime(audioPlayer.current.currentTime);
    }
  };

  const togglePlayPause = (playlist: any, index: any, artist: any) => {
    // 재생/일시정지 버튼 누를 때
    if (trackBarTrack.id === playlist[index].id) {
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
      setAudioSrc(playlist[index].audio);
      setTrackIsPlaying(true);
      setTrackBarArtist(artist);
      setTrackBarTrack(playlist[index]);
      setTrackBarPlaylist(playlist);
      audioPlayer.current.src = playlist[index].audio;
      if (trackBarTrack === playlist[index]) {
        audioPlayer.current.currentTime = current;
      }
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      }, 1);
    }
  };

  const [barPlaying, setBarPlaying] = useState(false);

  const handlePlay = (e: any, index: any) => {
    e.stopPropagation();
    togglePlayPause(item.tracks, index, item.creator);
    trackBarTrack.id === item.id
      ? setBarPlaying(!trackIsPlaying)
      : setBarPlaying(true);
  };

  const playMusic = (e: any, index: any) => {
    if (barPlaying) {
      handlePlay(e, trackIndex);
    }
    if (currentPlay !== null) {
      let current = document.getElementById(`button${currentPlay}`);
      current?.click();
    }
    setIsPlaying(true);
    player.current.audio.current.play();
    setCurrentPlay(item.id);
    handlePlay(e, index);
  };

  const pauseMusic = (e: any) => {
    setCurrentPlay(null);
    setCurrent(player.current.audio.current.currentTime);
    setIsPlaying(false);
    player.current.audio.current.pause();
    handlePlay(e, trackIndex);
  };

  const playNextTrack = (e: any) => {
    if (item.tracks.length === trackIndex + 1) {
      setTrackIndex(0);
    } else {
      setTrackIndex(trackIndex + 1);
      handlePlay(e, trackIndex + 1);
    }
  };

  const playThisTrack = (num: any, e: any) => {
    setTrackIndex(num);
    playMusic(e, num);
  };

  const moveTrackBar = () => {
    const seeked = player.current.audio.current.currentTime;
    setCurrent(seeked);
    audioPlayer.current.currentTime = seeked;
  };

  const seekPlayer = () => {
    player.current.audio.current.currentTime = seekTime;
  };

  useEffect(() => {
    trackBarTrack.id === item.id ? null : setBarPlaying(false);
  }, [trackBarTrack]);

  const moveWeb = async () => {
    setBarPlaying(true);
  };

  useEffect(() => {
    trackBarTrack.id === item.id ? moveWeb().then(() => playMusicBar()) : null;
  }, []);

  useEffect(() => {
    trackBarTrack.id === item.id ? setBarPlaying(trackIsPlaying) : null;
  }, [trackIsPlaying]);

  useEffect(() => {
    if (seekTime !== 0) {
      document.getElementById(`seek${currentPlay}`)?.click();
    }
  }, [seekTime]);

  return (
    <div className={"recent-track"}>
      {item.image && (
        <img className="track-Img" src={item.image} alt={"trackImg"} />
      )}
      {!item.image && (
        <img
          className="track-Img"
          src="/default_track_image.svg"
          alt={"trackImg"}
        />
      )}
      <div className={"track-right"}>
        <div className="track-info-private">
          <div className={"track-info"}>
            {!isPlaying && (
              <button
                onClick={(e) => playMusic(e, trackIndex)}
                className="play-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="white"
                  className="bi bi-caret-right-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
              </button>
            )}
            {isPlaying && (
              <button
                onClick={(e) => pauseMusic(e)}
                id={`button${item.id}`}
                className="play-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="white"
                  className="bi bi-pause-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                </svg>
              </button>
            )}
            <div className={"track-info-name"}>
              <div className={"artistname"}>{item.creator.display_name}</div>
              <div className={"trackname"}>{item.title}</div>
            </div>
          </div>
          {item.is_private && (
            <div className="track-private">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGQ9Ik0xMi4wMDMgNy4yNWMuNTQ0IDAgLjk5Ny40NDQuOTk3Ljk5djQuMDJjMCAuNTM5LS40NDYuOTktLjk5Ny45OUg1Ljk5N0EuOTk4Ljk5OCAwIDAxNSAxMi4yNlY4LjI0YzAtLjUzOS40NDYtLjk5Ljk5Ny0uOTl6TTEwIDguNzVIOHYzaDJ2LTN6IiBmaWxsPSJyZ2IoMjU1LCAyNTUsIDI1NSkiLz4KICAgIDxwYXRoIGQ9Ik0xMS41IDkuNzQ2VjYuMjU0QTIuNDk2IDIuNDk2IDAgMDA5IDMuNzVjLTEuMzggMC0yLjUgMS4xMTEtMi41IDIuNTA0djMuNDkyIiBzdHJva2U9InJnYigyNTUsIDI1NSwgMjU1KSIvPgogIDwvZz4KPC9zdmc+Cg=="
                alt="private"
              />
              <div>Private</div>
            </div>
          )}
        </div>
        <AudioPlayer
          ref={player}
          className={`player${item.tracks.id}`}
          key={item.tracks.id}
          src={item.tracks[trackIndex].audio}
          onEnded={(e) => playNextTrack(e)}
          onSeeked={moveTrackBar}
          volume={0}
        />
        <button className="seek" id={`seek${item.id}`} onClick={seekPlayer}>
          seek
        </button>
        {item.tracks.length !== 0 &&
          Array.from({ length: item.tracks.length }, (_, i) => i).map(
            (num: any) => (
              <div className={"playlist-track"}>
                <div className={"playlist-track-left"}>
                  {item.tracks[num].image === null && (
                    <img src="/default_track_image.svg" alt="me" />
                  )}
                  {item.tracks[num].image !== null && (
                    <img src={item.tracks[num].image} alt="me" />
                  )}
                  <div>{num + 1}</div>
                  <div onClick={(e) => playThisTrack(num, e)}>
                    {item.tracks[num].title}
                  </div>
                </div>
                <div className={"playlist-track-right"}>
                  <img
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX3BsYXkgNDwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnMvPg0KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPg0KICAgICAgICA8ZyBpZD0ic3RhdHNfcGxheS0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNCwxMyBMNCwzIEwxMyw4IEw0LDEzIFoiIGlkPSJzdGF0c19wbGF5LTMiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiLz4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg0K"
                    alt="play"
                  />
                  <div>{item.tracks[num].play_count}</div>
                </div>
              </div>
            )
          )}
        <div className={"track-buttons"}>
          {isLiking === false && (
            <button onClick={likePlaylist}>
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo="
                alt="heart"
              />
              <div>{likes}</div>
            </button>
          )}
          {isLiking === true && (
            <button className="liked-button" onClick={unlikePlaylist}>
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDI1NSwgODUsIDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo="
                alt="heart"
              />
              <div>{likes}</div>
            </button>
          )}
          {reposted === false && (
            <button onClick={repostPlaylist}>
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYig1MSwgNTEsIDUxKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg=="
                alt="repost"
              />
              <div>{reposts}</div>
            </button>
          )}
          {reposted === true && (
            <button className="reposted-button" onClick={unrepostPlaylist}>
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigyNTUsIDg1LCAwKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg=="
                alt="repost"
              />
              <div>{reposts}</div>
            </button>
          )}
          {/* <button>
            <img
              src="https://a-v2.sndcdn.com/assets/images/share-e2febe1d.svg"
              alt="share"
            />
            <div>Share</div>
          </button>
          <button>
            <img
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iNHB4IiB2aWV3Qm94PSIwIDAgMTQgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8dGl0bGU+bW9yZTwvdGl0bGU+CiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSI3IiBjeT0iMiIgcj0iMiIvPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIyIiByPSIyIi8+CiAgPC9nPgo8L3N2Zz4K"
              alt="more"
            />
            <div>More</div>
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default PlaylistBox;
