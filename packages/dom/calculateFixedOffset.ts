import { $each } from "./$each";

export function calculateFixedOffset(selector = "[data-fixed]") {
  let fixedOffset = 0;

  $each(selector, ($el) => {
    fixedOffset += $el.offsetHeight;
  });

  return fixedOffset;
}

export default calculateFixedOffset;
