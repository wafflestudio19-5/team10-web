import MostItems from "./MostItems";
import styles from "./MostList.module.scss";

const MostList = ({
  mostTrackList,
  likeListId,
}: {
  mostTrackList: any;
  likeListId: any;
}) => {
  return (
    <div className={styles.mostList}>
      {mostTrackList.map((item: any) => (
        <MostItems
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

export default MostList;
