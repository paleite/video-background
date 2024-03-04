import { VideoBackground } from "./components";
import { default as belowVideo } from "/below-video.png";

const App = () => (
  <VideoBackground>
    <img src={belowVideo} className="w-full" alt="BLK DNM Webshop" />
  </VideoBackground>
);

export default App;
