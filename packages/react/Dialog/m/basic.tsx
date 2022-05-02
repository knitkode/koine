import type { MotionProps } from "framer-motion";

export * from "./index";

export const dialogBackdropMotion: MotionProps = {
  initial: {
    opacity: 0,
  },
  animate: {
    backdropFilter: "blur(10px)",
    opacity: 1,
  },
  exit: {
    backdropFilter: "blur(0px)",
    opacity: 0,
  },
};

export const dialogPaperMotion: MotionProps = {
  initial: {
    // scale: .9,
    translateY: -60,
    opacity: 0,
  },
  animate: {
    // scale: 1,
    translateY: 0,
    opacity: 1,
  },
  exit: {
    // scale: 0.9,
    translateY: 60,
    opacity: 0,
  },
};
