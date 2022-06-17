import React, { forwardRef, useId, useMemo, useRef, useState } from "react";
import { unstable_useEventCallback as useEventCallback } from "@mui/utils";
import {
  motion as m,
  AnimatePresence,
  type HTMLMotionProps,
} from "framer-motion";
import {
  useMenu,
  MenuUnstyledContext,
  type MenuUnstyledContextType,
  type MenuUnstyledActions,
} from "@mui/base/MenuUnstyled";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { usePopper, type PopperChildrenProps } from "react-popper";
import { clsx } from "@koine/utils/clsx";

const MenuRoot = m.div;

const MenuBackdrop = () => <div className="fixed inset-0" />;

/**
 * Props we control, cannot be overriden from implementers
 */
type MenuButtonOwnProps = {
  "aria-controls"?: string;
  "aria-haspopup": true | "true";
  "aria-expanded"?: true | "true";
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => unknown;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => unknown;
};
type MenuButtonProps = Omit<
  React.ComponentPropsWithRef<"button">,
  keyof MenuButtonOwnProps
> &
  MenuButtonOwnProps;

export type MenuItemsProps = {
  /**
   * Closes the parent menu
   */
  close: () => unknown;
};

/**
 * Props we control, cannot be overriden from implementers
 */
type MenuOwnProps = ReturnType<typeof useMenu>["getListboxProps"] & {
  onKeyDown: (event: React.KeyboardEvent) => unknown;
  style: React.StyleHTMLAttributes<HTMLDivElement>;
};

export type MenuProps = Omit<
  Omit<HTMLMotionProps<"div">, "children"> & {
    placement?: PopperChildrenProps["placement"];
    Button: (props: MenuButtonProps) => JSX.Element;
    children: (props: MenuItemsProps) => React.ReactNode;
  },
  keyof MenuOwnProps
>;

export const Menu = forwardRef(function Menu(props: MenuProps, ref) {
  const { Button, placement, children, className, ...htmlAttributes } = props;
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuActions = useRef<MenuUnstyledActions>(null);
  const [popperElement, setPopperElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const { styles } = usePopper(anchorEl, popperElement, {
    placement,
    // strategy: "absolute",
  });
  const {
    registerItem,
    unregisterItem,
    getListboxProps,
    getItemProps,
    getItemState,
  } = useMenu({
    listboxId: id,
    // @ts-expect-error fix if we are going to use all this...
    listboxRef: setPopperElement,
    // these two make the Tab key behaviour correct, closing the menu on Tab
    // press and re-focusing the Button trigger element
    open,
    onClose: () => setAnchorEl(null),
  });
  const contextValue: MenuUnstyledContextType = {
    registerItem,
    unregisterItem,
    getItemState,
    getItemProps,
    open,
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (open) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleButtonKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
      if (event.key === "ArrowUp") {
        menuActions.current?.highlightLastItem();
      }
    }
  };

  const close = useEventCallback(() => {
    setAnchorEl(null);
    buttonRef.current?.focus();
  });

  const renderChildren = useMemo(() => {
    const childrenProps: MenuItemsProps = { close };
    return children(childrenProps);
  }, [children, close]);

  return (
    <>
      <Button
        ref={buttonRef}
        id={id}
        aria-haspopup="true"
        aria-controls={open ? id : undefined}
        aria-expanded={open ? "true" : undefined}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
      />
      <AnimatePresence>
        {open && (
          <ModalUnstyled
            BackdropComponent={MenuBackdrop}
            onClose={close}
            onBackdropClick={close}
            open={open}
          >
            <div>
              <ClickAwayListener onClickAway={close}>
                <MenuRoot
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className={clsx(className)}
                  style={styles["popper"]}
                  {...htmlAttributes}
                  {...getListboxProps()}
                  aria-labelledby={id}
                >
                  <MenuUnstyledContext.Provider value={contextValue}>
                    {renderChildren}
                  </MenuUnstyledContext.Provider>
                </MenuRoot>
              </ClickAwayListener>
            </div>
          </ModalUnstyled>
        )}
      </AnimatePresence>
    </>
  );
});

export default Menu;
