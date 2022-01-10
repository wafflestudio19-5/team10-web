import MostItems from "./MostItems";
import styles from "./MostList.module.scss";

const MostList = ({
  mostTrackList,
  likeListId,
  setLikeList,
}: {
  mostTrackList: any;
  likeListId: any;
  setLikeList: any;
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
          trackPermalink={item.permalink}
          artistPermalink={item.artist.permalink}
          setLikeList={setLikeList}
        />
      ))}
    </div>
  );
};

export default MostList;
