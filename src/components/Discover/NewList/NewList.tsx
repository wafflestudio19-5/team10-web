import NewItems from "./NewItems";
import styles from "./NewList.module.scss";

const NewList = ({
  listScroll,
  newTrackList,
  likeListId,
}: {
  listScroll: any;
  newTrackList: any;
  likeListId: any;
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
        />
      ))}
    </div>
  );
};

export default NewList;
