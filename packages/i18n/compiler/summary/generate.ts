import { objectMergeWithDefaults, objectSort } from "@koine/utils";
import type { I18nCompiler } from "../types";
import { type SummaryDataOptions, summaryDataOptions } from "./data";

const getSummaryDataByPath = (data: I18nCompiler.DataSummary) => {
  let out: Record<
    string,
    Record<I18nCompiler.Locale, I18nCompiler.DataSummaryFile>
  > = {};

  for (const locale in data) {
    const dataPerLocale = data[locale];
    const { files } = dataPerLocale;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { path } = file;

      out[path] = out[path] || {};
      out[path][locale] = file;
    }
  }

  out = objectSort(out);

  return out;
};

const generateSummaryMarkdownByPath = (data: I18nCompiler.DataSummary) => {
  const dataByPath = getSummaryDataByPath(data);
  let output = "";
  let body = "";
  const locales: I18nCompiler.Locale[] = [];
  const styleBorder = `style="border-right:1px solid grey"`;

  for (const path in dataByPath) {
    const dataPerPath = dataByPath[path];

    body += `<tr>`;
    body += `<td ${styleBorder}>${path}</td>`;

    for (const locale in dataPerPath) {
      const file = dataPerPath[locale];
      const { characters, words, url } = file;

      if (!locales.includes(locale)) locales.push(locale);

      body += `<td><a href="${url}">${locale}</a></td>`;
      body += `<td>${words}</td>`;
      body += `<td ${styleBorder}>${characters}</td>`;
    }

    body += `</tr>`;
  }

  output += `<table><thead><tr>`;
  output += `<th ${styleBorder}>file path</th>`;
  output += locales
    .map(() => `<th>lang</th><th>words</th><th ${styleBorder}>chars</th>`)
    .join("");
  output += `</tr></thead><tbody>${body}</tbody></table>\n`;

  return output;
};

const generateSummaryMarkdownByLocale = (
  data: I18nCompiler.DataSummary,
  options: SummaryDataOptions,
) => {
  let output = "";
  let body = "";

  for (const locale in data) {
    const dataPerLocale = data[locale];
    const { files, characters, words } = dataPerLocale;
    const url = `${options.sourceUrl}/${locale}`;
    body += `<tr>`;
    body += `<th><a href="${url}">${locale}</a></th>`;
    body += `<td>${files.length}</td>`;
    body += `<td>${words}</td>`;
    body += `<td>${characters}</td>`;
    body += `</tr>`;
  }

  output += `<table><thead><tr>`;
  output += `<th>locale</th><th>files</th><th>words</th><th>chars</th>`;
  output += `</tr></thead><tbody>${body}</tbody></table>\n`;

  return output;
};

const generateSummaryMarkdown = (
  data: I18nCompiler.DataSummary,
  options: SummaryDataOptions,
) => {
  let output = "# Summary\n";

  output += "\n### By locale\n\n";
  output += generateSummaryMarkdownByLocale(data, options);
  output += "\n### By file path\n\n";
  output += generateSummaryMarkdownByPath(data);

  return output;
};

export let generateSummary = (
  data: I18nCompiler.DataSummary,
  options: SummaryDataOptions,
) => {
  const markdown = generateSummaryMarkdown(
    data,
    objectMergeWithDefaults(summaryDataOptions, options),
  );
  return markdown;
};
