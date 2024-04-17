import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const offset = 1;
const framePaths = Array.from({ length: 147 }, (_, i) => i + offset).map(
  (path) =>
    `${import.meta.env.BASE_URL}airpods/${path.toString().padStart(4, "0")}.jpg`,
);

gsap.registerPlugin(ScrollTrigger);

const CanvasFrames: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    canvas.width = 1158;
    canvas.height = 770;

    const frameCount = 147;

    const images: HTMLImageElement[] = [];
    const airpods = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = framePaths[i];
      images.push(img);
    }

    gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        // trigger: canvas,
        scrub: 0.5,
        // start: "top top",
        // end: "bottom bottom",
      },
      onUpdate: () => {
        render();
      },
    });

    images[0].onload = render;

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[airpods.frame], 0, 0);
    }
  }, []);

  return (
    <div data-testid="canvas-container" style={{ height: "5000px" }}>
      <canvas
        ref={canvasRef}
        className="fixed left-1/2 top-1/2 max-h-[100vh] max-w-[100vw] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export { CanvasFrames };
