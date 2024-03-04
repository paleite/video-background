import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const videoPaths = [
  "/Vertical_test_scroll-re.mp4",
  "/vertical_test_scroll_2-re.mp4",
  "/horizontal_test_scroll-re.mp4",
  "/Vertical_test_scroll.mp4",
  "https://www.dropbox.com/scl/fi/qejf5dgqiv6m77d71r2ec/abstract-background-ink-water-20072.mp4?rlkey=zwgwzw4bfhx7oy034t7un6mod&raw=1",
];

gsap.registerPlugin(ScrollTrigger);

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt to play video and catch any errors
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Video play failed:", error);
        setIsPlaying(false);
      });
    }

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

    // Cleanup function to kill the GSAP timeline on component unmount
    return () => tl.kill();
  }, []);

  // Function to handle manual play trigger for iOS Safari
  const handleVideoInteraction = () => {
    if (!isPlaying) {
      const video = videoRef.current;
      if (video) {
        video.play().then(() => {
          setIsPlaying(true);
          video.pause()
        }).catch(error => console.error("Video play on interaction failed:", error));
      }
    }
  };

  return (
    <div onClick={handleVideoInteraction}>
      <video
        ref={videoRef}
        className="fixed h-screen w-screen object-cover"
        // autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
      >
        <source src={videoPaths[0]} type="video/mp4" />
      </video>
    </div>
  );
};

export { VideoBackground };
