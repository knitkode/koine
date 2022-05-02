import React, { useState } from "react";
import NextImage, { ImageProps, StaticImageData } from "next/image";
import { KoineImgSmartProps, KoineImgSmartWrapProps } from "@koine/react";

// we need to recreate the StaticImport type to allow typescript to correctly
// compile as next does not export `StaticImport` but just `declare`s it
// @see related issue: https://github.com/microsoft/TypeScript/issues/9944
interface StaticRequire {
  default: StaticImageData;
}
type StaticImport = StaticRequire | StaticImageData;

export type NextImgProps = Omit<React.ComponentPropsWithoutRef<"img">, "src"> &
  // KoineImgProps &
  Omit<ImageProps, "src"> & {
    src: string | StaticImport;
  };

export const NextImg = NextImage;

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

export function getNextImgProps<T>({
  src,
  alt,
  layout,
  blurDataURL,
  width,
  height,
  priority,
  objectFit,
  objectPosition,
  ...restProps
}: T & NextImgProps) {
  const nextImgProps: NextImgProps = {
    src,
    alt,
    layout,
    blurDataURL,
    width,
    height,
    priority,
    objectFit,
    objectPosition,
  };

  return {
    nextImgProps,
    restProps,
  };
}
