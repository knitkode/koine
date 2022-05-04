import { forwardRef, useState } from "react";
import styled from "styled-components";
import {
  ImEye as IconVisible,
  ImEyeBlocked as IconInvisible,
} from "react-icons/im/index.js";
import { Label } from "../Label/Label.js";
import { InputNative } from "../Input/Input.js";
import type { FormControl } from "../helpers.js";

const ICON_WIDTH = "2em";

const PasswordInputWrap = styled.div`
  position: relative;
`;

export const PasswordInputNative = styled(InputNative)`
  position: relative;
  padding-right: ${ICON_WIDTH};
`;

const PasswordIcon = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${ICON_WIDTH};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.5;
`;

export type PasswordProps = FormControl;

export const Password = forwardRef<HTMLInputElement, PasswordProps>(
  function Password({ register, name, label, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <>
        {label && <Label>{label}</Label>}
        <PasswordInputWrap>
          <PasswordInputNative
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            {...(register ? register(name) : { name, ref })}
            {...props}
          />
          <PasswordIcon onClick={() => setVisible((prev) => !prev)}>
            {visible ? <IconInvisible /> : <IconVisible />}
          </PasswordIcon>
        </PasswordInputWrap>
      </>
    );
  }
);
