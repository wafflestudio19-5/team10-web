import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import TrackPage from "./components/ArtistPage/Track/TrackPage";
import Header from "./components/Header/Header";
import styles from "./App.module.scss";
import Discover from "./components/Discover/Discover";
import ArtistPage from "./components/ArtistPage/ArtistPage";

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <BrowserRouter>
        <Switch>
          <Route exact path="/discover" component={Discover} />
          <Route exact path="/you/library" component={ArtistPage} />
          <Route exact path="/username/trackname" component={TrackPage} />
          <Redirect to="/discover" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
