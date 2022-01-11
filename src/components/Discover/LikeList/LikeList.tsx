import { BiHeartSquare } from "react-icons/bi";
import LikeItems from "./LikeItems";
import styles from "./LikeList.module.scss";

const LikeList = ({
  likeList,
  setLikeList,
  setLikeCount,
}: {
  likeList: any;
  setLikeList: any;
  setLikeCount: any;
}) => {
  return (
    <>
      {likeList.length === 0 ? (
        <div className={styles.noLikeWrapper}>
          <BiHeartSquare className={styles.noLike} />
          <div>You have no likes yet</div>
        </div>
      ) : (
        likeList
          .slice(0, 3)
          .map((item: any) => (
            <LikeItems
              userPermal={item.artist.permalink}
              trackPermal={item.permalink}
              title={item.title}
              img={item.image}
              artist={item.artist.display_name}
              count={item.count}
              like={item.like_count}
              comment={item.comment_count}
              repost={item.repost_count}
              key={item.id}
              trackId={item.id}
              setLikeList={setLikeList}
              setLikeCount={setLikeCount}
            />
          ))
      )}
    </>
  );
};

export default LikeList;
