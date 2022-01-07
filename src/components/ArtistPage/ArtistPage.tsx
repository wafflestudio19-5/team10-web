import "./ArtistPage.scss";
import { Grid } from "semantic-ui-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import EditModal from "./EditModal/EditModal";
import toast from "react-hot-toast";
import TrackBox from "./TrackBox/TrackBox";
import { useAuthContext } from "../../context/AuthContext";

function ArtistPage() {
  const [isLoading, setIsLoading] = useState<boolean>();

  const { userSecret } = useAuthContext();
  const params = useParams<any>();
  const permalink = params.permalink;
  const [isMe, setIsMe] = useState<boolean>();
  const [pageId, setPageId] = useState<number>();
  const [myId, setMyId] = useState<number>();

  const [modal, setModal] = useState(false);

  const [user, setUser] = useState<any>();

  const [header, setHeader] = useState<any>();

  const [tracks, setTracks] = useState<any>();
  const [trackPage, setTrackPage] = useState<any>();
  const [isFollowing, setIsFollowing] = useState<boolean>();

  const clickImageInput = (event: any) => {
    event.preventDefault();
    let fileInput = document.getElementById("file-input3");
    fileInput?.click();
  };

  const changeHeader = (event: any) => {
    const changeHeaderImg = async () => {
      const config: any = {
        method: "patch",
        url: `/users/me`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          image_header_filename: event.target.files[0].name,
        },
      };
      try {
        const res = await axios(config);
        const img_options = {
          headers: {
            "Content-Type": event.target.files[0].type,
          },
        };
        axios
          .put(
            res.data.image_header_presigned_url,
            event.target.files[0],
            img_options
          )
          .catch(() => {
            toast("헤더이미지 업로드 실패");
          });
      } catch (error) {
        toast("헤더이미지 업로드 실패");
      }
    };
    changeHeaderImg();
    getUser(pageId);
  };

  const handleScroll = () => {
    const scrollObject = document.documentElement;
    const browser = scrollObject.scrollHeight;
    const seen = scrollObject.clientHeight + window.scrollY;
    if (seen === browser && trackPage !== null) {
      getTracks(pageId, trackPage);
    }
  };

  const getUser = (id: any) => {
    axios
      .get(`users/${id}`)
      .then((res) => {
        setUser(res.data);
        if (res.data.image_header === null) {
          setHeader(
            "url(https://upload.wikimedia.org/wikipedia/commons/d/d7/Sky.jpg)"
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

  const getFollowers = (id: any, myPermalink: any) => {
    // 팔로워 불러오기
    axios
      .get(`users/${id}/followers`)
      .then((res) => {
        const pages = Array.from(
          { length: Math.floor(res.data.count / 10) + 1 },
          (_, i) => i + 1
        );
        pages.map((page) => {
          axios.get(`users/${id}/followers?page=${page}`).then((res) => {
            const filter = res.data.results.filter(
              (item: any) => item.permalink == myPermalink
            );
            if (filter.length === 0) {
              setIsFollowing(false);
            } else {
              setIsFollowing(true);
            }
          });
        });
      })
      .catch((err) => {
        console.log(err);
        toast("팔로워 불러오기 실패");
      });
  };

  const followUser = async () => {
    const config: any = {
      method: "post",
      url: `/users/me/followings/${pageId}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setIsFollowing(true);
      getUser(pageId);
    } catch (error) {
      toast("팔로우 실패");
    }
  };

  const unfollowUser = async () => {
    const config: any = {
      method: "delete",
      url: `/users/me/followings/${pageId}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
    };
    try {
      await axios(config);
      setIsFollowing(false);
      getUser(pageId);
    } catch (error) {
      toast("언팔로우 실패");
    }
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
          //팔로워 불러오기
          getFollowers(res1.data.id, myPermalink);
        })
        .catch(() => {
          toast("정보 불러오기 실패");
        });
    };
    getInfo();
    setIsLoading(false);
  }, []);

  if (isLoading || user === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="artistpage-wrapper">
        <div className={"artistpage"}>
          <div
            className={"profile-header"}
            style={{
              backgroundImage: header,
            }}
          >
            {user.image_profile === null && (
              <img src={"img/user_img.png"} alt={"profileImg"} />
            )}
            {user.image_profile !== null && (
              <img src={user.image_profile} alt={"profileImg"} />
            )}
            <div className={"name"}>
              <div className={"displayname"}>{user.display_name}</div>
              {user.first_name + user.last_name !== "" && (
                <div className={"username"}>
                  {user.first_name + user.last_name}
                </div>
              )}
            </div>
            {isMe === true && (
              <div className="upload-header-image">
                <button onClick={clickImageInput}>
                  <img
                    src="https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg"
                    alt="img"
                  />
                  <div>Upload header image</div>
                </button>
                <input type="file" id="file-input3" onChange={changeHeader} />
              </div>
            )}
          </div>

          <div className={"menu-bar"}>
            <div className={"menu-left"}>
              <a href={`/${permalink}`}>All</a>
              <a href={`/${permalink}/popular-tracks`}>Popular tracks</a>
              <a href={`/${permalink}/tracks`}>Tracks</a>
              <a href={`/${permalink}/albums`}>Albums</a>
              <a href={`/${permalink}/sets`}>Playlists</a>
              <a href={`/${permalink}/reposts`}>Reposts</a>
            </div>
            {isMe === true && (
              <div className="menu-right">
                <button className="button3">
                  <img
                    src="https://a-v2.sndcdn.com/assets/images/share-e2febe1d.svg"
                    alt="share"
                  />
                  <div>Share</div>
                </button>
                <button className="button6" onClick={() => setModal(true)}>
                  <img
                    src="https://a-v2.sndcdn.com/assets/images/edit-2fe52d66.svg"
                    alt="edit"
                  />
                  <div>Edit</div>
                </button>
                <EditModal
                  user={user}
                  modal={modal}
                  setModal={setModal}
                  getUser={getUser}
                />
              </div>
            )}
            {isMe === false && (
              <div className={"menu-right"}>
                <button className="button1">
                  <img
                    src="https://a-v2.sndcdn.com/assets/images/start-station-ea018c5a.svg"
                    alt="station"
                  />
                  <div>Station</div>
                </button>
                {isFollowing === false && (
                  <button className="button2" onClick={followUser}>
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KICA8cGF0aCBmaWxsPSJyZ2IoMjU1LCAyNTUsIDI1NSkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTUuNTQyIDEuMTY3YzIuNzcgMCAzLjM4NiAyLjkxNiAyLjE1NSA2LjEyNSAzLjE2OSAxLjMwOCAzLjM4NiAzLjk3NyAzLjM4NiA0Ljk1OEgwYzAtLjk4MS4yMTgtMy42NSAzLjM4Ny00Ljk1OC0xLjIzMi0zLjIxOC0uNjE2LTYuMTI1IDIuMTU1LTYuMTI1em0wIDEuMTY2Yy0xLjU4NCAwLTIuMTI3IDEuNzctMS4wNjYgNC41NDIuMjI2LjU5LS4wNiAxLjI1NC0uNjQ0IDEuNDk1LTEuNTE3LjYyNi0yLjI2MyAxLjU3Mi0yLjUzNyAyLjcxM2g4LjQ5NGMtLjI3NS0xLjE0MS0xLjAyLTIuMDg3LTIuNTM3LTIuNzEzYTEuMTY3IDEuMTY3IDAgMCAxLS42NDQtMS40OTZjMS4wNi0yLjc2NC41MTYtNC41NC0xLjA2Ni00LjU0em02LjQxNC0uNTgzYy4xNyAwIC4yOTQuMTMuMjk0LjI5MlYzLjVoMS40NThjLjE1NyAwIC4yOTIuMTMyLjI5Mi4yOTR2LjU3OGMwIC4xNy0uMTMuMjk1LS4yOTIuMjk1SDEyLjI1djEuNDU4YS4yOTYuMjk2IDAgMCAxLS4yOTQuMjkyaC0uNTc4YS4yODkuMjg5IDAgMCAxLS4yOTUtLjI5MlY0LjY2N0g5LjYyNWEuMjk2LjI5NiAwIDAgMS0uMjkyLS4yOTV2LS41NzhjMC0uMTcuMTMxLS4yOTQuMjkyLS4yOTRoMS40NThWMi4wNDJjMC0uMTU3LjEzMi0uMjkyLjI5NS0uMjkyaC41Nzh6Ii8+Cjwvc3ZnPgo="
                      alt="follow"
                    />
                    <div>Follow</div>
                  </button>
                )}
                {isFollowing === true && (
                  <button className="button7" onClick={unfollowUser}>
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KICA8cGF0aCBmaWxsPSJyZ2IoMjU1LCA4NSwgMCkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUuNTQyIDEuMTY3YzIuMTA3IDAgMi43OTUgMi4yNDYgMS42MSA1LjMzMi0uNDQ0Ljc5My4wMyAxLjIxMS4zMjIgMS4zMzIgMi4wMjYuODM2IDIuODc1IDIuMjEzIDMuMDI2IDMuODM2di41ODNILjU4M3YtLjU4M2MuMTUxLTEuNjIzIDEtMyAzLjAyNi0zLjgzNi4yOTItLjEyLjc2Ni0uNTQuMzIyLTEuMzMxLTEuMTg0LTMuMDk1LS40OTctNS4zMzMgMS42MS01LjMzM3pNMTMuNDcgMy4xOGwuMDU4LjA1LjIzLjIyOGEuNDE1LjQxNSAwIDAgMSAuMDU3LjUyNmwtLjA1My4wNjUtMi43MTQgMi43MTRhLjQwOS40MDkgMCAwIDEtLjUuMDY2bC0uMDQ1LS4wMy0uMDQzLS4wMzgtMS40NzItMS40NzJhLjQyMi40MjIgMCAwIDEtLjA1MS0uNTI3bC4wNTQtLjA2Ni4yMjktLjIzYS40MTUuNDE1IDAgMCAxIC41MjgtLjA1NWwuMDY1LjA1My45NDIuOTQzIDIuMTgyLTIuMTgzYS40MS40MSAwIDAgMSAuNTMzLS4wNDR6Ii8+Cjwvc3ZnPgo="
                      alt="following"
                    />
                    <div>Following</div>
                  </button>
                )}
                <button className="button3">
                  <img
                    src="https://a-v2.sndcdn.com/assets/images/share-e2febe1d.svg"
                    alt="share"
                  />
                  <div>Share</div>
                </button>
                <button className="button4">
                  <img
                    src="https://a-v2.sndcdn.com/assets/images/message-a0c65ef1.svg"
                    alt="message"
                  />
                </button>
                <button className="button5">
                  <img
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iNHB4IiB2aWV3Qm94PSIwIDAgMTQgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8dGl0bGU+bW9yZTwvdGl0bGU+CiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSI3IiBjeT0iMiIgcj0iMiIvPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIyIiByPSIyIi8+CiAgPC9nPgo8L3N2Zz4K"
                    alt="more"
                  />
                </button>
              </div>
            )}
          </div>

          <div className="artist-body">
            <div className={"recent"} onScroll={handleScroll}>
              {tracks &&
                tracks.map((item: any) => (
                  <TrackBox
                    item={item}
                    artistName={user.display_name}
                    myId={myId}
                    getTracks={getTracks}
                    pageId={pageId}
                    trackPage={trackPage}
                  />
                ))}
            </div>

            <Grid className={"artist-info"} columns={3} divided>
              <Grid.Row>
                <Grid.Column className="artist-info-text">
                  <div>Followers</div>
                  <text>{user.follower_count}</text>
                </Grid.Column>
                <Grid.Column className="artist-info-text">
                  <div>Following</div>
                  <text>{user.following_count}</text>
                </Grid.Column>
                <Grid.Column className="artist-info-text">
                  <div>Tracks</div>
                  <text>{user.track_count}</text>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default ArtistPage;
