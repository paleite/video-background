import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";

const offset = 0;
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
    const framePath = `${prefix}${path.toString().padStart(4, "0")}.jpg`;
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
      console.log("Progress: " + 100 * frames.frame / (frameCount - 1));
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

    function setupScrollTrigger(
      divId: gsap.TweenTarget,
      startPercentage: number,
      endPercentage: number,
      isFirstElement: boolean = false,
    ) {
      const initialAutoAlpha = isFirstElement ? 1 : 0;

      gsap.fromTo(
        divId,
        { autoAlpha: initialAutoAlpha },
        {
          autoAlpha: 1,
          duration: 0.1,
          scrollTrigger: {
            trigger: canvas,
            start: () => `${duration * startPercentage * 100}%`,
            end: () => `${duration * endPercentage * 100}%`,
            toggleActions: "play reverse play reverse",
            markers: !import.meta.env.PROD,
            scrub: false,
            onLeaveBack: () => gsap.to(divId, { autoAlpha: initialAutoAlpha }),
            onLeave: () => gsap.to(divId, { autoAlpha: 0 }),
          },
        },
      );
    }

    setupScrollTrigger("#div1", 0, 0.1, true);
    setupScrollTrigger("#div2", 0.25, 0.46);
    setupScrollTrigger("#div3", 0.54, 1);
  }, [duration, frameCount, heights.percentage, images, width, height]);

  return (
    <>
      <div data-testid="canvas-container" style={{ height: heights.viewport }}>
        <div className="fixed flex h-screen w-screen">
          <canvas ref={canvasRef} className="h-screen w-screen object-cover" />
        </div>
        <div className="opacity-1 fixed inset-0 flex" id="div1">
          {(true || !import.meta.env.PROD) && (
            <div className="absolute bg-red-500/90">ACTIVE LINK: SHIRT 16 PALE BLUE</div>
          )}
          <a
            className="flex h-full w-full items-center justify-center"
            href="https://www.blkdnm.com/product/women/blouses/shirt-16-vintage-blue"
          />
        </div>
        <div className="fixed inset-0 flex opacity-0" id="div2">
          {(true || !import.meta.env.PROD) && (
            <div className="absolute bg-slate-500/90">ACTIVE LINK: DENIM JACKET 75 VINTAGE BLUE STUDS</div>
          )}
          <a
            className="flex h-full w-full items-center justify-center"
            href="https://www.blkdnm.com/product/men/denim/denim-jacket-75-vintage-blue"
          />
        </div>
        <div className="fixed inset-0 flex opacity-0" id="div3">
          {(true || !import.meta.env.PROD) && (
            <div className="absolute bg-green-500/90">ACTIVE LINK: LEATHER JACKET 70 LIGHT BROWN</div>
          )}
          <a
            className="flex h-full w-full items-center justify-center"
            href="https://www.blkdnm.com/product/women/leather/leather-jacket-70-light-brown"
          />
        </div>
      </div>
      <div className="relative">{children}</div>
    </>
  );
};

export { CanvasFrames };
