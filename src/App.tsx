import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import TrackPage from "./components/ArtistPage/Track/TrackPage";
import Header from "./components/Header/Header";
import Discover from "./components/Discover/Discover";
import ArtistPage from "./components/ArtistPage/ArtistPage";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";

function App() {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/" && <Header />}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/discover" component={Discover} />
        <Route exact path="/you/library" component={ArtistPage} />
        <Route exact path="/username/trackname" component={TrackPage} />
        <Route exact path="/logout" component={Logout} />
      </Switch>
    </div>
  );
}

export default App;
