import type { DefaultTheme } from "styled-components";

export type SpacingSize = "sm" | "md" | "lg";

export type SpacingProperty = "padding" | "margin";

/** @default 1 */
export type SpacingFactor = number;

export type SpacingDirection = "top" | "bottom";

export type SpacingDirectionAxis = "vertical" | SpacingDirection;

export type SpacingDevices = keyof DefaultTheme["devices"];

function _spacing(
  theme: DefaultTheme,
  size: SpacingSize = "md",
  factor: SpacingFactor = 1,
  property: SpacingProperty = "padding",
  direction: SpacingDirection = "top",
  devices: SpacingDevices[] = ["mobile", "tablet", "desktop"]
) {
  const { breakpoints, devices: DEVICES, spaces: SPACES } = theme;
  let css = "";
  const prop = `${property}-${direction}`;
  if (devices === ["mobile"]) {
    css += `@media(max-width: ${breakpoints[DEVICES.mobile]}px){
        ${prop}: ${SPACES["mobile"][size] * factor}px;
      }`;
  } else {
    for (let index = 0; index < devices.length; index++) {
      const device = devices[index];
      if (device === "mobile") {
        css += `${prop}: ${SPACES[device][size] * factor}px;`;
      } else if (device === "tablet") {
        css += `@media(min-width: ${breakpoints[DEVICES.tablet]}px){
          ${prop}: ${SPACES["tablet"][size] * factor}px;
        }`;
      } else if (device === "desktop") {
        css += `@media(min-width: ${breakpoints[DEVICES.desktop]}px){
          ${prop}: ${SPACES["desktop"][size] * factor}px;
        }`;
      }
    }
  }
  return css;
}

export type SpacingArgs = Parameters<typeof spacing>;

export function spacing(
  this: DefaultTheme,
  size?: SpacingSize,
  factor?: SpacingFactor,
  property?: SpacingProperty,
  direction?: SpacingDirectionAxis,
  devices?: SpacingDevices[]
) {
  if (direction === "vertical") {
    return (
      _spacing(this, size, factor, property, "top", devices) +
      _spacing(this, size, factor, property, "bottom", devices)
    );
  }

  return _spacing(this, size, factor, property, direction, devices);
}

export function spacingTop(
  this: DefaultTheme,
  size?: SpacingSize,
  factor?: SpacingFactor,
  property?: SpacingProperty,
  devices?: SpacingDevices[]
) {
  return _spacing(this, size, factor, property, "top", devices);
}

export function spacingBottom(
  this: DefaultTheme,
  size?: SpacingSize,
  factor?: SpacingFactor,
  property?: SpacingProperty,
  devices?: SpacingDevices[]
) {
  return _spacing(this, size, factor, property, "bottom", devices);
}

export function spacingVertical(
  this: DefaultTheme,
  size?: SpacingSize,
  factor?: SpacingFactor,
  property?: SpacingProperty,
  devices?: SpacingDevices[]
) {
  return (
    _spacing(this, size, factor, property, "top", devices) +
    _spacing(this, size, factor, property, "bottom", devices)
  );
}
