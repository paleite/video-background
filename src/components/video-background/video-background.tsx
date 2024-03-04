import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FunctionComponent, PropsWithChildren, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const screenHeightsToAnimateOver = 3;

const getScreenHeights = (screenHeightsToAnimateOver: number) => ({
  percentage: `${Math.max((screenHeightsToAnimateOver - 1) * 100, 0)}%`,
  viewport: `${Math.max(screenHeightsToAnimateOver * 100, 0)}vh`,
});

const heights = getScreenHeights(screenHeightsToAnimateOver);

const videoPaths = [
  "/Vertical_test_scroll-re.mp4",
  "/vertical_test_scroll_2-re.mp4",
  "/horizontal_test_scroll-re.mp4",
];

const prefetchVideo = async (path: string): Promise<string> => {
  try {
    const response = await fetch(path);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Failed to prefetch video", error);
    throw error;
  }
};

const VideoBackground: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isBatterySaverMode, setIsBatterySaverMode] = useState<boolean | null>(null);

  useEffect(() => {
    prefetchVideo(videoPaths[0])
      .then((blobUrl) => setVideoSrc(blobUrl))
      .catch((error) => console.error("Error setting video source:", error));

    const video = videoRef.current;
    if (!video) return;

    // This is necessary for iOS Safari to show the video on interaction.
    (async () => {
      try {
        await video.play();
        video.pause();
        setIsBatterySaverMode(false);
      } catch (error) {
        console.error("Video play failed. battery saver mode?", error);
        setIsBatterySaverMode(true);
      }
    })();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: video,
        start: "top top",
        end: `bottom+=${heights.percentage} bottom`,
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
      <div className="overflow-hidden" style={{ height: heights.viewport }} data-testid="video-container">
        <video
          data-testid="video"
          ref={videoRef}
          autoPlay={!!isBatterySaverMode}
          className="fixed h-screen w-screen object-cover"
          muted
          playsInline
          preload="auto"
        >
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
        </video>
      </div>
      <div className="relative">{children}</div>
    </>
  );
};

export { VideoBackground };
