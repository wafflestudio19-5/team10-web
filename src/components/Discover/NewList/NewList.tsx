import NewItems from "./NewItems";
import styles from "./NewList.module.scss";

const NewList = ({
  listScroll,
  newTrackList,
  likeListId,
  setLikeList,
  setLikeCount,
}: {
  listScroll: any;
  newTrackList: any;
  likeListId: any;
  setLikeList: any;
  setLikeCount: any;
}) => {
  return (
    <div className={styles.newList} ref={listScroll}>
      {newTrackList.map((item: any) => (
        <NewItems
          title={item.title}
          img={item.image}
          key={item.id}
          trackId={item.id}
          likeListId={likeListId}
          trackPermalink={item.permalink}
          artistPermalink={item.artist.permalink}
          setLikeList={setLikeList}
          setLikeCount={setLikeCount}
        />
      ))}
    </div>
  );
};

export default NewList;
