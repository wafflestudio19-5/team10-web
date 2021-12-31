import "./ArtistPage.scss";
import ReactAudioPlayer from "react-audio-player";
import { Grid } from "semantic-ui-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import EditModal from "./EditModal/EditModal";

function ArtistPage() {
  const params = useParams<any>();
  const permalink = params.permalink;
  const { userSecret } = useAuthContext();
  const myPermalink = userSecret.permalink;
  const [isMe, setIsMe] = useState(false);

  const [modal, setModal] = useState(false);

  const [displayName, setDisplayName] = useState<string>();

  const clickImageInput = (event: any) => {
    event.preventDefault();
    let fileInput = document.getElementById("file-input");
    fileInput?.click();
  };

  useEffect(() => {
    // 내 페이지인지 확인
    if (permalink == myPermalink) {
      setIsMe(true);
    } else {
      setIsMe(false);
    }

    // resolve api
    const url = `https://soundwaffle.com/${permalink}`;
    axios
      .get(`/resolve?url=${url}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/users/6`)
      .then((res) => {
        setDisplayName(res.data.display_name);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div className="artistpage-wrapper">
      <div className={"artistpage"}>
        <div className={"profile-header"}>
          <img
            src={"https://lovemewithoutall.github.io/assets/images/kiki.jpg"}
            alt={"profileImg"}
          />
          <div className={"name"}>
            <div className={"displayname"}>{displayName}</div>
            <div className={"username"}>UserName</div>
          </div>
          {isMe && (
            // 나중에 가능하면 헤더이미지 api 추가하기
            <div className="upload-header-image">
              <button onClick={clickImageInput}>
                <img
                  src="https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg"
                  alt="img"
                />
                <div>Upload header image</div>
              </button>
              <input type="file" id="file-input" />
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
          {isMe && (
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
              <EditModal modal={modal} setModal={setModal} />
            </div>
          )}
          {!isMe && (
            <div className={"menu-right"}>
              <button className="button1">
                <img
                  src="https://a-v2.sndcdn.com/assets/images/start-station-ea018c5a.svg"
                  alt="station"
                />
                <div>Station</div>
              </button>
              <button className="button2">
                <img
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KICA8cGF0aCBmaWxsPSJyZ2IoMjU1LCAyNTUsIDI1NSkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTUuNTQyIDEuMTY3YzIuNzcgMCAzLjM4NiAyLjkxNiAyLjE1NSA2LjEyNSAzLjE2OSAxLjMwOCAzLjM4NiAzLjk3NyAzLjM4NiA0Ljk1OEgwYzAtLjk4MS4yMTgtMy42NSAzLjM4Ny00Ljk1OC0xLjIzMi0zLjIxOC0uNjE2LTYuMTI1IDIuMTU1LTYuMTI1em0wIDEuMTY2Yy0xLjU4NCAwLTIuMTI3IDEuNzctMS4wNjYgNC41NDIuMjI2LjU5LS4wNiAxLjI1NC0uNjQ0IDEuNDk1LTEuNTE3LjYyNi0yLjI2MyAxLjU3Mi0yLjUzNyAyLjcxM2g4LjQ5NGMtLjI3NS0xLjE0MS0xLjAyLTIuMDg3LTIuNTM3LTIuNzEzYTEuMTY3IDEuMTY3IDAgMCAxLS42NDQtMS40OTZjMS4wNi0yLjc2NC41MTYtNC41NC0xLjA2Ni00LjU0em02LjQxNC0uNTgzYy4xNyAwIC4yOTQuMTMuMjk0LjI5MlYzLjVoMS40NThjLjE1NyAwIC4yOTIuMTMyLjI5Mi4yOTR2LjU3OGMwIC4xNy0uMTMuMjk1LS4yOTIuMjk1SDEyLjI1djEuNDU4YS4yOTYuMjk2IDAgMCAxLS4yOTQuMjkyaC0uNTc4YS4yODkuMjg5IDAgMCAxLS4yOTUtLjI5MlY0LjY2N0g5LjYyNWEuMjk2LjI5NiAwIDAgMS0uMjkyLS4yOTV2LS41NzhjMC0uMTcuMTMxLS4yOTQuMjkyLS4yOTRoMS40NThWMi4wNDJjMC0uMTU3LjEzMi0uMjkyLjI5NS0uMjkyaC41Nzh6Ii8+Cjwvc3ZnPgo="
                  alt="follow"
                />
                <div>Follow</div>
              </button>
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
          <div className={"recent"}>
            <text>Recent</text>
            <div className={"recent-track"}>
              <img
                src={
                  "https://i1.sndcdn.com/artworks-000365835504-u9iyi3-t500x500.jpg"
                }
                alt={"trackImg"}
              />
              <div className={"track-right"}>
                <div className={"track-info"}>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="white"
                      className="bi bi-caret-right-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                  </button>
                  <div className={"track-info-name"}>
                    <div className={"artistname"}>ArtistName</div>
                    <div className={"trackname"}>TrackName</div>
                  </div>
                </div>
                <ReactAudioPlayer
                  className="player"
                  controls
                  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                />
                <div className={"comment"}>
                  <img
                    src="https://lovemewithoutall.github.io/assets/images/kiki.jpg"
                    alt="me"
                  />
                  <input placeholder={"Write a comment"} />
                </div>
                <div className={"track-buttons"}>
                  <button>
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo="
                      alt="heart"
                    />
                    <div>121K</div>
                  </button>
                  <button>
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYig1MSwgNTEsIDUxKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg=="
                      alt="repost"
                    />
                    <div>4,664</div>
                  </button>
                  <button>
                    <img
                      src="https://a-v2.sndcdn.com/assets/images/share-e2febe1d.svg"
                      alt="share"
                    />
                    <div>Share</div>
                  </button>
                  <button>
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iNHB4IiB2aWV3Qm94PSIwIDAgMTQgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8dGl0bGU+bW9yZTwvdGl0bGU+CiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSI3IiBjeT0iMiIgcj0iMiIvPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIyIiByPSIyIi8+CiAgPC9nPgo8L3N2Zz4K"
                      alt="more"
                    />
                    <div>More</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Grid className={"artist-info"} columns={3} divided>
            <Grid.Row>
              <Grid.Column className="artist-info-text">
                <div>Followers</div>
                <text>213K</text>
              </Grid.Column>
              <Grid.Column className="artist-info-text">
                <div>Following</div>
                <text>5</text>
              </Grid.Column>
              <Grid.Column className="artist-info-text">
                <div>Tracks</div>
                <text>2</text>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default ArtistPage;
