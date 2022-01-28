import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useTrackContext } from "../../../context/TrackContext";
import AddToPlaylist from "../AddToPlaylist/AddToPlaylist";
import "./TrackBox.scss";

function TrackBox({
  item,
  artistName,
  myId,
  user,
  currentPlay,
  setCurrentPlay,
  myPlaylist,
  modalPage,
  getMyPlaylist,
}: any) {
  const { userSecret } = useAuthContext();
  const history = useHistory();

  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [reposted, setReposted] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [likes, setLikes] = useState<number>(item.like_count);
  const [reposts, setReposts] = useState<number>(item.repost_count);

  const player = useRef<any>();
  const [isPlaying, setIsPlaying] = useState<boolean>();
  const [current, setCurrent] = useState<any>(0);

  const [playlistModal2, setPlaylistModal2] = useState<boolean>(false);

  const likeTrack = async () => {
    const config: any = {
      method: "post",
      url: `/likes/tracks/${item.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setIsLiking(true);
      setLikes(likes + 1);
    } catch (error) {
      toast("트랙 좋아요 실패");
    }
  };

  const unlikeTrack = async () => {
    const config: any = {
      method: "delete",
      url: `/likes/tracks/${item.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setIsLiking(false);
      setLikes(likes - 1);
    } catch (error) {
      toast("트랙 좋아요 취소 실패");
    }
  };

  const repostTrack = async () => {
    const config: any = {
      method: "post",
      url: `/reposts/tracks/${item.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setReposted(true);
      setReposts(reposts + 1);
    } catch (error) {
      toast("트랙 리포스트 실패");
    }
  };

  const unrepostTrack = async () => {
    const config: any = {
      method: "delete",
      url: `/reposts/tracks/${item.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setReposted(false);
      setReposts(reposts - 1);
    } catch (error) {
      toast("트랙 리포스트 취소 실패");
    }
  };

  const postComment = (e: any) => {
    if (e.key === "Enter") {
      if (comment !== "") {
        axios
          .post(
            `/tracks/${item.id}/comments`,
            {
              content: comment,
            },
            {
              headers: {
                Authorization: `JWT ${userSecret.jwt}`,
              },
            }
          )
          .then(() => {
            toast("댓글 작성 완료");
            setComment("");
          })
          .catch(() => {
            toast("댓글 작성 실패");
          });
      } else {
        toast("댓글을 입력해주세요.");
      }
    }
  };

  useEffect(() => {
    player.current.audio.current.pause();

    const getIsLiking = (id: any) => {
      axios.get(`/users/${id}/likes/tracks`).then((res) => {
        const pages = Array.from(
          { length: Math.floor(res.data.count / 10) + 1 },
          (_, i) => i + 1
        );
        pages.map((page) => {
          axios.get(`users/${id}/likes/tracks?page=${page}`).then((res) => {
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
      axios.get(`/users/${id}/reposts/tracks`).then((res) => {
        const pages = Array.from(
          { length: Math.floor(res.data.count / 10) + 1 },
          (_, i) => i + 1
        );
        pages.map((page) => {
          axios.get(`users/${id}/reposts/tracks?page=${page}`).then((res) => {
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
    trackBarPlaylist,
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
      audioPlayer.current.currentTime = current;
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      }, 1);
    }
  };

  const [barPlaying, setBarPlaying] = useState(false);

  const handlePlay = (e: any) => {
    e.stopPropagation();
    togglePlayPause(item, user);
    trackBarTrack.id === item.id
      ? setBarPlaying(!trackIsPlaying)
      : setBarPlaying(true);
  };

  const playMusic = (e: any) => {
    if (trackBarTrack.id === item.id) {
      if (trackBarPlaylist !== []) {
        setTrackBarPlaylist([]);
        setIsPlaying(true);
        player.current.audio.current.play();
        setCurrentPlay(item.id);
        audioPlayer.current.currentTime = 0;
      }
    } else {
      if (barPlaying) {
        handlePlay(e);
      }
      if (currentPlay !== null) {
        let current = document.getElementById(`button${currentPlay}`);
        current?.click();
      }
      setIsPlaying(true);
      player.current.audio.current.play();
      setCurrentPlay(item.id);
      handlePlay(e);
    }
  };

  const pauseMusic = (e: any) => {
    setCurrentPlay(null);
    setCurrent(player.current.audio.current.currentTime);
    setIsPlaying(false);
    player.current.audio.current.pause();
    handlePlay(e);
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
      {item.image !== null && (
        <img
          className="track-Img"
          src={item.image}
          alt={"trackImg"}
          onClick={() => history.push(`/${user.permalink}/${item.permalink}`)}
        />
      )}
      {item.image === null && (
        <img
          className="track-Img"
          src="/default_track_image.svg"
          alt={"trackImg"}
          onClick={() => history.push(`/${user.permalink}/${item.permalink}`)}
        />
      )}
      <div className={"track-right"}>
        <div className="track-info-private">
          <div className={"track-info"}>
            {!isPlaying && (
              <button onClick={(e) => playMusic(e)} className="play-button">
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
              <div className={"artistname"}>{artistName}</div>
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
          className={`player${item.id}`}
          src={item.audio}
          key={item.id}
          ref={player}
          onSeeked={moveTrackBar}
          volume={0}
        />
        <button className="seek" id={`seek${item.id}`} onClick={seekPlayer}>
          seek
        </button>
        <div className={"comment"}>
          {user.image_profile === null && (
            <img src="/default_user_image.png" alt="me" />
          )}
          {user.image_profile !== null && (
            <img src={user.image_profile} alt="me" />
          )}
          <input
            placeholder={"Write a comment and Press Enter"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={postComment}
          />
        </div>
        <div className="track-buttons-count">
          <div className={"track-buttons"}>
            {isLiking === false && (
              <button onClick={likeTrack}>
                <img
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo="
                  alt="heart"
                />
                <div>{likes}</div>
              </button>
            )}
            {isLiking === true && (
              <button className="liked-button" onClick={unlikeTrack}>
                <img
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDI1NSwgODUsIDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo="
                  alt="heart"
                />
                <div>{likes}</div>
              </button>
            )}
            {reposted === false && (
              <button onClick={repostTrack}>
                <img
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYig1MSwgNTEsIDUxKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg=="
                  alt="repost"
                />
                <div>{reposts}</div>
              </button>
            )}
            {reposted === true && (
              <button className="reposted-button" onClick={unrepostTrack}>
                <img
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigyNTUsIDg1LCAwKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg=="
                  alt="repost"
                />
                <div>{reposts}</div>
              </button>
            )}
            <button
              className="add-to-playlist"
              onClick={() => setPlaylistModal2(true)}
            >
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPkdyb3VwPC90aXRsZT4NCiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4NCiAgICA8ZGVmcy8+DQogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgICAgIDxnIGlkPSJhZGQtdG8tcGxheWxpc3QiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigzNCwgMzQsIDM0KSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNMTIsMyBMMTIsMSBMMTQsMSBMMTQsMyBMMTYsMyBMMTYsNSBMMTQsNSBMMTQsNyBMMTIsNyBMMTIsNSBMMTAsNSBMMTAsMyBMMTIsMyBaIE0wLDMgTDAsNSBMOCw1IEw4LDMgTDAsMyBaIE0wLDcgTDAsOSBMMTAsOSBMMTAsNyBMMCw3IFogTTAsMTEgTDAsMTMgTDEwLDEzIEwxMCwxMSBMMCwxMSBaIiBpZD0iUmVjdGFuZ2xlLTIwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgICAgIDwvZz4NCiAgICA8L2c+DQo8L3N2Zz4NCg=="
                alt="playlist"
              />
              <div>Add to playlist</div>
            </button>
            <AddToPlaylist
              playlistModal2={playlistModal2}
              setPlaylistModal2={setPlaylistModal2}
              myPlaylist={myPlaylist}
              item={item}
              modalPage={modalPage}
              getMyPlaylist={getMyPlaylist}
              myId={myId}
              artistName={artistName}
            />
            {/* <button>
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iNHB4IiB2aWV3Qm94PSIwIDAgMTQgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8dGl0bGU+bW9yZTwvdGl0bGU+CiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSI3IiBjeT0iMiIgcj0iMiIvPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIyIiByPSIyIi8+CiAgPC9nPgo8L3N2Zz4K"
                alt="more"
              />
              <div>More</div>
            </button> */}
          </div>
          <div className="track-count">
            <div className="track-count-play">
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX3BsYXkgNDwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnMvPg0KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPg0KICAgICAgICA8ZyBpZD0ic3RhdHNfcGxheS0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNCwxMyBMNCwzIEwxMyw4IEw0LDEzIFoiIGlkPSJzdGF0c19wbGF5LTMiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiLz4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg0K"
                alt="play"
              />
              <div>{item.play_count}</div>
            </div>
            <div className="track-count-play">
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2NvbW1lbnQ8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPGcgaWQ9InN0YXRzX2NvbW1lbnQiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNC45OTk2MTQ5OCwzIEMzLjg5NTI1ODEyLDMgMywzLjg4NjU1NDg0IDMsNS4wMDU5MTkwNSBMMyw3Ljk5NDA4MDk1IEMzLDkuMTAxOTE5NDUgMy44ODc0MzMyOSwxMCA0Ljk5OTYxNDk4LDEwIEwxMS4wMDAzODUsMTAgQzEyLjEwNDc0MTksMTAgMTMsOS4xMTM0NDUxNiAxMyw3Ljk5NDA4MDk1IEwxMyw1LjAwNTkxOTA1IEMxMywzLjg5ODA4MDU1IDEyLjExMjU2NjcsMyAxMS4wMDAzODUsMyBMNC45OTk2MTQ5OCwzIFogTTUsMTAgTDUsMTMgTDgsMTAgTDUsMTAgWiIgaWQ9IlJlY3RhbmdsZS00MiIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIvPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+DQo="
                alt="play"
              />
              <div>{item.comment_count}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackBox;
