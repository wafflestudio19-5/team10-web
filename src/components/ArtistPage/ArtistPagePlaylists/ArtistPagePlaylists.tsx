import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import ArtistPageHeader from "../ArtistPageFix/ArtistPageHeader";
import ArtistPageRight from "../ArtistPageFix/ArtistPageRight";
import PlaylistBox from "../PlaylistBox/PlaylistBox";
import "./ArtistPagePlaylists.scss";

function ArtistPagePlaylists() {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isMe, setIsMe] = useState<boolean>();

  const params = useParams<any>();
  const permalink = params.permalink;
  const [pageId, setPageId] = useState<number>();
  // const [myId, setMyId] = useState<number>();

  const [user, setUser] = useState<any>();
  const [header, setHeader] = useState<any>();
  const [ref, inView] = useInView();

  const [playlists, setPlaylists] = useState<any>();
  const [playlistPage, setPlaylistPage] = useState<any>(null);

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

  const getPlaylists = async (id: any, page: any) => {
    axios
      .get(`/users/${id}/sets?page=${page}`)
      .then((res) => {
        if (page === 1) {
          setPlaylists(
            res.data.results.filter(
              (item: any) =>
                item.is_private === false &&
                item.tracks.length !== 0 &&
                item.type === "playlist"
            )
          );
        } else {
          setPlaylists((item: any) => [
            ...item,
            ...res.data.results.filter(
              (item: any) =>
                item.is_private === false &&
                item.tracks.length !== 0 &&
                item.type === "playlist"
            ),
          ]);
        }
        if (res.data.next === null) {
          setPlaylistPage(null);
        } else {
          setPlaylistPage(page + 1);
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
      // .then((res) => {
      //   setMyId(res.data.id);
      // })
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
          // 플레이리스트 불러오기
          getPlaylists(res1.data.id, 1);
        })
        .catch(() => {
          toast("정보 불러오기 실패");
        });
    };
    getInfo();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && playlistPage !== null) {
      if (inView) {
        getPlaylists(pageId, playlistPage);
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
              <text>My Playlists</text>
              {playlists &&
                playlists.map((item: any) => (
                  <PlaylistBox
                    item={item}
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
