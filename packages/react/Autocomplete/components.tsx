import styled from "styled-components";
import { Label } from "../Forms/Label/Label.js";
import { InputWrap, InputMain } from "../Forms/Input/Input.js";
import { SelectArrow } from "../Select/components.js";
import { Menu } from "../Menu/Menu.js";
import { MenuItem } from "../MenuItem/MenuItem.js";
import { btnStyleReset } from "../Buttons/index.js";
import { inputReset } from "../Forms/styles.js";
import { ellipsis } from "../styles/styled.js";

const AUTOCOMPLETE_ITEM_GUTTER = 3;
/**
 * Space between one selected item and the other
 */
const AUTOCOMPLETE_ITEM_SPACER = 6;
const AUTOCOMPLETE_ITEM_REMOVE_WIDTH = 20;

export const AutocompleteRoot = styled.div`
  position: relative;
`;

export const AutocompleteLabel = styled(Label)``;

export const AutocompleteWrap = styled(InputWrap)`
  ${inputReset}
`;

export const AutocompleteInner = styled(InputMain)`
  display: inline-flex;
  flex-wrap: wrap;
  margin: -${AUTOCOMPLETE_ITEM_SPACER}px;
  margin-right: 0;
`;

export const AutocompleteItem = styled.span`
  position: relative;
  display: inline-flex;
  margin: ${AUTOCOMPLETE_ITEM_GUTTER}px;
  max-width: calc(100% - 6px);
  user-select: none;
  align-items: center;
  padding: 0 ${AUTOCOMPLETE_ITEM_REMOVE_WIDTH}px 0 ${AUTOCOMPLETE_ITEM_GUTTER}px;
  font-size: 80%;
  background: var(--accent400);

  &:hover {
    background: var(--accent300);
    color: white;
  }

  &:focus {
    outline: 0px;
    background: var(--grey700);
  }
`;

export const AutocompleteItemLabel = styled.span`
  padding: 0 ${AUTOCOMPLETE_ITEM_GUTTER}px;
  ${ellipsis}
`;

export const AutocompleteItemRemove = styled.span`
  ${btnStyleReset}
  position: absolute;
  top: 0;
  right: 0;
  width: ${AUTOCOMPLETE_ITEM_REMOVE_WIDTH}px;
  border: 0;
  height: 100%;
  color: inherit;
  line-height: 1;
`;

export const AutocompleteInputWrap = styled.div`
  display: flex;
  flex: 1;
`;

export const AutocompleteInput = styled.input`
  flex-grow: 1;
  width: 0;
  min-width: 30px;
  border: 0;
  padding: 0 ${AUTOCOMPLETE_ITEM_SPACER}px;
  text-overflow: ellipsis;
  background: transparent;

  &:focus {
    outline: none;
  }
`;

/**
 * This cannot be a button otherwise on `Enter` the form would submit instead
 * of opening the dropdown or adding the selection. There are too many events
 * to prevent if we were using a standard HTML `<button>`
 */
export const AutocompleteInputArrow = styled(SelectArrow)``;

export const AutocompleteMenu = styled(Menu)``;

export const AutocompleteMenuItem = styled(MenuItem)``;
