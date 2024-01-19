import { arraySum, forin } from "@koine/utils";
import type { I18nIndexedFile, I18nLocale } from "./types";

export type I18nGenerateSummaryConfig = {
  defaultLocale: string;
  sourceUrl: string;
};

type Locale = string & { branded: true };

type I18nGenerateSummaryOptions = I18nGenerateSummaryConfig & {
  files: I18nIndexedFile[];
};

type I18nSummary = Record<
  Locale,
  {
    words: number;
    characters: number;
    files: I18nSummaryFile[];
  }
>;

type I18nSummaryByPath = Record<string, Record<Locale, I18nSummaryFile>>;

type I18nSummaryFile = {
  locale: Locale;
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

function i18nSummaryGetDataEntry(
  options: I18nGenerateSummaryOptions,
  file: I18nIndexedFile,
): I18nSummaryFile {
  const { locale, path } = file;
  const url = `${options.sourceUrl}/${locale}/${path}`;
  const words = getWords(file.data);
  const wordsCount = words.split(" ").filter(Boolean).length;
  const characters = words.split(" ").filter(Boolean).join("").length;

  return {
    locale: locale,
    path,
    url,
    words: wordsCount,
    characters,
  };
}

function i18nSummaryGetData(options: I18nGenerateSummaryOptions) {
  const { files, defaultLocale } = options;
  let data: I18nSummary = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { locale } = file;
    const entry = i18nSummaryGetDataEntry(options, file);

    data[locale] = data[locale] || {};
    data[locale].files = data[locale].files || [];
    data[locale].files.push(entry);
  }

  // sort by default locale
  data = Object.fromEntries(
    Object.entries(data).sort(([a]) => {
      return a === defaultLocale ? -1 : 1;
    }),
  );

  forin(data, (locale, dataPerLocale) => {
    data[locale].words = arraySum(dataPerLocale.files.map((f) => f.words));
    data[locale].characters = arraySum(
      dataPerLocale.files.map((f) => f.characters),
    );
  });

  return data;
}

function i18nSummaryGetDataByPath(data: I18nSummary) {
  const out: I18nSummaryByPath = {};

  forin(data, (locale, dataPerLocale) => {
    const { files } = dataPerLocale;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { path } = file;

      out[path] = out[path] || {};
      out[path][locale] = file;
    }
  });

  return out;
}

function i18nGenerateSummaryMarkdownByPath(
  _options: I18nGenerateSummaryOptions,
  data: I18nSummary,
) {
  const dataByPath = i18nSummaryGetDataByPath(data);
  let output = "";
  let body = "";
  const locales: I18nLocale[] = [];
  const styleBorder = `style="border-right:1px solid grey"`;

  forin(dataByPath, (path, dataPerPath) => {
    body += `<tr>`;
    body += `<td ${styleBorder}>${path}</td>`;

    forin(dataPerPath, (locale, file) => {
      const { characters, words, url } = file;

      if (!locales.includes(locale)) locales.push(locale);

      // body += `<td>`;
      // body += `<a href="${url}">${locale}`;
      // body += `</a>`;
      // body += `<br><small>${words} words</small>`;
      // body += `<br><small>${characters} chars</small>`;
      // body += `</td>`;
      body += `<td><a href="${url}">${locale}</a></td>`;
      body += `<td>${words}</td>`;
      body += `<td ${styleBorder}>${characters}</td>`;
    });

    body += `</tr>`;
  });

  output += `<table><thead><tr>`;
  output += `<th ${styleBorder}>file path</th>`;
  output += locales.map(
    () => `<th>lang</th><th>words</th><th ${styleBorder}>chars</th>`,
  );
  output += `</tr></thead><tbody>${body}</tbody></table>\n`;

  return output;
}

function i18nGenerateSummaryMarkdownByLocale(
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

function i18nGenerateSummaryMarkdown(
  options: I18nGenerateSummaryOptions,
  data: I18nSummary,
) {
  let output = "# Summary\n";

  output += "\n### By locale\n\n";
  output += i18nGenerateSummaryMarkdownByLocale(options, data);
  output += "\n### By file path\n\n";
  output += i18nGenerateSummaryMarkdownByPath(options, data);

  return output;
}

export async function i18nGenerateSummary(options: I18nGenerateSummaryOptions) {
  // const { defaultLocale, files } = options;
  // const defaultLocaleFiles = files.filter((f) => f.locale === defaultLocale);

  const data = i18nSummaryGetData(options);
  const md = i18nGenerateSummaryMarkdown(options, data);

  // console.log("i18nGenerateSummary: outputDir", outputDir, "outputPath", outputPath);
  return { data, md };
}
