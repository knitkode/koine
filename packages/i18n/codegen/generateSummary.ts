import { forin, mergeObjects } from "@koine/utils";
import { configDefaults } from "./getConfig";
import type { I18nCodegen } from "./types";

const getSummaryDataByPath = (data: I18nCodegen.DataSummary) => {
  let out: Record<
    string,
    Record<I18nCodegen.Locale, I18nCodegen.DataSummaryFile>
  > = {};

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
};

const generateSummaryMarkdownByPath = (data: I18nCodegen.DataSummary) => {
  const dataByPath = getSummaryDataByPath(data);
  let output = "";
  let body = "";
  const locales: I18nCodegen.Locale[] = [];
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
};

const generateSummaryMarkdownByLocale = (
  data: I18nCodegen.DataSummary,
  options: I18nCodegenSummaryOptions,
) => {
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
};

const generateSummaryMarkdown = (
  data: I18nCodegen.DataSummary,
  options: I18nCodegenSummaryOptions,
) => {
  let output = "# Summary\n";

  output += "\n### By locale\n\n";
  output += generateSummaryMarkdownByLocale(data, options);
  output += "\n### By file path\n\n";
  output += generateSummaryMarkdownByPath(data);

  return output;
};

export type I18nCodegenSummaryOptions = I18nCodegen.Config["summary"];

export let generateSummary = async (
  data: I18nCodegen.DataSummary,
  options?: Partial<I18nCodegenSummaryOptions>,
) => {
  const md = generateSummaryMarkdown(
    data,
    mergeObjects({ ...configDefaults.summary }, options || {}),
  );
  return { data: data, md };
};
