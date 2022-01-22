import "./Upload.scss";
import UploadHeader from "./UploadHeader/UploadHeader";
import UploadBox from "./UploadBox/UploadBox";
import { useState } from "react";
import UploadModal from "./UploadModal/UploadModal";
import UploadPlaylistModal from "./UploadPlaylistModal/UploadPlaylistModal";

function Upload() {
  const [modal, setModal] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any>();

  return (
    <div className={"uploadpage-wrapper"}>
      <div className={"uploadpage"}>
        <UploadHeader />
        {!modal && !playlistModal && (
          <UploadBox
            setModal={setModal}
            setPlaylistModal={setPlaylistModal}
            setSelectedFiles={setSelectedFiles}
          />
        )}
        {modal && (
          <UploadModal selectedFile={selectedFiles} setModal={setModal} />
        )}
        {playlistModal && (
          <UploadPlaylistModal
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            setPlaylistModal={setPlaylistModal}
          />
        )}
      </div>
    </div>
  );
}

export default Upload;
