import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const screenHeightsToAnimateOver = 3;

const getScreenHeights = (screenHeightsToAnimateOver: number) => {
  return {
    percentage: `${Math.max((screenHeightsToAnimateOver - 1) * 100, 0)}%`,
    viewport: `${Math.max(screenHeightsToAnimateOver * 100, 0)}vh`,
  };
};

const heights = getScreenHeights(screenHeightsToAnimateOver);

/**
 * NOTE: This demo needs to be run with battery saver mode turned off, as
 * automatic playback of the video is disabled in that mode.
 *
 * The video ends at 100% + 200%, so its container is set to 300vh.
 * See the elements with the data-testid="video-container" and
 * data-testid="video" attributes in the JSX below.
 */

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
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: video,
        start: "top top",
        end: "bottom+="+heights.percentage+" bottom",
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

  // Function to handle manual play trigger for iOS Safari. Without this, the video won't play on interaction.
  const handleVideoInteraction = () => {
    if (!isPlaying) {
      const video = videoRef.current;
      if (video) {
        video
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log("Paused video");
            video.pause();
          })
          .catch((error) =>
            console.error("Video play on interaction failed:", error),
          );
      }
    }
  };

  return (
    <>
      <div
        onClick={handleVideoInteraction}
        style={{ height: heights.viewport }}
        data-testid="video-container"
      >
        <video
          data-testid="video"
          ref={videoRef}
          className="fixed h-screen w-screen object-cover"
          muted
          playsInline
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
