import { VideoBackground } from "./components";
import { default as belowVideo } from "/below-video.png";

const videoPaths = [
  "/Vertical_test_scroll-re.mp4",
  "/vertical_test_scroll_2-re.mp4",
  "/horizontal_test_scroll-re.mp4",
];

const posterPaths = [
  "/Vertical_test_scroll-poster.jpg",
  "/vertical_test_scroll_2-poster.jpg",
  "/horizontal_test_scroll-poster.jpg",
];

function useQueryParam(key: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

const App = () => {
  const value: number =
    parseInt(useQueryParam("video") ?? "0", 10) % videoPaths.length;

  const videoPath = videoPaths[value];
  const posterPath = posterPaths[value];

  if (!videoPath) {
    return (
      <div>
        <h1>Video not found</h1>
      </div>
    );
  }

  if (!posterPath) {
    return (
      <div>
        <h1>Poster not found</h1>
      </div>
    );
  }

  return (
    <VideoBackground videoUrl={videoPath} posterUrl={posterPath}>
      <img src={belowVideo} className="w-full" alt="BLK DNM Webshop" />
    </VideoBackground>
  );
};

export default App;
