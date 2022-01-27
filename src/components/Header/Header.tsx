import { useHistory } from "react-router";
import "./Header.scss";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useAuthContext } from "../../context/AuthContext";

function Header() {
  const history = useHistory();
  const cookies = new Cookies();
  const { userInfo } = useAuthContext();

  useEffect(() => {
    cookies.get("is_logged_in") === undefined && history.push("/");
  }, []);

  const onSignOut = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("permalink");
    localStorage.removeItem("id");
    cookies.remove("is_logged_in", { path: "/" });
    history.push("/logout");
  };

  return (
    <div className={"header_bar"}>
      <div className={"header"}>
        <div className={"header_logo"}>
          <a href={"https://soundcloud.com/discover"}>logo</a>
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
          <a href={"/upload"}>Upload</a>
        </div>

        <div className={"header_user"}>
          <div className="dropdown">
            <button type="button" data-bs-toggle="dropdown">
              {userInfo !== undefined && (
                <div>
                  {userInfo.profile_img !== null && (
                    <img src={userInfo.profile_img} alt={"user"} />
                  )}
                  {userInfo.profile_img === null && (
                    <img src="/default_user_image.png" alt={"user"} />
                  )}
                  <text>{userInfo.display_name}</text>
                </div>
              )}
              {userInfo === undefined && (
                <div>
                  <img src={""} alt={"user"} />
                  <text>user</text>
                </div>
              )}
            </button>
            <ul className="dropdown-menu">
              <li>
                {userInfo !== undefined && (
                  <a
                    className="dropdown-item"
                    onClick={() => history.push(`/${userInfo.permalink}`)}
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
                  onClick={() => history.push("/you/stations")}
                >
                  Stations
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
                <a className="dropdown-item">About us</a>
              </li>
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

export default Header;
