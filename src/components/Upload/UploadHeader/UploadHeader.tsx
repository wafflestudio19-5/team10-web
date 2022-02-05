import { useHistory } from "react-router";
import "./UploadHeader.scss";

function UploadHeader() {
  const checked = (url: string) => {
    return window.location.href.includes(url) ? "upload-menu" : undefined;
  };
  const history = useHistory();
  const clickLink = (link: string) => history.push(link);
  return (
    <div className={"upload-header"}>
      <div className={"upload-header-left"}>
        <span
          onClick={() => clickLink("/upload")}
          className={checked("upload")}
        >
          Upload
        </span>
        <span>Mastering</span>
        <span
          onClick={() => clickLink("/you/tracks")}
          className={checked("/you/tracks")}
        >
          Your tracks
        </span>
        <span className="">Pro Plans</span>
      </div>
      <div className="upload-header-right">
        <a href="https://community.soundcloud.com/">
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNMTEsNCBMOCw0IEw4LDMgTDEzLDMgTDEzLDQgTDEzLDQgTDEzLDggTDEyLDggTDEyLDUgTDYsMTAgTDYsMTAgTDExLDQgWiI+PC9wYXRoPgogICAgPHBhdGggZD0iTTMsMTIgTDksMTIgTDksMTMgTDMsMTMgTDMsMTIgWiBNMywxMiBMMyw3IEw0LDcgTDQsMTIgTDMsMTIgWiBNOSwxMyBMOSwxMCBMMTAsOSBMMTAsMTMgTDksMTMgWiBNMyw3IEwzLDYgTDcsNiBMNiw3IEwzLDcgWiI+PC9wYXRoPgo8L3N2Zz4=" />
          <div>Creators on SoundCloud</div>
        </a>
      </div>
    </div>
  );
}

export default UploadHeader;
