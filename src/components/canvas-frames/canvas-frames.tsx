import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";

const offset = 1;
const frames = { frame: 0 };

const getScreenHeights = (screenHeights: number) => ({
  percentage: `${Math.max((screenHeights - 1) * 100, 0)}%`,
  viewport: `${Math.max(screenHeights * 100, 0)}vh`,
});

gsap.registerPlugin(ScrollTrigger);

type CanvasFramesProps = {
  width: number;
  height: number;
  frameCount: number;
  duration: number;
  prefix: string;
};

const getImages = (frameCount: number, prefix: string) =>
  Array.from({ length: frameCount }, (_, i) => i + offset).map((path) => {
    const framePath = `${prefix}/${path.toString().padStart(4, "0")}.jpg`;
    const img = new Image();
    img.src = framePath;
    return img;
  });

const CanvasFrames: React.FunctionComponent<
  PropsWithChildren<CanvasFramesProps>
> = ({ children, duration, frameCount, prefix, width, height }) => {
  const images = useMemo(
    () => getImages(frameCount, prefix),
    [frameCount, prefix],
  );

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

    canvas.width = width;
    canvas.height = height;

    const render = () => {
      const imageToDraw = images[frames.frame];
      if (!context || !canvas || !imageToDraw) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(imageToDraw, 0, 0);
    };

    gsap.to(frames, {
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
  }, [frameCount, heights.percentage, images, width, height]);

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
