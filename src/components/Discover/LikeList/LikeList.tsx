import LikeItems from "./LikeItems";

const LikeList = ({ likeList }: { likeList: any }) => {
  return (
    <>
      {likeList.slice(-3).map((item: any) => (
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
        />
      ))}
    </>
  );
};

export default LikeList;
