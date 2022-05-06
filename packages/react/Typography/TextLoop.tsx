import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";

type TextObj = { key: string; data: string };

export type TextLoopPieceProps = React.PropsWithChildren<{
  text: string | number;
  direction?: "up" | "down";
  inline?: boolean;
  noOverflow?: boolean;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}>;

export const TextLoopPiece = ({
  text = "",
  style = {},
  className = "",
  direction = "up",
  inline = true,
  noOverflow = true,
  delay = 400,
}: TextLoopPieceProps) => {
  const placeholderRef = useRef<HTMLSpanElement | null>(null);
  const [content, setContent] = useState<TextObj>({ data: "", key: "" });
  const [width, setWidth] = useState(inline ? 0 : "auto");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!placeholderRef.current) return;
      placeholderRef.current.innerHTML = text + "";
      if (inline) setWidth(placeholderRef.current.offsetWidth);
      setContent({ data: text + "", key: new Date() + "" });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, delay, inline]);

  return (
    <div
      className={className}
      style={{
        ...style,
        position: "relative",
        display: inline ? "inline-block" : "block",
        width,
        whiteSpace: inline ? "nowrap" : "normal",
      }}
    >
      <span ref={placeholderRef} style={{ visibility: "hidden" }} />
      <div
        style={{
          overflow: noOverflow ? "hidden" : "visible",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
        }}
      >
        <AnimatePresence>
          <m.div
            key={content.key}
            style={{ position: "absolute" }}
            initial={{
              opacity: 0,
              y: direction === "down" ? "-100%" : "100%",
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: direction === "down" ? "100%" : "-100%",
            }}
          >
            {content.data}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export type TextLoopPrpps = Omit<TextLoopPieceProps, "text"> & {
  texts: string[];
  interval?: number;
};

export const TextLoop = ({
  texts,
  interval = 3000,
  ...props
}: TextLoopPrpps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      interval // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, [interval]);

  return <TextLoopPiece {...props} text={texts[index % texts.length]} />;
};
