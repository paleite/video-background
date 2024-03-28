import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

type VideoBackgroundProps = {
  videoUrl: string;
  posterUrl: string;
  duration: number;
};

gsap.registerPlugin(ScrollTrigger);

const getScreenHeights = (screenHeights: number) => ({
  percentage: `${Math.max((screenHeights - 1) * 100, 0)}%`,
  viewport: `${Math.max(screenHeights * 100, 0)}vh`,
});

const fetchVideo = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error("Network error");
  }

  return response;
};

const videoToBlobURL = async (response: Response) => {
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const prefetchVideo = async (path: string): Promise<string> => {
  try {
    const response = await fetchVideo(path);
    return await videoToBlobURL(response);
  } catch (error) {
    console.error("Failed to prefetch video", error);
    throw error;
  }
};

const VideoBackground: FunctionComponent<
  PropsWithChildren<VideoBackgroundProps>
> = ({
  children,
  videoUrl,
  posterUrl,
  duration: screenHeightsToAnimateOver,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [autoPlayable, setAutoPlayable] = useState<boolean | undefined>(
    undefined,
  );

  // Although technically speaking it's incorrect to infer battery saver mode
  // from auto-playability, it's a good enough heuristic for our purposes.
  const isBatterySaver = autoPlayable === false;

  const video = videoRef.current;

  useEffect(() => {
    (async function setPrefetchedVideoSource() {
      try {
        const blobUrl = await prefetchVideo(videoUrl);
        setVideoSrc(blobUrl);
      } catch (error) {
        // When this error occurs, the video will not be pre-fetched, and will
        // be loaded on the fly, which means we can still achieve the effect by
        // simply degrading the user experience a bit.
        console.warn("Falling back to on-the-fly loading", error);

        setVideoSrc(videoUrl);
      }
    })();

    if (!video) {
      return;
    }

    // This is necessary for iOS Safari to show the video on interaction.
    (async function checkAutoPlayability() {
      try {
        await video.play();
        video.pause();

        setAutoPlayable(true);
      } catch (error) {
        // iOS Safari will fail when in battery saver mode.
        console.warn("Video playback failed", error);

        setAutoPlayable(false);
      }
    })();
  }, [videoUrl, screenHeightsToAnimateOver, video]);

  useGSAP(
    () => {
      if (!video) {
        return;
      }

      const heights = getScreenHeights(screenHeightsToAnimateOver);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: video,
          start: "top top",
          end: `bottom+=${heights.percentage} bottom`,
          scrub: true,
          markers: !import.meta.env.PROD,
        },
      });

      video.addEventListener("loadedmetadata", () => {
        tl.to(video, { currentTime: video.duration });
      });
    },
    {
      dependencies: [
        screenHeightsToAnimateOver,
        // Depend on videoSrc to ensure animation resets if the source changes.
        videoSrc,
      ],
    },
  );

  return (
    <>
      <div
        aria-busy={videoSrc === undefined}
        data-testid="video-background-container"
        style={{
          height: getScreenHeights(screenHeightsToAnimateOver).viewport,
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay={isBatterySaver}
          className="fixed h-screen w-screen object-cover"
          data-testid="video-background-video"
          poster={posterUrl}
          preload="auto"
          role="img"
        >
          {videoSrc !== undefined && <source src={videoSrc} type="video/mp4" />}
        </video>
      </div>
      <div className="relative">{children}</div>
    </>
  );
};

export { VideoBackground };
