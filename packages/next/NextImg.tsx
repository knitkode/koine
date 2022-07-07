import React from "react";
import NextImage, { type ImageProps, type StaticImageData } from "next/image";

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

export default NextImg;
