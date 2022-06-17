import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import { MenuUnstyledContext } from "@mui/base/MenuUnstyled";
import { UseMenuItemParameters } from "@mui/base/MenuItemUnstyled";

import { unstable_useIsFocusVisible as useIsFocusVisible } from "@mui/utils";

export function useMenuItem(props: UseMenuItemParameters) {
  const { disabled = false, ref, label } = props;

  const id = useId();
  const menuContext = useContext(MenuUnstyledContext);

  const itemRef = useRef<HTMLElement>(null);
  const handleRef = useForkRef(itemRef, ref);

  if (menuContext === null) {
    throw new Error("MenuItemUnstyled must be used within a MenuUnstyled");
  }

  const { registerItem, unregisterItem, open } = menuContext;

  useEffect(() => {
    registerItem(id, { disabled, id, ref: itemRef, label });

    return () => unregisterItem(id);
  }, [id, registerItem, unregisterItem, disabled, ref, label]);

  // const { getRootProps: getButtonProps, focusVisible } = useButton({
  //   disabled,
  //   focusableWhenDisabled: true,
  //   ref: handleRef,
  // });

  // Ensure the menu item is focused when highlighted
  const [focusRequested, requestFocus] = useState(false);

  const focusIfRequested = useCallback(() => {
    if (focusRequested && itemRef.current != null) {
      itemRef.current.focus();
      requestFocus(false);
    }
  }, [focusRequested]);

  useEffect(() => {
    focusIfRequested();
  });

  // useDebugValue({ id, disabled, label });

  const itemState = menuContext.getItemState(id ?? "");

  const { highlighted } = itemState ?? { highlighted: false };

  useEffect(() => {
    requestFocus(highlighted && open);
  }, [highlighted, open]);

  return {
    getRootProps: (other?: Record<string, any>) => {
      const optionProps = menuContext.getItemProps(id, other);

      return {
        ...other,
        // ...getButtonProps(other),
        // @ts-expect-error type from @mui/base is not specific
        tabIndex: optionProps.tabIndex,
        // @ts-expect-error type from @mui/base is not specific
        id: optionProps.id,
        role: "menuitem",
      };
    },
    disabled: itemState?.disabled ?? false,
    // focusVisible,
    ref: handleRef,
  };
}

export default useMenuItem;
