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

  const params = useParams<any>();
  const permalink = params.permalink;
  const [myId, setMyId] = useState<number>();

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

    // 내 아이디 받아오기 (나중에 context로 바꾸기)
    const myResolve = `https://soundwaffle.com/${myPermalink}`;
    axios
      .get(`resolve?url=${myResolve}`)
      .then((res) => {
        setMyId(res.data.id);
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
          />
          <div className="artist-body">
            <div className={"recent"}>
              <text>My Reposts (Tracks)</text>
              {repostTracks &&
                repostTracks.map((item: any) => (
                  <TrackBox
                    item={item}
                    artistName={user.display_name}
                    myId={myId}
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
              <div
                className="reposts-more"
                onClick={() => history.push(`/${permalink}/reposts/tracks`)}
              >
                + More Tracks
              </div>
              <text>My Reposts (Sets)</text>
              {repostSets &&
                repostSets.map((item: any) => (
                  <PlaylistBox
                    item={item}
                    user={user}
                    currentPlay={currentPlay}
                    setCurrentPlay={setCurrentPlay}
                  />
                ))}
              <div
                className="reposts-more"
                onClick={() => history.push(`/${permalink}/reposts/sets`)}
              >
                + More Sets
              </div>
            </div>
            <ArtistPageRight user={user} />
          </div>
        </div>
      </div>
    );
  }
}

export default ArtistPageReposts;
