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
          {myPlaylist && myPlaylist.map((item: any) => <div>{item.title}</div>)}
        </section>
      ) : null}
    </div>
  );
}

export default AddToPlaylist;
