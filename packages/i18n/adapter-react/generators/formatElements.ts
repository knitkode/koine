import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    formatElements: {
      name: "formatElements",
      ext: "tsx",
      content: () => /* js */ `
import React, { Fragment, cloneElement } from "react";

const tagParsingRegex = /<(\\w+) *>(.*?)<\\/\\1 *>|<(\\w+) *\\/>/;

const nlRe = /(?:\\r\\n|\\r|\\n)/g;

function getElements(
  parts: Array<string | undefined>,
): Array<string | undefined>[] {
  if (!parts.length) return [];

  const [paired, children, unpaired, after] = parts.slice(0, 4);

  return [
    [(paired || unpaired) as string, children || ("" as string), after],
  ].concat(getElements(parts.slice(4, parts.length)));
}

/**
 * @internal
 * @see https://github.com/aralroca/next-translate/blob/master/src/formatElements.tsx
 */
export function formatElements(
  value: string,
  elements: React.ReactElement[] | Record<string, React.ReactElement> = [],
): string | React.ReactNode[] {
  const parts = value.replace(nlRe, "").split(tagParsingRegex);

  if (parts.length === 1) return value;

  const tree: React.ReactNode[] = [];

  const before = parts.shift();
  if (before) tree.push(before);

  getElements(parts).forEach(([key, children, after], realIndex: number) => {
    const element = (elements as Record<string, React.ReactElement>)[
      key as string
    ] || <Fragment />;

    tree.push(
      cloneElement(
        element,
        { key: realIndex },

        // format children for pair tags
        // unpaired tags might have children if it's a component passed as a variable
        children ? formatElements(children, elements) : element.props.children,
      ),
    );

    if (after) tree.push(after);
  });

  return tree;
}

// export default formatElements;
`,
    },
  };
});
