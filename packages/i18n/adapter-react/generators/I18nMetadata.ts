import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    I18nMetadataContext: {
      dir: createGenerator.dirs.internal,
      name: "I18nMetadataContext",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
"use client";

import React, { createContext } from "react";
import { defaultI18nMetadata } from "./defaultI18nMetadata";
import type { I18n } from "../types";

type I18nMetadataContextValue = readonly [
  /** metadata */
  I18n.Metadata,
  /** setMetadata */
  React.Dispatch<React.SetStateAction<I18n.Metadata>>,
];

/**
 * @internal
 */
export const I18nMetadataContext = createContext<I18nMetadataContextValue>([
  defaultI18nMetadata,
  () => (defaultI18nMetadata),
]);
`,
    },
    I18nMetadataProvider: {
      dir: createGenerator.dirs.internal,
      name: "I18nMetadataProvider",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
"use client";

import React, { useMemo, useState } from "react";
import { I18nMetadataContext } from "./I18nMetadataContext";
import type { I18n } from "../types";

type I18nMetadataProviderProps = React.PropsWithChildren<{
  metadata?: I18n.Metadata;
}>;

/**
 * @internal
 */
export const I18nMetadataProvider = (props: I18nMetadataProviderProps) =>{
  const { children } = props;
  const [metadata, setMetadata] = useState<I18n.Metadata>(
    props.metadata || ({} as I18n.Metadata),
  );
  const value = useMemo(
    () => [metadata, setMetadata] as const,
    [metadata],
  );

  return (
    <I18nMetadataContext.Provider value={value}>
      {children}
    </I18nMetadataContext.Provider>
  );
}
`,
    },
    I18nMetadataSetter: {
      dir: createGenerator.dirs.internal,
      name: "I18nMetadataSetter",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
"use client";

import React, { useContext, useEffect } from "react";
import { I18nMetadataContext } from "./I18nMetadataContext";
import type { I18n } from "../types";

type I18nMetadataSetterProps = {
  metadata: I18n.Metadata;
};

/**
 * @internal
 */
export const I18nMetadataSetter = (props: I18nMetadataSetterProps) => {
  const { metadata } = props;
  const [, setMetadata] = useContext(I18nMetadataContext);

  useEffect(() => {
    setMetadata(metadata);
  }, [metadata, setMetadata]);

  return null as React.ReactNode;
};
`,
    },
    useI18nSwitch: {
      name: "useI18nSwitch",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
"use client";

import { useContext } from "react";
import { I18nMetadataContext } from "./internal/I18nMetadataContext";

export const useI18nSwitch = (
  absolute?: boolean,
  includeSearch?: boolean,
  includeHash?: boolean
) => {
  const { alternates: urls } = useContext(I18nMetadataContext)[0];

  if (!absolute) {
    try {
      for (const locale in urls) {
        const absoluteUrl = urls[locale];
        if (absoluteUrl) {
          const url = new URL(absoluteUrl);
          urls[locale] = url.pathname;
          if (includeSearch) urls[locale] += url.search;
          if (includeHash) urls[locale] += url.hash;
        }
      }
    } catch(e) {
      // TODO: verify this: we could have empty/invalid languages URLs here?
    }
  }
  
  return urls;
}

export default useI18nSwitch;
`,
    },
  };
});
