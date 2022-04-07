import { useEffect, useState } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useTheme } from "../styles/theme";
import { useMedia } from "../styles/media";

// branded types to get good type annotation/hints on the array returned
// by the hook, a kind of state but more compact than an object...
type isSticky = boolean & { _branded: true };
type placeholderHeight = number & { _branded: true };
type headerHeight = number & { _branded: true };
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
    ({ currPos }) => {
      const isPastThreshold = currPos.y * -1 > 40;
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
