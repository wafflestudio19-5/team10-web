import { useState } from "react";
import "./PlaylistTrack.scss";

function PlaylistTrack({ item, selectedFiles, newFiles, setNewFiles }: any) {
  const trackTitle = selectedFiles[item].name.substr(
    0,
    selectedFiles[item].name.indexOf(".")
  );
  const [title, setTitle] = useState<string>(trackTitle);

  const changeTitle = (e: any) => {
    setTitle(e.target.value);
    const newState = [...newFiles];
    newState[item] = {
      ...newState[item],
      name: e.target.value,
    };
    setNewFiles(newState);
  };

  return (
    <div className="upload-playlist-track">
      <input value={title} onChange={changeTitle} />
    </div>
  );
}

export default PlaylistTrack;
