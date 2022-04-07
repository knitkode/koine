import { useMemo } from "react";
import type { UseFormProps, FieldValues } from "react-hook-form";
import type { ObjectSchema } from "yup";
import { useForm as _useForm } from "react-hook-form";
import { yupResolver as resolver } from "@hookform/resolvers/yup";
import { useT, TranslateNamespace } from "../I18n";

export function useForm<T extends FieldValues>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ObjectSchema<any>,
  i18nNamespace: TranslateNamespace,
  formProps: UseFormProps = {},
  debug?: boolean
) {
  const t = useT(i18nNamespace);
  // const form = _useForm<InferType<ObjectSchema<T, object>>>({
  const form = _useForm<T>({
    // @ts-expect-error FIXME:
    resolver: resolver(schema),
    // make the form behave more closer as native:
    // shouldUnregister: true,
    ...formProps,
  });

  // const { control, register, setValue } = form;
  // const field = { control, register, setValue, t };

  // if ("production" !== process.env["NODE_ENV"]) {
  //   if (debug) {
  //     console.log(
  //       `Form ${i18nNamespace} data`,
  //       form.watch(),
  //       `errors: `,
  //       form.formState.errors
  //     );
  //   }
  // }
  // if (formProps.mode === "onChange") {
  //   return { field, ...form };
  // }
  return useMemo(() => {
    const { control, register, setValue } = form;
    const field = { control, register, setValue, t };
    return { field, ...form };
  }, [t, form]);
}
