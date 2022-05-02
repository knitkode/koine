import styled, { css } from "styled-components";
import { AnimatePresence, MotionProps, m } from "framer-motion";
import { MdClear as IconClose } from "react-icons/md";
import {
  DialogProps as BaseDialogProps,
  DialogOverlay as BaseDialogOverlay,
  DialogContent as BaseDialogContent,
} from "@reach/dialog";
import { min } from "../styles/media";
import { inset0 } from "../styles/styled";
import { IconButton } from "../Buttons";

export const koineDialogBg = css`
  z-index: 1;
  position: relative;
  background: var(--bodyBg);
  box-shadow: var(--shadow);
`;

export const koineDialogBackdropMotion: MotionProps = {
  animate: {
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255,0.33)",
  },
  exit: {
    backdropFilter: "blur(0px)",
    background: "rgba(255,255,255,0)",
    transition: { delay: 0.2 },
  },
};

export const koineDialogInnerMotion: MotionProps = {
  initial: {
    // scale: .7,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    // transition: { delay: 0.2 },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
  },
};

export const KoineDialogOverlay = styled(BaseDialogOverlay)`
  z-index: 100;
  position: fixed;
  ${inset0}
`;

export const KoineDialogBackdrop = styled(m.div)`
  z-index: 2;
  position: fixed;
  ${inset0}
  backdrop-filter: blur(0px);
`;

export const KoineDialogInner = styled(m.div)<
  Pick<KoineDialogProps, "$centered">
>`
  z-index: 3;
  position: absolute;
  ${inset0}
  overflow: hidden scroll;
  ${(p) =>
    p.$centered &&
    `${min.sm} {
      display: flex;
      justify-content: center;
      align-items: center;
    }`};
`;

// export const KoineDialogContent = styled(m(BaseDialogContent))<
export const KoineDialogContent = styled(BaseDialogContent)<
  Pick<KoineDialogProps, "$centered">
>`
  position: relative;
  outline: 0px;
  width: 100%;
  margin: 0 auto;
`;

export const KoineDialogCloseButton = styled(IconButton)`
  position: absolute;
  padding: 0;
`;

export const KoineDialogHeader = styled.div`
  z-index: 2;
  position: relative;
`;

export const KoineDialogBody = styled.div`
  position: relative;

  &:hover ${KoineDialogCloseButton} {
  }
`;

export const KoineDialogBodyChildren = styled.div`
  position: relative;
  overflow: auto;
`;

export type KoineDialogProps = Omit<BaseDialogProps, "onDismiss" | "isOpen"> & {
  /**
   * Unify `@reach/dialog` props with `@mui/base` props
   */
  onClose: BaseDialogProps["onDismiss"];
  /**
   * Unify `@reach/dialog` props with `@mui/base` props
   */
  open: BaseDialogProps["isOpen"];
  title?: string;
  /** @default true */
  $centered?: boolean;
};

export const KoineDialog = ({
  children,
  title,
  onClose,
  open,
  $centered = true,
  ...props
}: KoineDialogProps) => {
  return (
    <AnimatePresence>
      {open && (
        <KoineDialogOverlay
          key="KoineDialog"
          {...props}
          onDismiss={onClose}
          isOpen={open}
        >
          <KoineDialogBackdrop {...koineDialogBackdropMotion} />
          <KoineDialogInner {...koineDialogInnerMotion} $centered={$centered}>
            <KoineDialogContent aria-label={title || ""} $centered={$centered}>
              {title && <KoineDialogHeader>{title}</KoineDialogHeader>}
              <KoineDialogBody>
                <KoineDialogCloseButton onClick={onClose}>
                  <IconClose />
                </KoineDialogCloseButton>
                <KoineDialogBodyChildren>{children}</KoineDialogBodyChildren>
              </KoineDialogBody>
            </KoineDialogContent>
          </KoineDialogInner>
        </KoineDialogOverlay>
      )}
    </AnimatePresence>
  );
};
