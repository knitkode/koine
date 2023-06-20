import { useEffect, useState } from "react";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useMedia } from "../styles/media";
import { useTheme } from "../styles/theme";

// branded types to get good type annotation/hints on the array returned
// by the hook, a kind of state but more compact than an object...

/** @type {boolean} */
type isSticky = boolean & { _branded: true };
/** @type {number} */
type placeholderHeight = number & { _branded: true };
/** @type {number} */
type headerHeight = number & { _branded: true };
/** @type {number} */
type logoWidth = number & { _branded: true };

type UseHeaderState = readonly [
  isSticky,
  placeholderHeight,
  headerHeight,
  logoWidth
];

export const useHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { header: themed } = useTheme();
  const isDesktopLayout = useMedia(`min:${themed.breakpoint}`);
  const valueIdx = isDesktopLayout ? 1 : 0;
  const [headerHeight, setHeaderHeight] = useState<number>(
    themed.height[valueIdx]
  );
  const [placeholderHeight, setPlaceholderHeight] = useState<number>(
    themed.height[valueIdx]
  );
  const [logoWidth, setLogoWidth] = useState<number>(
    themed.logoWidth[valueIdx]
  );

  useScrollPosition(
    (currentPosition) => {
      const isPastThreshold = currentPosition.y * -1 > 40;
      if (isSticky !== isPastThreshold) setIsSticky(isPastThreshold);
    },
    [isSticky]
  );

  useEffect(() => {
    const valueIdx = isDesktopLayout ? 1 : 0;

    setPlaceholderHeight(themed.height[valueIdx]);
    setHeaderHeight(
      isSticky ? themed.heightSticky[valueIdx] : themed.height[valueIdx]
    );
    setLogoWidth(
      isSticky ? themed.logoWidthSticky[valueIdx] : themed.logoWidth[valueIdx]
    );
  }, [themed, isSticky, isDesktopLayout]);

  return [
    isSticky,
    placeholderHeight,
    headerHeight,
    logoWidth,
  ] as unknown as UseHeaderState;
};

export default useHeader;
