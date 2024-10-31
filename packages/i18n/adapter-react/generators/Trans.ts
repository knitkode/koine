import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (arg) => {
  const {
    options: {
      translations: {
        tokens: { namespaceDelimiter },
      },
    },
  } = arg;

  return {
    formatElements: {
      dir: createGenerator.dirs.internal,
      name: "formatElements",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
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
`,
    },
    Trans: {
      name: "Trans",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import React, { useMemo } from "react";
import type { I18nUtils } from "@koine/i18n";
import { formatElements } from "./internal/formatElements";
import type { I18n } from "./types";
import { useT } from "./useT";

export type TransProps = {
  trace: I18n.TranslationsTrace;
  components?: React.ReactElement[] | Record<string, React.ReactElement>;
  query?: I18nUtils.TranslateQuery;
};

/**
 * Translate transforming:
 * <0>This is an <1>example</1><0>
 * to -> <h1>This is an <b>example</b><h1>
 */
export const Trans = ({
  trace,
  query,
  components,
}: TransProps) => {
  const [namespace, path] = (trace as string).split("${namespaceDelimiter}");
  const t = useT(namespace as I18n.TranslationsNamespace) as I18nUtils.TranslateLoose;
  const result = useMemo(() => {
    const text = t(path, query);

    if (!text) return text;

    if (!components || components.length === 0)
      return Array.isArray(text) ? text.map((item) => item) : text;

    if (Array.isArray(text))
      return text.map((item) => formatElements(item, components));

    return formatElements(text, components);
  }, [t, path, query, components]) as string;

  return result;
};

export default Trans;
`,
    },
    TransText: {
      name: "TransText",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import React, { useMemo } from "react";
import type { TransProps } from "./Trans";
import { formatElements } from "./internal/formatElements";

export type TransTextProps = Pick<TransProps, "components"> & {
  text: string;
};

export const TransText = ({ text, components }: TransTextProps) => {
  return useMemo(
    () =>
      !components || components.length === 0
        ? text
        : formatElements(text, components),
    [text, components],
  ) as string;
};

export default TransText;
`,
    },
  };
});
