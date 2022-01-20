import "./Upload.scss";
import UploadHeader from "./UploadHeader/UploadHeader";
import UploadBox from "./UploadBox/UploadBox";
import { useState } from "react";
import UploadModal from "./UploadModal/UploadModal";
import UploadPlaylistModal from "./UploadPlaylistModal/UploadPlaylistModal";

function Upload() {
  const [modal, setModal] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [selectedNum, setSelectedNum] = useState<number>(0);

  const array = Array.from({ length: selectedNum }, (_, i) => i);

  return (
    <div className={"uploadpage-wrapper"}>
      <div className={"uploadpage"}>
        <UploadHeader />
        {!modal && !playlistModal && (
          <UploadBox
            setModal={setModal}
            setPlaylistModal={setPlaylistModal}
            setSelectedFile={setSelectedFile}
            setSelectedNum={setSelectedNum}
          />
        )}
        {modal &&
          array.map((item: any) => (
            <UploadModal
              selectedFile={selectedFile[item]}
              setModal={setModal}
              selectedNum={selectedNum}
            />
          ))}
        {playlistModal && (
          <UploadPlaylistModal
            selectedFile={selectedFile}
            setPlaylistModal={setPlaylistModal}
            selectedNum={selectedNum}
          />
        )}
      </div>
    </div>
  );
}

export default Upload;
