import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import ArtistPageHeader from "../../ArtistPageFix/ArtistPageHeader";
import ArtistPageRight from "../../ArtistPageFix/ArtistPageRight";
import TrackBox from "../../TrackBox/TrackBox";
import "./ArtistPageRepostsTracks.scss";

function ArtistPageRepostsTracks() {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isMe, setIsMe] = useState<boolean>();

  const params = useParams<any>();
  const permalink = params.permalink;
  const [pageId, setPageId] = useState<number>();
  const [myId, setMyId] = useState<number>();

  const [user, setUser] = useState<any>();
  const [header, setHeader] = useState<any>();
  const [ref, inView] = useInView();

  const [repostTracks, setRepostTracks] = useState<any>();
  const [repostTrackPage, setRepostTrackPage] = useState<any>(null);

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

  const getRepostTracks = async (id: any, page: any) => {
    axios
      .get(`/users/${id}/reposts/tracks?page=${page}`)
      .then((res) => {
        if (page === 1) {
          setRepostTracks(
            res.data.results.filter((item: any) => item.is_private === false)
          );
        } else {
          setRepostTracks((item: any) => [
            ...item,
            ...res.data.results.filter(
              (item: any) => item.is_private === false
            ),
          ]);
        }
        if (res.data.next === null) {
          setRepostTrackPage(null);
        } else {
          setRepostTrackPage(page + 1);
        }
      })
      .catch(() => {
        toast("리포스트 불러오기 실패");
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
          setPageId(res1.data.id);
          // 유저 정보
          getUser(res1.data.id);
          //트랙 불러오기
          getRepostTracks(res1.data.id, 1);
        })
        .catch(() => {
          toast("정보 불러오기 실패");
        });
    };
    getInfo();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && repostTrackPage !== null) {
      if (inView) {
        getRepostTracks(pageId, repostTrackPage);
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
              {repostTracks &&
                repostTracks.map((item: any, index: any) => (
                  <TrackBox
                    index={index}
                    item={item}
                    artistName={user.display_name}
                    myId={myId}
                    user={user}
                    currentPlay={currentPlay}
                    setCurrentPlay={setCurrentPlay}
                    myPlaylist={myPlaylist}
                    modalPage={modalPage}
                    getMyPlaylist={getMyPlaylist}
                  />
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

export default ArtistPageRepostsTracks;
