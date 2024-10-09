import { changeCaseSnake } from "@koine/utils";
import {
  normaliseTranslationTraceIdentifier,
  translationPathToNamespace,
} from "../../compiler/code/data-translations";
import { createGenerator } from "../../compiler/createAdapter";
import { getTranslationsDir } from "../../compiler/helpers";
import type { I18nCompiler } from "../../compiler/types";

export default createGenerator("js", (data) => {
  const {
    input,
    options: { translations: optionsTranslations },
  } = data;
  const { dir, prefix } = optionsTranslations.dictionaries;
  const { translationFiles } = input;
  const dictionariesPathsByNamespace = translationFiles.reduce(
    (map, translationFile) => {
      const { locale, path } = translationFile;
      const namespace = translationPathToNamespace(path);
      map[namespace] = map[namespace] || {};
      map[namespace][locale] = path;

      return map;
    },
    {} as Record<
      string,
      Record<
        I18nCompiler.Locale,
        I18nCompiler.DataInput["translationFiles"][number]["path"]
      >
    >,
  );
  const localeToJsIdentifier = (locale: string) => changeCaseSnake(locale);

  return Object.keys(dictionariesPathsByNamespace).reduce((map, namespace) => {
    const pathsByLocale = dictionariesPathsByNamespace[namespace];
    const fileId = `dictionary_${namespace}`;
    const fnName = normaliseTranslationTraceIdentifier(namespace, prefix);
    map[fileId] = {
      dir,
      name: fnName,
      ext: "ts",
      index: true,
      content: () => /* j s */ `
${Object.keys(pathsByLocale)
  .map(
    (locale) =>
      `import ${localeToJsIdentifier(locale)} from "${getTranslationsDir(1)}/${locale}/${pathsByLocale[locale]}";`,
  )
  .join("\n")}

/* @__NO_SIDE_EFFECTS__ */
export const ${fnName} = {
  ${Object.keys(pathsByLocale)
    .map((locale) => `"${locale}": ${localeToJsIdentifier(locale)}`)
    .join(",\n  ")}
} as const;

export default ${fnName};
`,
    };
    return map;
    // NOTE: `as never` so that we don't get a common string in the union of the generated files' ids
  }, {} as I18nCompiler.AdapterGeneratorResult) as never;
});
