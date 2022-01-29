import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory, useParams } from "react-router";
import { useTrackContext } from "../../../context/TrackContext";
import ArtistPageHeader from "../ArtistPageFix/ArtistPageHeader";
import ArtistPageRight from "../ArtistPageFix/ArtistPageRight";
import PlaylistBox from "../PlaylistBox/PlaylistBox";
import TrackBox from "../TrackBox/TrackBox";
import "./ArtistPageReposts.scss";

function ArtistPageReposts() {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState<boolean>();
  const [isMe, setIsMe] = useState<boolean>();

  const params = useParams<any>();
  const permalink = params.permalink;

  const [user, setUser] = useState<any>();
  const [header, setHeader] = useState<any>();

  const [repostTracks, setRepostTracks] = useState<any>();
  const [repostSets, setRepostSets] = useState<any>();

  const [currentPlay, setCurrentPlay] = useState<any>(null);

  const [myPlaylist, setMyPlaylist] = useState<any>(null);
  const [modalPage, setModalPage] = useState<any>(null);

  const getUser = (id: any) => {
    axios
      .get(`users/${id}`)
      .then((res) => {
        setUser(res.data);
        if (res.data.image_header === null) {
          setHeader(
            "https://upload.wikimedia.org/wikipedia/commons/d/d7/Sky.jpg"
          );
        } else {
          setHeader(res.data.image_header);
        }
      })
      .catch(() => {
        toast("유저 정보 불러오기 실패");
      });
  };

  const getRepostTracks = async (id: any) => {
    axios
      .get(`/users/${id}/reposts/tracks?page_size=2`)
      .then((res) => {
        setRepostTracks(
          res.data.results.filter((item: any) => item.is_private === false)
        );
      })
      .catch(() => {
        toast("리포스트 트랙 불러오기 실패");
      });
  };

  const getRepostSets = async (id: any) => {
    axios
      .get(`/users/${id}/reposts/sets?page_size=2`)
      .then((res) => {
        setRepostSets(
          res.data.results.filter((item: any) => item.is_private === false)
        );
      })
      .catch(() => {
        toast("리포스트 트랙 불러오기 실패");
      });
  };

  const getMyPlaylist = async (id: any, page: any) => {
    axios
      .get(`/users/${id}/sets?page=${page}`)
      .then((res) => {
        if (page === 1) {
          setMyPlaylist(res.data.results);
        } else {
          setMyPlaylist((item: any) => [...item, ...res.data.results]);
        }

        if (res.data.next === null) {
          setModalPage(null);
        } else {
          setModalPage(page + 1);
        }
      })
      .catch(() => {
        toast("플레이리스트 불러오기 실패");
      });
  };

  useEffect(() => {
    setIsLoading(true);

    const myPermalink = localStorage.getItem("permalink");

    // 내 페이지인지 확인
    if (permalink === myPermalink) {
      setIsMe(true);
    } else {
      setIsMe(false);
    }

    // 내 아이디 받아오기 (나중에 context로 바꾸기)
    const myResolve = `https://soundwaffle.com/${myPermalink}`;
    axios
      .get(`resolve?url=${myResolve}`)
      .then((res) => {
        getMyPlaylist(res.data.id, 1);
      })
      .catch(() => {
        toast("유저 아이디 불러오기 실패");
      });

    const getInfo = () => {
      // resolve api
      const url = `https://soundwaffle.com/${permalink}`;
      axios
        .get(`resolve?url=${url}`)
        .then((res1) => {
          // 유저 정보
          getUser(res1.data.id);
          //리포스트 불러오기
          getRepostTracks(res1.data.id);
          getRepostSets(res1.data.id);
        })
        .catch(() => {
          toast("정보 불러오기 실패");
        });
    };
    getInfo();
    setIsLoading(false);
  }, []);

  // 하단바 재생관련
  const {
    setTrackIsPlaying,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    trackIsPlaying,
    trackBarTrack,
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

  if (isLoading || user === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="artistpage-wrapper">
        <div className="artistpage">
          <ArtistPageHeader
            header={header}
            user={user}
            setUser={setUser}
            getUser={getUser}
            isMe={isMe}
          />
          <div className="artist-body">
            <div className={"recent"}>
              {repostTracks && repostTracks.length !== 0 && (
                <text>My Reposts (Tracks)</text>
              )}
              {repostTracks &&
                repostTracks.length !== 0 &&
                repostTracks.map((item: any) => (
                  <TrackBox
                    item={item}
                    artistName={user.display_name}
                    user={user}
                    currentPlay={currentPlay}
                    setCurrentPlay={setCurrentPlay}
                    myPlaylist={myPlaylist}
                    modalPage={modalPage}
                    getMyPlaylist={getMyPlaylist}
                    togglePlayPause={togglePlayPause}
                    playMusicBar={playMusic}
                  />
                ))}
              {repostTracks && repostTracks.length !== 0 && (
                <div
                  className="reposts-more"
                  onClick={() => history.push(`/${permalink}/reposts/tracks`)}
                >
                  + More Tracks
                </div>
              )}
              {repostSets && repostSets.length !== 0 && (
                <text>My Reposts (Sets)</text>
              )}
              {repostSets &&
                repostSets.length !== 0 &&
                repostSets.map((item: any) => (
                  <PlaylistBox
                    item={item}
                    user={user}
                    currentPlay={currentPlay}
                    setCurrentPlay={setCurrentPlay}
                  />
                ))}
              {repostSets && repostSets.length !== 0 && (
                <div
                  className="reposts-more"
                  onClick={() => history.push(`/${permalink}/reposts/sets`)}
                >
                  + More Sets
                </div>
              )}
              {!repostTracks && !repostSets && (
                <div className="artistpage-empty">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACnBAMAAADd8MzuAAAAJ1BMVEUAAADt7e3v7+/u7u7u7u7v7+/V1dXu7u7v7+/v7+/u7u7u7u7t7e1+coy7AAAADXRSTlMAK4/V8v8GlP29LPOQA9OSagAAAOlJREFUeAHt3CVCBQEUBdCLdxIR3QEkIgvAXRuVRMatswESGVkC68It/jQPOfeP20mjf+Yl6R2dbzgTA0myfTzfeJZ2k+7L+YIsb6VnviQ76auBLzJSA89krAaezX0NvJqXbhrOiwkGg8FgMBgMBoP/E9zV+gpgMBgMBr9MmPq3MBgMBoPB3wb+Hvzd+1MwGAwGf+uDwWDwN/IlLcCfmQKDweDKIxcYDHbvBAaDwWB/hjQAg8FgMLjgfS4wGAwGg30LAwaDwWAwGFxW16euktFDDTyT6xp4v6w+V1lFsroabMnVeNPu7UDyBMXh8J9inpNdAAAAAElFTkSuQmCC"
                    alt="empty"
                  />
                  <div>Seems a little quiet over here</div>
                  <div>Repost a track to share it with your followers.</div>
                  {/* <button onClick={() => history.push(`/upload`)}>
                    Upload now
                  </button> */}
                </div>
              )}
              {repostTracks &&
                repostSets &&
                repostTracks.length === 0 &&
                repostSets.length === 0 && (
                  <div className="artistpage-empty">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACnBAMAAADd8MzuAAAAJ1BMVEUAAADt7e3v7+/u7u7u7u7v7+/V1dXu7u7v7+/v7+/u7u7u7u7t7e1+coy7AAAADXRSTlMAK4/V8v8GlP29LPOQA9OSagAAAOlJREFUeAHt3CVCBQEUBdCLdxIR3QEkIgvAXRuVRMatswESGVkC68It/jQPOfeP20mjf+Yl6R2dbzgTA0myfTzfeJZ2k+7L+YIsb6VnviQ76auBLzJSA89krAaezX0NvJqXbhrOiwkGg8FgMBgMBoP/E9zV+gpgMBgMBr9MmPq3MBgMBoPB3wb+Hvzd+1MwGAwGf+uDwWDwN/IlLcCfmQKDweDKIxcYDHbvBAaDwWB/hjQAg8FgMLjgfS4wGAwGg30LAwaDwWAwGFxW16euktFDDTyT6xp4v6w+V1lFsroabMnVeNPu7UDyBMXh8J9inpNdAAAAAElFTkSuQmCC"
                      alt="empty"
                    />
                    <div>Seems a little quiet over here</div>
                    <div>Repost a track to share it with your followers.</div>
                    {/* <button onClick={() => history.push(`/upload`)}>
                      Upload now
                    </button> */}
                  </div>
                )}
            </div>
            <ArtistPageRight user={user} />
          </div>
        </div>
      </div>
    );
  }
}

export default ArtistPageReposts;
