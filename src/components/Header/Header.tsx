import React, { useState } from "react";
import { useHistory } from "react-router";
import "./Header.scss";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useAuthContext } from "../../context/AuthContext";
import { useTrackContext } from "../../context/TrackContext";
import axios from "axios";
import toast from "react-hot-toast";

function Header() {
  const history = useHistory();
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState<boolean>();
  const { userInfo, setUserInfo, setUserSecret } = useAuthContext();
  const {
    setTrackBarArtist,
    setTrackDuration,
    setTrackIsPlaying,
    setPlayingTime,
    setAudioSrc,
    setIsMuted,
    setLoop,
    setTrackBarPlaylist,
    setTrackBarTrack,
    setSeekTime,
    setTrackBarPlaylistId,
  } = useTrackContext();
  const [me, setMe] = useState<any>();

  useEffect(() => {
    setIsLoading(true);

    if (cookies.get("is_logged_in") === undefined) {
      history.push("/");
    }
    if (userInfo.permalink === undefined) {
      const myToken = localStorage.getItem("jwt_token");
      const getMe = async () => {
        const config: any = {
          method: "get",
          url: `/users/me`,
          headers: {
            Authorization: `JWT ${myToken}`,
          },
        };
        try {
          const res = await axios(config);
          setMe({
            profile_img: res.data.image_profile,
            display_name: res.data.display_name,
            permalink: res.data.permalink,
          });
        } catch (error) {
          toast("헤더 정보 불러오기 실패");
        }
      };
      getMe();
    }
    setIsLoading(false);
  }, []);

  const onSignOut = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("permalink");
    localStorage.removeItem("id");
    cookies.remove("is_logged_in", { path: "/" });
    setTrackDuration(0);
    setTrackIsPlaying(false);
    setPlayingTime(0);
    setAudioSrc("");
    setIsMuted(false);
    setLoop(false);
    setTrackBarArtist({
      display_name: "",
      id: 0,
      permalink: "",
    });
    setTrackBarPlaylist([]);
    setTrackBarTrack({
      id: 0,
      title: "",
      permalink: "",
      audio: "",
      image: "",
    });
    setSeekTime(0);
    setTrackBarPlaylistId(undefined);
    setUserSecret({
      jwt: undefined,
      permalink: undefined,
      id: 0,
    });
    setUserInfo({
      profile_img: undefined,
      display_name: undefined,
      permalink: undefined,
    });
    history.push("/logout");
  };

  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_user_image.png";
  };

  if (isLoading || me === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className={"header_bar"}>
        <div className={"header"}>
          <div className={"header_logo"}>
            <span onClick={() => history.push("/discover")}>logo</span>
          </div>

          <div className={"header_menu"}>
            <span onClick={() => history.push("/discover")}>Home</span>
            <span>Stream</span>
            <span onClick={() => history.push("/you/library")}>Library</span>
          </div>

          <div className={"search"}>
            <input placeholder={"Search"} />
          </div>

          <div className={"upload"}>
            <span onClick={() => history.push("/upload")}>Upload</span>
          </div>

          <div className={"header_user"}>
            <div className="dropdown">
              <button type="button" data-bs-toggle="dropdown">
                {userInfo.permalink !== undefined && (
                  <div>
                    {userInfo.profile_img !== null && (
                      <img src={userInfo.profile_img} alt={"user"} />
                    )}
                    {userInfo.profile_img === null && (
                      <img
                        src="/default_user_image.png"
                        alt={"user"}
                        onError={onImageError}
                      />
                    )}
                    <text>{userInfo.display_name}</text>
                  </div>
                )}
                {userInfo.permalink === undefined && (
                  <div>
                    {me.profileImg !== null && (
                      <div>
                        <img src={me.profile_img} alt={"user"} />
                        <text>{me.display_name}</text>
                      </div>
                    )}
                    {me.profileImg === null && (
                      <div>
                        <img src="/default_user_image.png" alt={"user"} />
                        <text>{me.display_name}</text>
                      </div>
                    )}
                  </div>
                )}
              </button>
              <ul className="dropdown-menu">
                <li>
                  {userInfo.permalink !== undefined && (
                    <a
                      className="dropdown-item"
                      onClick={() => history.push(`/${userInfo.permalink}`)}
                    >
                      Profile
                    </a>
                  )}
                  {userInfo.permalink === undefined && (
                    <a
                      className="dropdown-item"
                      onClick={() => history.push(`/${me.permalink}`)}
                    >
                      Profile
                    </a>
                  )}
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => history.push("/you/likes")}
                  >
                    Likes
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => history.push("/you/following")}
                  >
                    Following
                  </a>
                </li>
              </ul>
            </div>

            <a className={"notifications"} />
            <a className={"messages"} />
          </div>

          <div className={"header_more"}>
            <div className="dropdown-more">
              <button type="button" data-bs-toggle="dropdown">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  className="bi bi-three-dots"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" onClick={onSignOut}>
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
