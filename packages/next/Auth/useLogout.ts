import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { parseURL } from "@koine/utils";
import { useT } from "../I18n/index.js";
import { getAuthRoutes, getCallbackUrl } from "./helpers.js";

export function useLogout() {
  const t = useT();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [fail] = useState(false);

  const submit = useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setLoading(true);

      signOut({ redirect: false }).then(() => {
        setLoading(false);
        setOk(true);

        const redirectUrl = parseURL(getCallbackUrl());
        const currentUrl = parseURL(window.location.href);
        const { secured } = getAuthRoutes(t);
        const signin = t("~:/signin");
        const profile = t("~:/profile");
        const targetUrl = redirectUrl || currentUrl;
        let redirect = "";

        if (targetUrl) {
          if (targetUrl.pathname === profile) {
            redirect = signin;
          } else if (secured) {
            for (let i = 0; i < secured.length; i++) {
              if (targetUrl.pathname.match(secured[i])) {
                redirect = signin;
                break;
              }
            }
          }
        }

        if (redirect) {
          push(redirect);
        }
      });
    },
    [t, push]
  );

  // TODO: useMemo ?
  return {
    submit,
    loading,
    ok,
    fail,
  };
}
