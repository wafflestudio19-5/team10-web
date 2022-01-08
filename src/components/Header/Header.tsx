import { useHistory } from "react-router";
import "./Header.scss";
import { useEffect } from "react";
import Cookies from "universal-cookie";

function Header() {
  const history = useHistory();
  const cookies = new Cookies();
  useEffect(() => {
    cookies.get("is_logged_in") === null ? history.push("/") : null;
  }, []);
  const onSignOut = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("permalink");
    localStorage.removeItem("id");
    cookies.remove("is_logged_in");
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
          <span onClick={() => history.push("/you/stream")}>Stream</span>
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
              <div>
                <img
                  src={
                    "https://lovemewithoutall.github.io/assets/images/kiki.jpg"
                  }
                  alt={"user"}
                />
                <text>김와플</text>
              </div>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Likes
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Stations
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Following
                </a>
              </li>
            </ul>
          </div>

          <a href={"/notifications"} className={"notifications"} />
          <a href={"/messages"} className={"messages"} />
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
                <a className="dropdown-item" href="#">
                  About us
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={onSignOut}>
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
