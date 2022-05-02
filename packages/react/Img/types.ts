import React from "react";

export type KoineImgSmartWrapProps = React.PropsWithChildren<{
  $loaded?: boolean;
  $error?: boolean;
  $bg?: React.CSSProperties["backgroundColor"];
}>;

export type KoineImgSmartProps = {
  Wrap: React.FC<KoineImgSmartWrapProps>;
};
