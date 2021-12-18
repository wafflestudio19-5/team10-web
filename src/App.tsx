import Login from "./components/Login/Login";
import TrackPage from "./components/ArtistPage/Track/TrackPage";
import Header from "./components/Header/Header";
import Discover from "./components/Discover/Discover";
import ArtistPage from "./components/ArtistPage/ArtistPage";
import Logout from "./components/Logout/Logout";
import { Switch, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Upload from "./components/Upload/Upload";

function App() {
  const location = useLocation();
  return (
    <div>
      <Toaster />
      {location.pathname !== "/" ? <Header /> : null}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/discover" component={Discover} />
        <Route exact path="/username" component={ArtistPage} />
        <Route exact path="/username/trackname" component={TrackPage} />
        <Route exact path="/upload" component={Upload} />
        <Route exact path="/logout" component={Logout} />
      </Switch>
    </div>
  );
}

export default App;
