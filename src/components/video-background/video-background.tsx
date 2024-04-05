import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'; // For Next.js
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * Videos must be encoded with the following command to avoid becoming choppy.
 *
 * ```sh
 * ffmpeg -i ./public/videos/video-original.mp4 -an -vf scale=376:668 -movflags faststart -vcodec libx264 -g 1 -pix_fmt yuv420p ./public/videos/video.mp4;
 * ```
 *
 * Explanation:
 *
 * - `-an` - no audio
 * - `-vf scale=376:668` - resize video to 376x668 (based on iPhone 8's logical
 *   resolution, ceiled to closest even number)
 *   - Example: iPhone 8 resolut
 * ion is 750x1334, divided by its native scale-
 *     factor (2) gives 375x667.5, ceiled to closest even number is 376x668.
 *     @see https://developer.apple.com/library/archive/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html
 * - `-movflags faststart` - Allows for playing back the video before it's
 *   finished downloading.
 * - `-vcodec libx264` - Video codec. There are better codecs (like `libx265`
 *   and `av1`), but `libx264` is the only one that works with scrubbing (on iOS
 *   at least).
 * - `-g 1` - Ensures every frame is a keyframe, so the video doesn't get choppy
 *   when scrubbed.
 * - `-pix_fmt yuv420p` - Video format. Widely supported.
 *
 * For posters:
 *
 * ```sh
 * ffmpeg -i ./public/videos/video-original.mp4 -frames:v 1 -q:v 2 ./public/videos/video-poster.jpg;
 * ```
 */

type VideoBackgroundProps = {
  videoUrl: string;
  posterUrl: string;
  duration: number;
};

type GsapVideoProps = {
  videoUrl: string;
  posterUrl: string;
  screenHeightsToAnimateOver: number;
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

const GsapVideo: React.FunctionComponent<GsapVideoProps> = ({
  videoUrl,
  posterUrl,
  screenHeightsToAnimateOver,
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
    void (async function setPrefetchedVideoSource() {
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
    void (async function checkAutoPlayability() {
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
          // markers: process.env.NODE_ENV !== 'production', // For Next.js
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
    <video
      ref={videoRef}
      aria-busy={videoSrc === undefined}
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
  );
};

const VideoBackground: FunctionComponent<
  PropsWithChildren<VideoBackgroundProps>
> = ({
  children,
  videoUrl,
  posterUrl,
  duration: screenHeightsToAnimateOver,
}) => {
  return (
    <>
      <div
        data-testid="video-background-container"
        style={{
          height: getScreenHeights(screenHeightsToAnimateOver).viewport,
        }}
      >
        {typeof window !== "undefined" && (
          <GsapVideo
            videoUrl={videoUrl}
            posterUrl={posterUrl}
            screenHeightsToAnimateOver={screenHeightsToAnimateOver}
          />
        )}
      </div>
      <div className="relative">{children}</div>
    </>
  );
};

export { VideoBackground };
