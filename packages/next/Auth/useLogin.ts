import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { SubmitHandler } from "react-hook-form";
import { parseURL } from "@koine/utils";
import { useT } from "../i18n";
import { getAuthRoutes, getCallbackUrl } from "./helpers";

export function useLogin<LoginForm extends {} = {}>() {
  const t = useT();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [fail, setFail] = useState(false);

  const submit: SubmitHandler<LoginForm> = useCallback(
    (data) => {
      setLoading(true);
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        // @ts-expect-error FIXME: at some point...
        .then(({ ok }) => {
          setLoading(false);
          setOk(ok);
          setFail(!ok);

          if (ok) {
            const redirectUrl = parseURL(getCallbackUrl());
            const { login, register, profile } = getAuthRoutes(t);

            if (redirectUrl) {
              const redirectPath = redirectUrl.pathname;

              if (
                profile &&
                (redirectPath === login || redirectPath === register)
              ) {
                push(profile);
              } else {
                push(redirectPath + redirectUrl.search);
              }
            } else if (profile) {
              push(profile);
            }
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
