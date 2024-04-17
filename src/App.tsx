import { VideoBackground } from "./components";
import { CanvasFrames } from "./components";

type PathToMp4 = `/${string}.mp4`;
type PathToJpg = `/${string}.jpg`;

const videoPaths = (
  [
    "/Vertical_test_scroll-re.mp4",
    "/vertical_test_scroll_2-re.mp4",
    "/horizontal_test_scroll-re.mp4",
    "/Sequence-02-re.mp4",
    "/BLK_DNM_Test_100p01819079.mp4",
    "/BLK_DNM_Test_100p01815476.mp4",
    "/BLK_DNM_Test_100p01814190.mp4",
    "/Sequence-02-re-x265.mp4",
    "/Sequence-02-re-av1.mp4",
    "/Sequence-02-re-large.mp4",
    "/SCROLLWAY_v1.mp4",
    "/Speedramp_BLKDNM.mp4",
    "/Scrollway_iphone.mp4",
  ] as const satisfies PathToMp4[]
).map((path) => `${import.meta.env.BASE_URL}${path}`);

const posterPaths = (
  [
    "/Vertical_test_scroll-poster.jpg",
    "/vertical_test_scroll_2-poster.jpg",
    "/horizontal_test_scroll-poster.jpg",
    "/Sequence-02-poster.jpg",
    "/BLK_DNM_Test_100p01819079-poster.jpg",
    "/BLK_DNM_Test_100p01815476-poster.jpg",
    "/BLK_DNM_Test_100p01814190-poster.jpg",
    "/Sequence-02-poster.jpg",
    "/Sequence-02-poster.jpg",
    "/Sequence-02-poster.jpg",
    "/SCROLLWAY_v1-poster.jpg",
    "/Speedramp_BLKDNM-poster.jpg",
    "/Scrollway_iphone-poster.jpg",
  ] as const satisfies PathToJpg[]
).map((path) => `${import.meta.env.BASE_URL}${path}`);

const durations = [4, 4, 4, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5];

const useQueryParam = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

const App: React.FunctionComponent = () => {
  const mode: "video" | "canvas" =
    useQueryParam("mode") === "canvas" ? "canvas" : "video";
  parseInt(useQueryParam("video") ?? "0") % videoPaths.length;
  const videoIndex: number =
    parseInt(useQueryParam("video") ?? "0") % videoPaths.length;
  const durationParameter = useQueryParam("duration");
  const durationParameterFloat: number | null =
    durationParameter !== null ? parseFloat(durationParameter) : null;

  const videoPath = videoPaths[videoIndex];
  const posterPath = posterPaths[videoIndex];
  const duration =
    durationParameterFloat === null ||
    Number.isNaN(durationParameterFloat) ||
    durationParameterFloat <= 1
      ? durations[videoIndex]
      : durationParameterFloat;

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

  if (duration === undefined) {
    return (
      <div>
        <h1>Video duration not specified</h1>
      </div>
    );
  }

  return mode === "video" ? (
    <>
      <VideoBackground
        aria-label="BLK DNM Product Showcase video"
        posterUrl={posterPath}
        videoUrl={videoPath}
        duration={duration}
      >
        <img
          alt="BLK DNM Webshop"
          className="w-full"
          src={`${import.meta.env.BASE_URL}below-video.png`}
        />
      </VideoBackground>
    </>
  ) : (
    <>
      <CanvasFrames
        aria-label="BLK DNM Product Showcase video"
        posterUrl={posterPath}
        videoUrl={videoPath}
        duration={duration}
      >
        <img
          alt="BLK DNM Webshop"
          className="w-full"
          src={`${import.meta.env.BASE_URL}below-video.png`}
        />
      </CanvasFrames>
    </>
  );
};

export { App };
