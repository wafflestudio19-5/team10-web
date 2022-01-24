import "./ArtistPageRight.scss";
import { Grid } from "semantic-ui-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

function ArtistPageRight() {
  const [isLoading, setIsLoading] = useState<boolean>();

  const params = useParams<any>();
  const permalink = params.permalink;

  const [user, setUser] = useState<any>();

  const getUser = (id: any) => {
    axios
      .get(`users/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        toast("유저 정보 불러오기 실패");
      });
  };

  useEffect(() => {
    setIsLoading(true);

    const myPermalink = localStorage.getItem("permalink");

    // 내 아이디 받아오기 (나중에 context로 바꾸기)
    const myResolve = `https://soundwaffle.com/${myPermalink}`;
    axios.get(`resolve?url=${myResolve}`).catch(() => {
      toast("유저 아이디 불러오기 실패");
    });

    const getInfo = () => {
      // resolve api
      const url = `https://soundwaffle.com/${permalink}`;
      axios
        .get(`resolve?url=${url}`)
        .then((res1) => {
          // 유저 정보
          getUser(res1.data.id);
        })
        .catch(() => {
          toast("정보 불러오기 실패");
        });
    };
    getInfo();
    setIsLoading(false);
  }, []);

  if (isLoading || user === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <Grid className={"artist-info"} columns={3} divided>
        <Grid.Row>
          <Grid.Column className="artist-info-text">
            <div>Followers</div>
            <text>{user.follower_count}</text>
          </Grid.Column>
          <Grid.Column className="artist-info-text">
            <div>Following</div>
            <text>{user.following_count}</text>
          </Grid.Column>
          <Grid.Column className="artist-info-text">
            <div>Tracks</div>
            <text>{user.track_count}</text>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ArtistPageRight;
