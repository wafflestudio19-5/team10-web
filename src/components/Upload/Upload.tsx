import "./Upload.scss";
import UploadHeader from "./UploadHeader/UploadHeader";
import UploadBox from "./UploadBox/UploadBox";
import { useState } from "react";
import UploadModal from "./UploadModal/UploadModal";

function Upload() {
  const [modal, setModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className={"uploadpage-wrapper"}>
      <div className={"uploadpage"}>
        <UploadHeader />
        {!modal && (
          <UploadBox
            setModal={setModal}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        )}
        {modal && <UploadModal />}
      </div>
    </div>
  );
}

export default Upload;
