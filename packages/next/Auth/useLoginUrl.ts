import { useEffect, useState } from "react";
import { useT } from "../I18n/index.js";
import { getAuthRoutes } from "./helpers.js";

export function useLoginUrl() {
  const [currentUrl, setCurrentUrl] = useState("");
  const t = useT();

  useEffect(() => {
    setCurrentUrl(`?callbackUrl=${window.location.href}`);
  }, []);

  return `${getAuthRoutes(t).login}${currentUrl}`;
}
