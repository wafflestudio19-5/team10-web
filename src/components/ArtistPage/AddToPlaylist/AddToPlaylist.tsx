import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useAuthContext } from "../../../context/AuthContext";
import "./AddToPlaylist.scss";

function AddToPlaylist({
  playlistModal2,
  setPlaylistModal2,
  myPlaylist,
  item,
  modalPage,
  getMyPlaylist,
  myId,
  artistName,
}: any) {
  const [addOption, setAddOption] = useState<boolean>(true);
  const { userSecret } = useAuthContext();
  const [ref, inView] = useInView();
  console.log(setAddOption);

  // 서버 일시오류가 있는 것 같으니 나중에 다시 해보기 (500에러)
  const addToPlaylist = (id: any) => {
    axios
      .post(
        `https://api.soundwaffle.com/sets/${id}/tracks`,
        {
          track_ids: [{ id: item.id }],
        },
        {
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
        }
      )
      .then(() => {
        toast("플레이리스트에 추가 완료");
      })
      .catch(() => {
        toast("플레이리스트에 추가 실패");
      });
  };

  useEffect(() => {
    if (modalPage !== null) {
      if (inView) {
        getMyPlaylist(myId, modalPage);
      }
    }
  }, [inView]);

  return (
    <div className={playlistModal2 ? "playlistModal2 open" : "playlistModal2"}>
      {playlistModal2 ? (
        <section className={"playlistModal-section"}>
          <div className="playlistModal-header">
            <div className="playlistModal-header-left">
              <div className={addOption ? "addOption true" : "addOption"}>
                Add to playlist
              </div>
              <div
                className={!addOption ? "addOption true" : "addOption"}
                onClick={() => setAddOption(false)}
              >
                Create a playlist
              </div>
            </div>
            <button onClick={() => setPlaylistModal2(false)}>Close</button>
          </div>
          {addOption &&
            myPlaylist &&
            myPlaylist.map((item: any) => (
              <div className="each-playlist">
                <div className="each-playlist-left">
                  {item.image && (
                    <img
                      className="each-playlist-image"
                      src={item.image}
                      alt="image"
                    />
                  )}
                  {!item.image && (
                    <img
                      className="each-playlist-image"
                      src="/default_track_image.svg"
                      alt="image"
                    />
                  )}
                  <div>
                    <div className="each-playlist-title">{item.title}</div>
                    <div className="each-playlist-count">
                      <img
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cmVjdCB4PSI1IiB5PSIxMiIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiB3aWR0aD0iMiIgaGVpZ2h0PSI0Ii8+CiAgICA8cmVjdCB4PSIyMSIgeT0iMTIiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgd2lkdGg9IjIiIGhlaWdodD0iNCIvPgogICAgPHJlY3QgeD0iMTciIHk9IjEwIiBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjgiLz4KICAgIDxyZWN0IHg9IjkiIHk9IjgiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgd2lkdGg9IjIiIGhlaWdodD0iMTIiLz4KICAgIDxyZWN0IHg9IjEzIiB5PSI1IiBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4Ii8+Cjwvc3ZnPgo="
                        alt="count"
                      />
                      <div>{item.track_count}</div>
                    </div>
                  </div>
                </div>
                <button onClick={() => addToPlaylist(item.id)}>
                  Add to playlist
                </button>
              </div>
            ))}
          <div ref={ref} className="inView"></div>
          {!addOption && (
            <div className="create-option">
              <div className="create-option-title">Playlist title *</div>
              <input className="create-option-input" />
              <div className="create-option-privacy-save">
                <div className="create-option-privacy">
                  <div className="privacy-text">Privacy:</div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                    />
                    <label className="form-check-label">Public</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                    />
                    <label className="form-check-label">Privacy</label>
                  </div>
                </div>
                <button>Save</button>
              </div>
              <div className="create-option-track">
                {item.image && <img src={item.image} alt="img" />}
                {!item.image && (
                  <img src="/default_track_image.svg" alt="img" />
                )}
                <div className="artistName">{artistName} - </div>
                <div>{item.title}</div>
              </div>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

export default AddToPlaylist;
