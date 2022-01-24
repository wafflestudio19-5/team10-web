import ArtistPageHeader from "../ArtistPageFix/ArtistPageHeader";
import ArtistPageRight from "../ArtistPageFix/ArtistPageRight";
import "./ArtistPageTracks.scss";

function ArtistPageTracks() {
  return (
    <div className="artistpage-wrapper">
      <div className="artistpage">
        <ArtistPageHeader />
        <div className="artist-body">
          <div className={"recent"}>
            <text>My Tracks</text>
          </div>
          <ArtistPageRight />
        </div>
      </div>
    </div>
  );
}

export default ArtistPageTracks;
