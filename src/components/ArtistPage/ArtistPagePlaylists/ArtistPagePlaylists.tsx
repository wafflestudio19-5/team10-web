import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import ArtistPageHeader from "../ArtistPageFix/ArtistPageHeader";
import ArtistPageRight from "../ArtistPageFix/ArtistPageRight";
import TrackBox from "../TrackBox/TrackBox";
import "./ArtistPagePlaylists.scss";

function ArtistPagePlaylists() {
  const [isLoading, setIsLoading] = useState<boolean>();

  const params = useParams<any>();
  const permalink = params.permalink;
  const [pageId, setPageId] = useState<number>();
  const [myId, setMyId] = useState<number>();

  const [user, setUser] = useState<any>();
  const [header, setHeader] = useState<any>();
  const [ref, inView] = useInView();

  const [tracks, setTracks] = useState<any>();
  const [trackPage, setTrackPage] = useState<any>(null);

  const [currentPlay, setCurrentPlay] = useState<any>(null);

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

  const getTracks = async (id: any, page: any) => {
    axios
      .get(`/users/${id}/tracks?page=${page}`)
      .then((res) => {
        if (page === 1) {
          setTracks(
            res.data.results.filter((item: any) => item.is_private === false)
          );
        } else {
          setTracks((item: any) => [
            ...item,
            ...res.data.results.filter(
              (item: any) => item.is_private === false
            ),
          ]);
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

  useEffect(() => {
    setIsLoading(true);

    const myPermalink = localStorage.getItem("permalink");

    // 내 아이디 받아오기 (나중에 context로 바꾸기)
    const myResolve = `https://soundwaffle.com/${myPermalink}`;
    axios
      .get(`resolve?url=${myResolve}`)
      .then((res) => {
        setMyId(res.data.id);
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
          getTracks(res1.data.id, 1);
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
        getTracks(pageId, trackPage);
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
          />
          <div className="artist-body">
            <div className={"recent"}>
              <text>My Playlists</text>
              {tracks &&
                tracks.map((item: any) => (
                  <TrackBox
                    item={item}
                    artistName={user.display_name}
                    myId={myId}
                    user={user}
                    currentPlay={currentPlay}
                    setCurrentPlay={setCurrentPlay}
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

export default ArtistPagePlaylists;
