// import React, { forwardRef } from "react";
// import { useMenuItem } from "@mui/base/MenuItemUnstyled";
// // import { useMenuItem } from "./useMenuItem";
// import { clsx } from "@koine/utils";
// import { type MenuItemsProps } from "../Menu/MenuMui";
// import { Polymorphic } from "../typings";

// export type MenuItemProps = React.PropsWithChildren<Partial<MenuItemsProps>>;

// export const MenuItem = forwardRef(function MenuItem<
//   T extends React.ElementType = "button"
// >(props: Polymorphic.Props<T, MenuItemProps>, ref: Polymorphic.Ref<T>) {
//   const {
//     as: As = "button",
//     children,
//     className,
//     disabled: disabledProp,
//     ...other
//   } = props;

//   const { getRootProps, disabled, focusVisible } = useMenuItem({
//     ref,
//     disabled: disabledProp,
//   });

//   return (
//     <As
//       className={clsx(focusVisible && "", disabled && "", className)}
//       {...getRootProps(other)}
//     >
//       {children}
//     </As>
//   );
// }) as Polymorphic.ComponentForwarded<"button", MenuItemProps>;

// export default MenuItem;
