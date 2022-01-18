import { FaUserSlash } from "react-icons/fa";
import Follower from "./Follower";
import styles from "./FollowingList.module.scss";

const FollowingList = ({
  followingList,
  fetchFollowList,
}: {
  followingList: any;
  fetchFollowList: any;
}) => {
  return (
    <div
      className={
        followingList.length === 0 ? styles.noItemsWrapper : styles.itemsWrapper
      }
    >
      {followingList.length === 0 ? (
        <div className={styles.noFollowerWrapper}>
          <FaUserSlash className={styles.noFollower} />
          <div className={styles.text}>You aren’t following anyone yet</div>
        </div>
      ) : (
        followingList
          .slice(-4)
          .map((item: any) => (
            <Follower
              img={item.image_profile}
              key={item.id}
              id={item.id}
              display_name={item.display_name}
              permalink={item.permalink}
              follower_count={item.follower_count}
              followingList={followingList}
              fetchFollowList={fetchFollowList}
            />
          ))
      )}
    </div>
  );
};

export default FollowingList;
