import React from "react";
import styles from "./SideUsers.module.scss";
import { BiRepost } from "react-icons/bi";
import { useHistory } from "react-router";
// import { IArtist, ITrack } from "../../TrackPage";
import ReactTooltip from "react-tooltip";
import { ITrackReposter } from "../TrackMain";
import { useAuthContext } from "../../../../../context/AuthContext";

const RepostUsers = ({
  //   track,
  //   artist,
  repostersCount,
  trackReposters,
}: {
  //   track: ITrack;
  //   artist: IArtist;
  repostersCount: number;
  trackReposters: ITrackReposter[];
}) => {
  const history = useHistory();
  const { userSecret } = useAuthContext();
  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_user_image.png";
  };

  return (
    <div className={styles.container} style={{ marginBottom: "30px" }}>
      <div
        className={styles.title}
        // onClick={() =>
        //   history.push(`${artist.permalink}/${track.permalink}/reposts`)
        // }
      >
        <div>
          <BiRepost />
          <span>{repostersCount} reposts</span>
        </div>
        {/* <span className={styles.viewAll}>View all</span> */}
      </div>
      <div className={styles.userImages}>
        {trackReposters.map((reposter, index) => {
          const clickUser = () => history.push(`/${reposter.permalink}`);
          return (
            <>
              <img
                className={styles.image}
                src={reposter.image_profile || "/default_user_image.png"}
                onError={onImageError}
                style={{ zIndex: index }}
                onClick={clickUser}
                key={index}
                data-tip={
                  userSecret.id === reposter.id ? "You" : reposter.display_name
                }
              />
              <ReactTooltip place="bottom" effect="solid" />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default RepostUsers;
