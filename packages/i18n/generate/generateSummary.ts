import { arraySum, forin, objectSortByKeysMatching } from "@koine/utils";
import type { I18nGenerate } from "./types";

export type I18nGenerateSummaryConfig = Pick<
  I18nGenerate.Config,
  "defaultLocale"
> & {
  sourceUrl: string;
};

type I18nGenerateSummaryOptions = I18nGenerate.Data & I18nGenerateSummaryConfig;

type I18nSummary = Record<
  I18nGenerate.Locale,
  {
    words: number;
    characters: number;
    files: I18nSummaryFile[];
  }
>;

type I18nSummaryByPath = Record<
  string,
  Record<I18nGenerate.Locale, I18nSummaryFile>
>;

type I18nSummaryFile = {
  locale: I18nGenerate.Locale;
  path: string;
  url: string;
  words: number;
  characters: number;
};

function getWords(
  value: string | string[] | object | object[],
  options: {} = {},
) {
  let out = "";

  if (value && typeof value === "string") {
    out += " " + value.trim();
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      out += getWords(value[i], options);
    }
  } else if (typeof value === "object") {
    for (const _key in value) {
      const key = _key as keyof typeof value;
      const single = value[key];
      out += getWords(single, options);
    }
  }

  return out;
}

function getSummaryDataEntry(
  options: I18nGenerateSummaryOptions,
  file: I18nGenerate.TranslationFile,
): I18nSummaryFile {
  const { locale, path } = file;
  const url = `${options.sourceUrl}/${locale}/${path}`;
  const words = getWords(file.data);
  const wordsCount = words.split(" ").filter(Boolean).length;
  const characters = words.split(" ").filter(Boolean).join("").length;

  return {
    characters,
    locale: locale,
    path,
    url,
    words: wordsCount,
  };
}

function getSummaryData(options: I18nGenerateSummaryOptions) {
  const { files, defaultLocale } = options;
  let data: I18nSummary = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { locale } = file;
    const entry = getSummaryDataEntry(options, file);

    data[locale] = data[locale] || {};
    data[locale].files = data[locale].files || [];
    data[locale].files.push(entry);
  }

  // sort by default locale
  data = objectSortByKeysMatching(data, defaultLocale);

  forin(data, (locale, dataPerLocale) => {
    data[locale].characters = arraySum(
      dataPerLocale.files.map((f) => f.characters),
    );

    // sort files by path
    data[locale].files = data[locale].files.sort((a, b) =>
      a.path.localeCompare(b.path),
    );

    data[locale].words = arraySum(dataPerLocale.files.map((f) => f.words));

    // sort object keys
    data[locale] = Object.fromEntries(
      Object.entries(data[locale]).sort(),
    ) as I18nSummary[I18nGenerate.Locale];
  });

  return data;
}

function getSummaryDataByPath(data: I18nSummary) {
  let out: I18nSummaryByPath = {};

  forin(data, (locale, dataPerLocale) => {
    const { files } = dataPerLocale;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { path } = file;

      out[path] = out[path] || {};
      out[path][locale] = file;
    }
  });

  out = Object.fromEntries(Object.entries(out).sort());

  return out;
}

function generateSummaryMarkdownByPath(
  _options: I18nGenerateSummaryOptions,
  data: I18nSummary,
) {
  const dataByPath = getSummaryDataByPath(data);
  let output = "";
  let body = "";
  const locales: I18nGenerate.Locale[] = [];
  const styleBorder = `style="border-right:1px solid grey"`;

  forin(dataByPath, (path, dataPerPath) => {
    body += `<tr>`;
    body += `<td ${styleBorder}>${path}</td>`;

    forin(dataPerPath, (locale, file) => {
      const { characters, words, url } = file;

      if (!locales.includes(locale)) locales.push(locale);

      body += `<td><a href="${url}">${locale}</a></td>`;
      body += `<td>${words}</td>`;
      body += `<td ${styleBorder}>${characters}</td>`;
    });

    body += `</tr>`;
  });

  output += `<table><thead><tr>`;
  output += `<th ${styleBorder}>file path</th>`;
  output += locales
    .map(() => `<th>lang</th><th>words</th><th ${styleBorder}>chars</th>`)
    .join("");
  output += `</tr></thead><tbody>${body}</tbody></table>\n`;

  return output;
}

function generateSummaryMarkdownByLocale(
  options: I18nGenerateSummaryOptions,
  data: I18nSummary,
) {
  let output = "";
  let body = "";

  forin(data, (locale, dataPerLocale) => {
    const { files, characters, words } = dataPerLocale;
    const url = `${options.sourceUrl}/${locale}`;
    body += `<tr>`;
    body += `<th><a href="${url}">${locale}</a></th>`;
    body += `<td>${files.length}</td>`;
    body += `<td>${words}</td>`;
    body += `<td>${characters}</td>`;
    body += `</tr>`;
  });

  output += `<table><thead><tr>`;
  output += `<th>locale</th><th>files</th><th>words</th><th>chars</th>`;
  output += `</tr></thead><tbody>${body}</tbody></table>\n`;

  return output;
}

function generateSummaryMarkdown(
  options: I18nGenerateSummaryOptions,
  data: I18nSummary,
) {
  let output = "# Summary\n";

  output += "\n### By locale\n\n";
  output += generateSummaryMarkdownByLocale(options, data);
  output += "\n### By file path\n\n";
  output += generateSummaryMarkdownByPath(options, data);

  return output;
}

export async function generateSummary(options: I18nGenerateSummaryOptions) {
  // const { defaultLocale, files } = options;
  // const defaultLocaleFiles = files.filter((f) => f.locale === defaultLocale);

  const data = getSummaryData(options);
  const md = generateSummaryMarkdown(options, data);

  // console.log("generateSummary: outputDir", outputDir, "outputPath", outputPath);
  return { data, md };
}
