import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, FC } from "react";

gsap.registerPlugin(ScrollTrigger);

const videoPaths = [
  "/Vertical_test_scroll.mp4",
  "/vertical_test_scroll_2.mp4",
  "/horizontal_test_scroll.mp4",
];

const VideoScroller: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const setupScrollTrigger = (): (() => void) => {
      const scrollTrigger = ScrollTrigger.create({
        start: 0,
        end: () => `+=${document.documentElement.offsetHeight * 4}`,
        scrub: true,
        onLeaveBack: (self) => self.scroll(ScrollTrigger.maxScroll(window)),
        onEnterBack: (self) => self.scroll(0),
        onUpdate: (self) => {
          if (!video) return;
          video.currentTime = video.duration * self.progress;
        },
      });

      return () => scrollTrigger && scrollTrigger.kill();
    };

    const onLoadedMetadata = setupScrollTrigger();
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => video.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, []);

  return (
    <div className="h-[500vh]"> {/* Adjusted inline style to Tailwind CSS */}
      <video
        ref={videoRef}
        src={videoPaths[0]}
        className="fixed top-0 left-0 w-full h-full object-cover" // Adjusted inline style to Tailwind CSS
        muted
        loop
      />
      {!videoRef.current && (
        <>
          <img src="/vite.svg" alt="Loading" />
          Loading...
        </>
      )}
    </div>
  );
};

export { VideoScroller };
