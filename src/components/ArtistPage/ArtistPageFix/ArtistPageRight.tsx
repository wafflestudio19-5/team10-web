import "./ArtistPageRight.scss";
import { Grid } from "semantic-ui-react";

function ArtistPageRight({ user }: any) {
  if (user === undefined) {
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
