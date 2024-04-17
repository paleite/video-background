import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PropsWithChildren, useEffect, useRef } from "react";

const frameCount = 147;
const offset = 1;

const images = Array.from({ length: frameCount }, (_, i) => i + offset).map(
  (path) => {
    const framePath = `${import.meta.env.BASE_URL}airpods/${path.toString().padStart(4, "0")}.jpg`;
    const img = new Image();
    img.src = framePath;
    return img;
  },
);

gsap.registerPlugin(ScrollTrigger);

type CanvasFramesProps = {
  // videoUrl: string;
  // posterUrl: string;
  // duration: number;
};

const CanvasFrames: React.FunctionComponent<
  PropsWithChildren<CanvasFramesProps>
> = ({ children }) => {
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

    const airpods = { frame: 0 };

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

    if (images[0] !== undefined) {
      images[0].onload = render;
    }

    function render() {
      const imageToDraw = images[airpods.frame];
      if (!context || !canvas || !imageToDraw) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(imageToDraw, 0, 0);
    }
  }, []);

  return (
    <>
      <div
        className="flex bg-black"
        data-testid="canvas-container"
        style={{
          height: "5000px",
        }}
      >
        <div className="fixed flex h-full w-full bg-black">
          <canvas
            ref={canvasRef}
            className="h-full w-full bg-black object-scale-down"
          />
        </div>
      </div>
      <div className="relative">{children}</div>
    </>
  );
};

export { CanvasFrames };
