import "./AddToPlaylist.scss";

function AddToPlaylist({ playlistModal, myPlaylist }: any) {
  // const [addOption, setAddOption] = useState<boolean>(true);

  return (
    <div className={playlistModal ? "playlistModal open" : "playlistModal"}>
      {playlistModal ? (
        <section className={"playlistModal-section"}>
          <div className="playlistModal-header">
            <div>Add to playlist</div>
            <div>Create a playlist</div>
          </div>
          {myPlaylist &&
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
                      src="/default.track_image.svg"
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
                <button>Add to playlist</button>
              </div>
            ))}
        </section>
      ) : null}
    </div>
  );
}

export default AddToPlaylist;
