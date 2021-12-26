import "./Upload.scss";
import UploadHeader from "./UploadHeader/UploadHeader";
import UploadBox from "./UploadBox/UploadBox";
import { useState } from "react";
import UploadModal from "./UploadModal/UploadModal";

function Upload() {
  const [modal, setModal] = useState(false);

  return (
    <div className={"uploadpage-wrapper"}>
      <div className={"uploadpage"}>
        <UploadHeader />
        {!modal && <UploadBox setModal={setModal} />}
        {modal && <UploadModal />}
      </div>
    </div>
  );
}

export default Upload;
