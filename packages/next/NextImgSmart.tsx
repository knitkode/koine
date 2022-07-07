import { useState } from "react";
import NextImage from "next/image";
import type { KoineImgSmartProps, KoineImgSmartWrapProps } from "@koine/react";
import { getNextImgProps, type NextImgProps } from "./NextImg";

export type NextImgSmartWrapProps = KoineImgSmartWrapProps;

export type NextImgSmartProps = KoineImgSmartProps & NextImgProps;

export const NextImgSmart = (props: NextImgSmartProps) => {
  const [$loaded, setLoaded] = useState(false);
  const [$error, setError] = useState(false);
  const { nextImgProps, restProps } = getNextImgProps<NextImgSmartProps>(props);
  const { Wrap } = restProps;

  return nextImgProps.priority ? (
    <NextImage {...nextImgProps} />
  ) : (
    <Wrap {...restProps} $loaded={$loaded} $error={$error}>
      <NextImage
        {...nextImgProps}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </Wrap>
  );
};

export default NextImgSmart;
