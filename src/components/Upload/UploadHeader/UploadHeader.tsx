import "./UploadHeader.scss";

function UploadHeader() {
  return (
    <div className={"upload-header"}>
      <div className={"upload-header-left"}>
        <a href={"/upload"} className="upload-menu">
          Upload
        </a>
        <a href={"/you/mastering"}>Mastering</a>
        <a href={"/you/tracks"}>Your tracks</a>
        <a href={"/pro"}>Pro Plans</a>
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
