"use client";

import { useEffect, useState } from "react";
import {
  type LocalisedPathnames,
  deriveLocalisedPathnames,
} from "./deriveLocalisedPathnames";
import { useRouteId } from "./useRouteId";

export function useCurrentLocalisedPathnames() {
  const routeId = useRouteId();
  const [urls, setUrls] = useState<LocalisedPathnames>(
    {} as LocalisedPathnames,
  );

  useEffect(() => {
    setUrls(deriveLocalisedPathnames(routeId, location));
  }, [routeId]);

  return urls;
}

export default useCurrentLocalisedPathnames;
