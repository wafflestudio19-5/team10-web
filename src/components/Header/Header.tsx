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
  <a href={"/userid"} className={"userid"}>
    <img src={"https://cdn-icons.flaticon.com/png/512/3024/premium/3024605.png?token=exp=1637740374~hmac=b07c92b97a898120ac08f473bb27c588"} alt={"user"} />
  </a>
  <a href={"/notifications"} className={"notifications"}>
    <img src={"https://cdn-icons.flaticon.com/png/512/2529/premium/2529521.png?token=exp=1637740535~hmac=d373d7304d542deeb13b664c59ada146"} alt={"notification"} />
  </a>
  <a href={"/messages"} className={"messages"}>
    <img src={"https://cdn-icons.flaticon.com/png/512/542/premium/542638.png?token=exp=1637740610~hmac=f79cd10820aec7886f5a2279e33e3120"} alt={"message"} />
  </a>
</div>

<div className={"header_more"}>
  <img src={"https://cdn-icons.flaticon.com/png/512/1477/premium/1477110.png?token=exp=1637740719~hmac=cf15566f0cbe9dcf80deae322c4e85dd"} alt={"more"} />
</div>

</div>
    </div>
  );
}

export default Header;