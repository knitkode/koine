import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { UseRevealOptions, useReveal } from "./useReveal";

export type RevealProps = React.PropsWithChildren<UseRevealOptions>;

export const Reveal = ({
  children,
  direction,
  offsetStartY,
  offsetEndY,
  offsetStartX,
  ...props
}: RevealProps) => {
  const effectOptions = { direction, offsetStartY, offsetEndY, offsetStartX };
  const prefersReducedMotion = useReducedMotion();
  const { ref, startY, endY, startX } =
    useReveal<HTMLDivElement>(effectOptions);
  const { scrollYProgress } = useViewportScroll();
  const xRange = useTransform(scrollYProgress, [startY, endY], [startX, 0]);
  const opacityRange = useTransform(scrollYProgress, [startY, endY], [0, 1]);
  const x = useSpring(xRange, { stiffness: 400, damping: 90 });
  const opacity = useSpring(opacityRange);
  // console.log("start, end", startY, endY)

  return (
    <motion.div
      {...props}
      ref={ref}
      style={prefersReducedMotion ? {} : { x, opacity }}
    >
      {children}
    </motion.div>
  );
};
