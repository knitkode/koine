import { ComponentPropsWithoutRef, useState } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import {
  // KoineImg,
  // KoineImgProps,
  KoineImgSmartProps,
  KoineImgSmartWrapProps,
} from "@koine/react";

export type NextImgProps = Omit<ComponentPropsWithoutRef<"img">, "src"> &
  // KoineImgProps &
  NextImageProps;

export const NextImg = (props: NextImgProps) => {
  return <NextImage {...props} />;
};

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
