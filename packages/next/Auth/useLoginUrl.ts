import { useEffect, useState } from "react";
import { useT } from "../i18n";
import { getAuthRoutes } from "./helpers";

export function useLoginUrl() {
  const [currentUrl, setCurrentUrl] = useState("");
  const t = useT();

  useEffect(() => {
    setCurrentUrl(`?callbackUrl=${window.location.href}`);
  }, []);

  return `${getAuthRoutes(t).login}${currentUrl}`;
}
