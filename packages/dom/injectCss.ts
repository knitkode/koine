import { dom } from "./dom";

/**
 * Inject css
 *
 * @param id The `<style>` HTMLElement's `id`
 * @param cssString The CSS to inject, defaults to an empty string
 * @param root The root HTMLElement where to prepend the style, defaults to `document.body`
 */
export let injectCss = (
  id: string,
  cssString = "",
  root?: null | HTMLElement,
) => {
  root = root || document.body;
  let styleblock = dom<HTMLStyleElement>("#" + id, root);
  if (!styleblock) {
    styleblock = document.createElement("style");
    styleblock.id = id;
    root.prepend(styleblock);
  }
  styleblock.innerHTML = cssString;
};

export default injectCss;
