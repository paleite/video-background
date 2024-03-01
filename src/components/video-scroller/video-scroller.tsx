import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const videoPaths = [
  "/Vertical_test_scroll.mp4",
  "/vertical_test_scroll_2.mp4",
  "/horizontal_test_scroll.mp4",
];

const VideoScroller = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    // Handler to set up ScrollTrigger once video metadata is loaded
    const setupScrollTrigger = () => {

      const scrollTrigger = ScrollTrigger.create({
        start: 0,
        end: () => "+=" + document.documentElement.offsetHeight * 4, // Dynamically setting the end based on video duration
        scrub: true,
        onLeaveBack: (self) => self.scroll(ScrollTrigger.maxScroll(window)),
        onEnterBack: (self) => self.scroll(0),
        onUpdate: (self) => {
          const scrollPosition = self.progress;
          if (video === null) {
            return;
          }
          // Adjust video currentTime based on scroll position and video duration
          const videoTime = video.duration * scrollPosition;
          video.currentTime = videoTime;
        },
      });

      return () => {
        if (scrollTrigger) {
          scrollTrigger.kill();
        }
      };
    };

    if (video === null) {
      return;
    }

    if (video.readyState >= 1) {
      // If video metadata is already loaded at the time of effect execution
      setupScrollTrigger();
    } else {
      // Wait for metadata to load
      video.addEventListener("loadedmetadata", setupScrollTrigger);
    }

    return () => {
      video.removeEventListener("loadedmetadata", setupScrollTrigger);
    };
  }, []);

  return (
    <div style={{ height: "500vh" }}>
      {/* Set container height to 500vh */}
      <video
        ref={videoRef}
        src={videoPaths[0]}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        muted
        loop
      />
      {videoRef.current === null && (
        <>
          <img src="/vite.svg" />
          Loading...
        </>
      )}
    </div>
  );
};

export { VideoScroller };
