import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

// gsap.registerPlugin(ScrollTrigger);

const videoPaths = [
  "/Vertical_test_scroll.mp4",
  "https://www.dropbox.com/scl/fi/qejf5dgqiv6m77d71r2ec/abstract-background-ink-water-20072.mp4?rlkey=zwgwzw4bfhx7oy034t7un6mod&raw=1",
  "/vertical_test_scroll_2.mp4",
  "/horizontal_test_scroll.mp4",
];

// const VideoScroller: FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     let scrollTrigger; // Declare variable to hold the ScrollTrigger instance

//     const setupScrollTrigger = () => {
//       scrollTrigger = ScrollTrigger.create({
//         trigger: video,
//         start: "top top",
//         end: "bottom bottom",
//         scrub: true,
//         onUpdate: (self) => {
//           const scrollProgress = self.progress;
//           // Calculate the current time based on scroll position
//           const currentTime = scrollProgress * video.duration;
//           video.currentTime = currentTime;
//         },
//       });
//     };

//     video.addEventListener('loadedmetadata', setupScrollTrigger);

//     // Cleanup function should kill the specific ScrollTrigger instance
//     return () => {
//       if (scrollTrigger) {
//         scrollTrigger.kill();
//       }
//       video.removeEventListener('loadedmetadata', setupScrollTrigger);
//     };
//   }, []);

//   return (
//     <div className="h-[500vh]">
//       <video
//         ref={videoRef}
//         src={videoPaths[0]}
//         className="fixed left-0 top-0 h-full w-full object-cover"
//         muted
//         loop
//       />
//       {!videoRef.current && (
//         <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
//           <img src="/vite.svg" alt="Loading" className="h-20 w-20" />
//           Loading...
//         </div>
//       )}
//     </div>
//   );
// };

// export { VideoScroller };

gsap.registerPlugin(ScrollTrigger);

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: video,
        start: "top top",
        end: "bottom+=200% bottom",
        scrub: true,
        markers: true,
      },
    });

    video.onloadedmetadata = () => {
      tl.to(video, { currentTime: video.duration });
    };

    // Play and pause the video on touch devices to ensure it can play
    if (isTouchDevice()) {
      video.play();
      video.pause();
    }

    // Helper function to detect touch devices
    function isTouchDevice() {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }

    // Cleanup function to kill the GSAP timeline on component unmount
    return () => {
      tl.kill();
    };
  }, []);

  return (
      <video
        ref={videoRef}
        className="fixed h-screen w-screen object-cover"
        playsInline
        preload="auto"
        muted
      >
        <source src={videoPaths[0]} type="video/mp4" />
      </video>
  );
};

export { VideoBackground as VideoScroller };
