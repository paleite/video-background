import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PropsWithChildren, useEffect, useRef } from "react";

const videoWidth = 708;
const videoHeight = 1259;
const frameCount = 176;
const offset = 1;

const images = Array.from({ length: frameCount }, (_, i) => i + offset).map(
  (path) => {
    const framePath = `${import.meta.env.BASE_URL}frames/Phone version, Scrollway/${path.toString().padStart(4, "0")}.jpg`;
    const img = new Image();
    img.src = framePath;
    return img;
  },
);

const getScreenHeights = (screenHeights: number) => ({
  percentage: `${Math.max((screenHeights - 1) * 100, 0)}%`,
  viewport: `${Math.max(screenHeights * 100, 0)}vh`,
});

gsap.registerPlugin(ScrollTrigger);

type CanvasFramesProps = {
  // videoUrl: string;
  // posterUrl: string;
  // TODO: Make this required instead of optional
  duration?: number;
};

const CanvasFrames: React.FunctionComponent<
  PropsWithChildren<CanvasFramesProps>
> = ({ children, duration = 3.5 }) => {
  const heights = getScreenHeights(duration);

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

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const airpods = { frame: 0 };

    gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: canvas,
        scrub: true,
        start: "top top",
        end: `bottom+=${heights.percentage} bottom`,
        markers: !import.meta.env.PROD,
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
  }, [heights.percentage]);

  return (
    <>
      <div data-testid="canvas-container" style={{ height: heights.viewport }}>
        <div className="fixed flex h-screen w-screen">
          <canvas ref={canvasRef} className="h-screen w-screen object-cover" />
        </div>
      </div>
      <div className="relative">{children}</div>
    </>
  );
};

export { CanvasFrames };
