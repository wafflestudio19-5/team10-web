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
  const [selectedNum, setSelectedNum] = useState<number>(0);
  const [cancelCount, setCancelCount] = useState<number>(0);
  const [numArray, setNumArray] = useState<any>();

  return (
    <div className={"uploadpage-wrapper"}>
      <div className={"uploadpage"}>
        <UploadHeader />
        {!modal && !playlistModal && (
          <UploadBox
            setModal={setModal}
            setPlaylistModal={setPlaylistModal}
            setSelectedFiles={setSelectedFiles}
            setSelectedNum={setSelectedNum}
            setNumArray={setNumArray}
          />
        )}
        {modal &&
          numArray.map((item: number) => (
            <UploadModal
              num={item}
              selectedFile={selectedFiles[item]}
              setModal={setModal}
              selectedNum={selectedNum}
              cancelCount={cancelCount}
              setCancelCount={setCancelCount}
              numArray={numArray}
              setNumArray={setNumArray}
            />
          ))}
        {playlistModal && (
          <UploadPlaylistModal
            selectedFile={selectedFiles}
            setPlaylistModal={setPlaylistModal}
            selectedNum={selectedNum}
          />
        )}
      </div>
    </div>
  );
}

export default Upload;
