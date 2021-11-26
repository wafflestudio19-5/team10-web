import './Header.scss';

function Header() {
  return (
    <div className={"header_bar"}>
      <div className={"header"}>

<div className={"header_logo"}>
  <a href={"https://soundcloud.com/discover"}>logo</a>
</div>

<div className={"header_menu"}>
  <a className={"menu1"} href={"/discover"}>Home</a>
  <a href={"/stream"}>Stream</a>
  <a href={"/you/library"}>Library</a>
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
        <img src={"https://cdn-icons.flaticon.com/png/512/3024/premium/3024605.png?token=exp=1637740374~hmac=b07c92b97a898120ac08f473bb27c588"} alt={"user"} />
        <text>김와플</text>
      </div>
    </button>
    <ul className="dropdown-menu">
      <li><a className="dropdown-item" href="#">Profile</a></li>
      <li><a className="dropdown-item" href="#">Likes</a></li>
      <li><a className="dropdown-item" href="#">Stations</a></li>
      <li><a className="dropdown-item" href="#">Following</a></li>
    </ul>
  </div>

  <a href={"/notifications"} className={"notifications"}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-bell-fill" viewBox="0 0 16 16">
      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
    </svg>
  </a>

  <a href={"/messages"} className={"messages"}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-envelope-fill" viewBox="0 0 16 16">
      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
    </svg>
  </a>
</div>

<div className={"header_more"}>
<div className="dropdown-more">
    <button type="button" data-bs-toggle="dropdown">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-three-dots" viewBox="0 0 16 16">
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>
    </button>
    <ul className="dropdown-menu">
      <li><a className="dropdown-item" href="#">About us</a></li>
      <li><a className="dropdown-item" href="#">Sign out</a></li>
    </ul>
  </div>
</div>

</div>
    </div>
  );
}

export default Header;