import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import ArtistPageHeader from "../../ArtistPageFix/ArtistPageHeader";
import ArtistPageRight from "../../ArtistPageFix/ArtistPageRight";
import PlaylistBox from "../../PlaylistBox/PlaylistBox";
import "./ArtistPageRepostsSets.scss";

function ArtistPageRepostsSets() {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isMe, setIsMe] = useState<boolean>();

  const params = useParams<any>();
  const permalink = params.permalink;
  const [pageId, setPageId] = useState<number>();

  const [user, setUser] = useState<any>();
  const [header, setHeader] = useState<any>();
  const [ref, inView] = useInView();

  const [repostsSets, setRepostsSets] = useState<any>();
  const [repostsSetsPage, setRepostsSetsPage] = useState<any>(null);

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

  const getRepostsSets = async (id: any, page: any) => {
    axios
      .get(`/users/${id}/reposts/sets?page=${page}`)
      .then((res) => {
        if (page === 1) {
          setRepostsSets(
            res.data.results.filter((item: any) => item.is_private === false)
          );
        } else {
          setRepostsSets((item: any) => [
            ...item,
            ...res.data.results.filter(
              (item: any) => item.is_private === false
            ),
          ]);
        }
        if (res.data.next === null) {
          setRepostsSetsPage(null);
        } else {
          setRepostsSetsPage(page + 1);
        }
      })
      .catch(() => {
        toast("리포스트 불러오기 실패");
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
          getRepostsSets(res1.data.id, 1);
        })
        .catch(() => {
          toast("정보 불러오기 실패");
        });
    };
    getInfo();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && repostsSetsPage !== null) {
      if (inView) {
        getRepostsSets(pageId, repostsSetsPage);
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
              <text>My Reposts (Sets)</text>
              {repostsSets &&
                repostsSets.map((item: any) => (
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

export default ArtistPageRepostsSets;
