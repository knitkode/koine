import styled from "styled-components";
import { KoineButton, KoineButtonProps } from "../../Buttons";
import { field } from "../Field";
import { max, min } from "../../styles/media";

export const InputGroupRoot = styled.div`
  ${field}
  display: flex;
  ${max.sm} {
    flex-direction: column;
  }
`;

export const InputGroupMain = styled.div`
  flex: 1;
`;

export const InputGroupButtonPre = styled(KoineButton)`
  ${max.sm} {
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  ${min.sm} {
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

export const InputGroupButtonPost = styled(KoineButton)`
  ${max.sm} {
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  ${min.sm} {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export type InputGroupProps = {
  pre?: boolean;
  post?: boolean;
  Button?: typeof KoineButton;
  btnProps?: KoineButtonProps;
};

export const InputGroup: React.FC<InputGroupProps> = ({
  pre,
  post,
  Button = KoineButton,
  btnProps = {},
  children,
}) => {
  return (
    <InputGroupRoot>
      {pre && <InputGroupButtonPre as={Button} {...btnProps} />}
      <InputGroupMain>{children}</InputGroupMain>
      {post && <InputGroupButtonPost as={Button} {...btnProps} />}
    </InputGroupRoot>
  );
};
