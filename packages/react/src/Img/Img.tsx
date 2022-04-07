import type { FC, CSSProperties } from "react";
import styled from "styled-components";

export type KoineImgProps = {};
// export type KoineImgProps = {
//   /** @default "cover" */
//   $fit?: "cover" | "contain";
// };

export const KoineImg = styled.img<KoineImgProps>``;
// export const KoineImg = styled.img<KoineImgProps>`
//   object-fit: ${(p) => p.$fit || "cover"};
// `;

export type KoineImgSmartWrapProps = {
  $loaded?: boolean;
  $error?: boolean;
  $bg?: CSSProperties["backgroundColor"];
};

export type KoineImgSmartProps = KoineImgProps & {
  Wrap: FC<KoineImgSmartWrapProps>;
};

// /**
//  * Replacement core component for native `<img />`
//  *
//  * Features:
//  *  - lazy load
//  *  - proportion cage
//  */
// export const Img = ({
//   className,
//   style = {},
//   lazyProps,
//   ...props
// }: ImgProps) => {
//   let { width, height, src } = props;
//   width = width ? `${width}px` : "100%";
//   height = height ? `${height}px` : "100%";
//   const imgProps = { width, height, src };

//   return (
//     <ImgRoot style={{ width, height, ...style }} className={className}>
//       <LazyLoad {...lazyProps}>
//         <ImgNative {...imgProps} />
//       </LazyLoad>
//       <noscript>
//         <img {...imgProps} />
//       </noscript>
//     </ImgRoot>
//   );
// };
