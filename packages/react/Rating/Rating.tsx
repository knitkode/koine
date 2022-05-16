import { useCallback, useEffect, /* useId, */ useState } from "react";
import styled from "styled-components";
import { useId } from "../hooks/useId";

export type RatingStarProps = React.ComponentPropsWithoutRef<"svg"> &
  RatingStarModel & {
    /** @default 16 */
    size?: number;
    /** Between 0 and 1 */
    value: number;
    /** @default "#FFD84C" */
    colorBg?: React.CSSProperties["color"];
    /** @default "#947813" */
    colorStroke?: React.CSSProperties["color"];
  };

export const RatingStarRoot = styled.svg`
  display: inline-block;
  vertical-align: middle;
  margin-right: 1px;
`;

export const RatingStar = ({
  value,
  colorBg = "#FFD84C",
  colorStroke = "#947813",
  size,
  ...props
}: RatingStarProps) => {
  const id = useId();

  return (
    <RatingStarRoot
      viewBox="0 0 16 16"
      data-value={value}
      width={size + "px"}
      height={size + "px"}
      {...props}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={colorBg} />
          <stop offset={value} stopColor={colorBg} />
          <stop offset={value} stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
      </defs>
      <path
        stroke={colorStroke}
        strokeWidth="0.5"
        fill={`url(#${id})`}
        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
      />
    </RatingStarRoot>
  );
};

export const RatingDetails = styled.span`
  padding-left: 0.5em;
  font-size: 12px;
  color: var(--grey100);

  &:before {
    content: "(";
  }
  &:after {
    content: ")";
  }
`;

export const RatingCount = styled.span``;

export const RatingValue = styled.span`
  display: none;
`;

export const RatingRoot = styled.div`
  display: flex;
  align-items: center;

  &:hover ${RatingValue} {
    display: inline-block;
  }
`;

export type RatingStarModel = {
  value: number;
  idx?: number;
  dataIdx?: number;
};

export type RatingProps = {
  /** @default 0 */
  value: number;
  count?: number;
  /** @default 0 */
  min?: number;
  /** @default 5 */
  max?: number;
  /** @default true */
  showDetails?: boolean;
  starSize?: RatingStarProps["size"];
} & Pick<RatingStarProps, "colorBg" | "colorStroke">;

export const Rating = ({
  value = 0,
  count,
  min = 0,
  max = 5,
  showDetails = true,
  colorBg,
  colorStroke,
  starSize = 16,
}: RatingProps) => {
  const id = useId();
  const [currentValue /* , _setCurrentValue */] = useState(value);
  const [stars, setStars] = useState<RatingStarModel[]>([]);
  const getStars = useCallback(
    (activeCount: number) => {
      const stars = [];
      for (let currentStar = min + 1; currentStar < max + 1; currentStar++) {
        let starValue: number;
        const roundedActiveCount = Math.floor(activeCount);
        // we have a rating of 3.4, when we get to the 4th star:
        if (roundedActiveCount === currentStar - 1) {
          starValue = 1 - (currentStar - activeCount);
        } else if (roundedActiveCount >= currentStar) {
          starValue = 1;
        } else {
          starValue = 0;
        }

        stars.push({ value: starValue });
      }
      return stars;
    },
    [min, max]
  );

  useEffect(() => {
    setStars(getStars(currentValue));
  }, [currentValue, getStars]);

  // function updateStars(index) {
  //   var currentActive = stars.filter((x) => x.active);
  //   if (index !== currentActive.length) {
  //     setStars(getStars(index));
  //   }
  // }

  // function handleMouseOver(event) {
  //   let index = Number(event.currentTarget.getAttribute("data-idx")) + 1;
  //   updateStars(index);
  // }

  // function handleMouseLeave() {
  //   setStars(getStars());
  // }

  // const handleClick = useCallback((event) => {
  //   let index = Number(event.currentTarget.getAttribute("data-idx"));
  //   let value  = index = index + 1;
  //   if (value !== currentValue) {
  //     setStars(getStars(value));
  //     setCurrentValue(value);
  //     onChange(value);
  //   }
  // }, [onChange];

  return (
    <RatingRoot>
      {stars.map((star, idx) => (
        <RatingStar
          key={id + idx}
          idx={idx}
          dataIdx={idx}
          size={starSize}
          // onMouseOver={handleMouseOver}
          // onMouseLeave={handleMouseLeave}
          // onClick={handleClick}
          value={star.value}
          colorBg={colorBg}
          colorStroke={colorStroke}
        />
      ))}{" "}
      {showDetails && count && (
        <RatingDetails>
          <RatingCount>{count}</RatingCount>
          <RatingValue>{` - ${value}`}</RatingValue>
        </RatingDetails>
      )}
    </RatingRoot>
  );
};
