import { VideoBackground } from "./components";

const videoPaths = [
  "/Vertical_test_scroll-re.mp4",
  "/vertical_test_scroll_2-re.mp4",
  "/horizontal_test_scroll-re.mp4",
].map((path) => `${import.meta.env.BASE_URL}${path}`);

const posterPaths = [
  "/Vertical_test_scroll-poster.jpg",
  "/vertical_test_scroll_2-poster.jpg",
  "/horizontal_test_scroll-poster.jpg",
].map((path) => `${import.meta.env.BASE_URL}${path}`);

const useQueryParam = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

const App: React.FunctionComponent = () => {
  const value: number =
    parseInt(useQueryParam("video") ?? "0") % videoPaths.length;

  const videoPath = videoPaths[value];
  const posterPath = posterPaths[value];

  if (videoPath === undefined) {
    return (
      <div>
        <h1>Video not found</h1>
      </div>
    );
  }

  if (posterPath === undefined) {
    return (
      <div>
        <h1>Poster not found</h1>
      </div>
    );
  }

  return (
    <VideoBackground posterUrl={posterPath} videoUrl={videoPath} aria-label="BLK DNM Product Showcase video">
      <img
        alt="BLK DNM Webshop"
        className="w-full"
        src={`${import.meta.env.BASE_URL}below-video.png`}
      />
    </VideoBackground>
  );
};

export default App;
