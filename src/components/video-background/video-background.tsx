import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

gsap.registerPlugin(ScrollTrigger);

const screenHeightsToAnimateOver = 4;

const getScreenHeights = (screenHeightsToAnimateOver: number) => ({
  percentage: `${Math.max((screenHeightsToAnimateOver - 1) * 100, 0)}%`,
  viewport: `${Math.max(screenHeightsToAnimateOver * 100, 0)}vh`,
});

const heights = getScreenHeights(screenHeightsToAnimateOver);


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

const VideoBackground: FunctionComponent<PropsWithChildren<{videoUrl: string; posterUrl: string;}>> = ({
  children,
  videoUrl,
  posterUrl,

}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [autoPlayable, setAutoPlayable] = useState<boolean | undefined>(
    undefined,
  );

  const isBatterySaver = autoPlayable !== true;

  useEffect(() => {
    prefetchVideo(videoUrl)
      .then((blobUrl) => setVideoSrc(blobUrl))
      .catch((error) => console.error("Error setting video source:", error));

    const video = videoRef.current;
    if (!video) {
      return;
    }

    // This is necessary for iOS Safari to show the video on interaction.
    (async () => {
      try {
        await video.play();
        video.pause();
        setAutoPlayable(false);
      } catch (error) {
        console.warn("Video playback failed", error);

        // Although technically speaking it's incorrect to infer battery saver
        // mode from the error, it's a good enough heuristic for our purposes.
        setAutoPlayable(true);
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
      <div
        className="overflow-hidden"
        style={{ height: heights.viewport }}
        data-testid="video-container"
        >
        {/* {videoSrc === undefined && (
          <div
            className="fixed flex h-screen w-screen items-center justify-center"
            data-testid="loading"
          >
            Loading...
          </div>
        )} */}
        <video
          data-testid="video"
          ref={videoRef}
          autoPlay={!isBatterySaver}
          className="fixed h-screen w-screen bg-black object-cover"
          muted
          playsInline
          preload="auto"
          poster={posterUrl}
          >
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
        </video>
      </div>
      <div className="relative">{children}</div>
    </>
  );
};

export { VideoBackground };
