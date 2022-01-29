import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import { useAuthContext } from "../../../context/AuthContext";
import ArtistPageHeader from "../ArtistPageFix/ArtistPageHeader";
import ArtistPageRight from "../ArtistPageFix/ArtistPageRight";
import TrackBox from "../TrackBox/TrackBox";
import "./ArtistPageTracks.scss";

function ArtistPageTracks() {
  const { userSecret, userInfo } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isMe, setIsMe] = useState<boolean>();
  const [myImage, setMyImage] = useState<string | undefined | null>();

  const params = useParams<any>();
  const permalink = params.permalink;
  const [pageId, setPageId] = useState<number>();

  const [user, setUser] = useState<any>();
  const [header, setHeader] = useState<any>();
  const [ref, inView] = useInView();

  const [tracks, setTracks] = useState<any>();
  const [trackPage, setTrackPage] = useState<any>(null);

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

  const getTracks = async (id: any, page: any, token: any) => {
    axios
      .get(`/users/${id}/tracks?page=${page}`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .then((res) => {
        if (page === 1) {
          setTracks(res.data.results);
        } else {
          setTracks((item: any) => [...item, ...res.data.results]);
        }
        if (res.data.next === null) {
          setTrackPage(null);
        } else {
          setTrackPage(page + 1);
        }
      })
      .catch(() => {
        toast("트랙 정보 불러오기 실패");
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
    const myToken = localStorage.getItem("jwt_token");

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

    if (userInfo.profile_img === undefined) {
      axios
        .get(`/users/me`, {
          headers: {
            Authorization: `JWT ${myToken}`,
          },
        })
        .then((res) => {
          setMyImage(res.data.image_profile);
        });
    }

    const getInfo = () => {
      // resolve api
      const url = `https://soundwaffle.com/${permalink}`;
      axios
        .get(`resolve?url=${url}`)
        .then((res1) => {
          setPageId(res1.data.id);
          // 유저 정보
          getUser(res1.data.id);
          //트랙 불러오기
          getTracks(res1.data.id, 1, myToken);
        })
        .catch(() => {
          toast("정보 불러오기 실패");
        });
    };
    getInfo();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && trackPage !== null) {
      if (inView) {
        getTracks(pageId, trackPage, userSecret.jwt);
      }
    }
  }, [inView]);

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
              <text>My Tracks</text>
              {tracks &&
                tracks.length !== 0 &&
                tracks.map((item: any, index: any) => (
                  <TrackBox
                    index={index}
                    item={item}
                    artistName={user.display_name}
                    user={user}
                    currentPlay={currentPlay}
                    setCurrentPlay={setCurrentPlay}
                    myPlaylist={myPlaylist}
                    modalPage={modalPage}
                    getMyPlaylist={getMyPlaylist}
                    myImage={myImage}
                  />
                ))}
              {!tracks ||
                (tracks.length === 0 && (
                  <div className="artistpage-empty">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACnBAMAAADd8MzuAAAAJ1BMVEUAAADt7e3v7+/u7u7u7u7v7+/V1dXu7u7v7+/v7+/u7u7u7u7t7e1+coy7AAAADXRSTlMAK4/V8v8GlP29LPOQA9OSagAAAOlJREFUeAHt3CVCBQEUBdCLdxIR3QEkIgvAXRuVRMatswESGVkC68It/jQPOfeP20mjf+Yl6R2dbzgTA0myfTzfeJZ2k+7L+YIsb6VnviQ76auBLzJSA89krAaezX0NvJqXbhrOiwkGg8FgMBgMBoP/E9zV+gpgMBgMBr9MmPq3MBgMBoPB3wb+Hvzd+1MwGAwGf+uDwWDwN/IlLcCfmQKDweDKIxcYDHbvBAaDwWB/hjQAg8FgMLjgfS4wGAwGg30LAwaDwWAwGFxW16euktFDDTyT6xp4v6w+V1lFsroabMnVeNPu7UDyBMXh8J9inpNdAAAAAElFTkSuQmCC"
                      alt="empty"
                    />
                    <div>Seems a little quiet over here</div>
                    <div>Upload a track to share it with your followers.</div>
                    {/* <button onClick={() => history.push(`/upload`)}>
                      Upload now
                    </button> */}
                  </div>
                ))}
              <div ref={ref} className="inView">
                text
              </div>
            </div>
            <ArtistPageRight user={user} />
          </div>
        </div>
      </div>
    );
  }
}

export default ArtistPageTracks;
