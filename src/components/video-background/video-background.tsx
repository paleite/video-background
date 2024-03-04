import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * IMPORTANT: This component relies on having properly encoded videos and having
 * battery saver mode turned off.
 *
 * To properly encode videos for the web, use the following settings:
 * ```sh
 * ffmpeg -i public/horizontal_test_scroll.mp4 -vf scale=376:668 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p public/horizontal_test_scroll-re.mp4
 * ffmpeg -i public/vertical_test_scroll_2.mp4 -vf scale=376:668 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p public/vertical_test_scroll_2-re.mp4
 * ffmpeg -i public/Vertical_test_scroll.mp4 -vf scale=376:668 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p public/Vertical_test_scroll-re.mp4
 * ```
 *
 * If battery saver mode is on, the video won't play on interaction in iOS
 * Safari because Safari blocks autoplaying videos, which is required for the
 * GSAP ScrollTrigger to work properly.
 */
const screenHeightsToAnimateOver = 3;

const getScreenHeights = (screenHeightsToAnimateOver: number) => {
  return {
    percentage: `${Math.max((screenHeightsToAnimateOver - 1) * 100, 0)}%`,
    viewport: `${Math.max(screenHeightsToAnimateOver * 100, 0)}vh`,
  };
};

const heights = getScreenHeights(screenHeightsToAnimateOver);

const videoPaths = [
  // These videos are re-encodes (hence the -re suffix in the filename), which work better with the GSAP ScrollTrigger in browsers.
  "/Vertical_test_scroll-re.mp4",
  "/vertical_test_scroll_2-re.mp4",
  "/horizontal_test_scroll-re.mp4",

  // This video didn't work well, because of the codec used
  // "/Vertical_test_scroll.mp4",

  // The dropbox below used a well-encoded video, which is why I've included it here
  // "https://www.dropbox.com/scl/fi/qejf5dgqiv6m77d71r2ec/abstract-background-ink-water-20072.mp4?rlkey=zwgwzw4bfhx7oy034t7un6mod&raw=1",
];

gsap.registerPlugin(ScrollTrigger);

const VideoBackground: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt to play video and catch any errors. This is necessary for iOS
    // Safari to show the video on interaction.
    (async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Video play failed", error);
      }
    })();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: video,
        start: "top top",
        end: "bottom+=" + heights.percentage + " bottom",
        scrub: true,
        markers: import.meta.env.PROD !== true,
      },
    });

    video.onloadedmetadata = () => {
      tl.to(video, { currentTime: video.duration });
    };

    // Cleanup function to kill the GSAP timeline on component unmount
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <div
        className="overflow-hidden"
        style={{ height: heights.viewport }}
        data-testid="video-container"
      >
        <video
          data-testid="video"
          ref={videoRef}
          className="fixed h-screen w-screen object-cover"
          muted
          playsInline
          // webkit-playsinline={true}
          preload="auto"
        >
          <source src={videoPaths[0]} type="video/mp4" />
        </video>
      </div>
      <div className="relative">{children}</div>
    </>
  );
};

export { VideoBackground };
