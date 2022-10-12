import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { createStorage } from "@koine/browser";

const back = createStorage<{ lastUrl: string }>({
  lastUrl: "",
});

export function useBackUrl() {
  const { asPath } = useRouter();
  const calledOnce = useRef(false);
  const [backUrl, setBackUrl] = useState<string | undefined>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    const prevLastUrl = back.get("lastUrl");

    // console.log("useBackUrl: prevLastUrl", prevLastUrl);
    // first set it to use on a link, set to undefined if the previous URL
    // is the same as the current one
    setBackUrl(
      asPath === prevLastUrl || !prevLastUrl ? undefined : prevLastUrl
    );
    // then update the local storage
    back.set("lastUrl", asPath);

    calledOnce.current = true;
  });

  return backUrl;
}

export default useBackUrl;
