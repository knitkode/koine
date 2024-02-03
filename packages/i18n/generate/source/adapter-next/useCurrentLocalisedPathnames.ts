// import type { I18nGenerate } from "../../types";

export default (/* data: I18nGenerate.Data, */) => `
"use client";

import { useEffect, useState } from "react";
import { deriveLocalisedPathnames, type LocalisedPathnames } from "./deriveLocalisedPathnames";
import { useRouteId } from "./useRouteId";

export function useCurrentLocalisedPathnames() {
  const routeId = useRouteId();
  const [urls, setUrls] = useState<LocalisedPathnames>({} as LocalisedPathnames);

  useEffect(() => {
    setUrls(deriveLocalisedPathnames(routeId, location));
  }, [routeId]);

  return urls;
}
`;
