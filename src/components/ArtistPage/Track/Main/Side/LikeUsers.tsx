import React from "react";
import styles from "./SideUsers.module.scss";
import { BsSuitHeartFill } from "react-icons/bs";
import { useHistory } from "react-router";
// import { IArtist, ITrack } from "../../TrackPage";
import ReactTooltip from "react-tooltip";
import { ITrackReposter } from "../TrackMain";
import { useAuthContext } from "../../../../../context/AuthContext";

const LikeUsers = ({
  //   track,
  //   artist,
  trackLikers,
  likersCount,
}: {
  //   track: ITrack;
  //   artist: IArtist;
  trackLikers: ITrackReposter[];
  likersCount: number;
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
    <div className={styles.container}>
      <div
        className={styles.title}
        // onClick={() =>
        //   history.push(`${artist.permalink}/${track.permalink}/likes`)
        // }
      >
        <div>
          <BsSuitHeartFill />
          <span>{likersCount} likes</span>
        </div>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.userImages}>
        {trackLikers.map((liker, index) => {
          const clickUser = () => history.push(`/${liker.permalink}`);
          return (
            <>
              <img
                className={styles.image}
                src={liker.image_profile || "/default_user_image.png"}
                onError={onImageError}
                style={{ zIndex: index }}
                onClick={clickUser}
                key={index}
                data-tip={
                  userSecret.id === liker.id ? "You" : liker.display_name
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

export default LikeUsers;
